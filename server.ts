import express from "express";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load configuration from .env file
dotenv.config();

const app = express();
const PORT = 3000;
const DATA_FILE_PATH = path.join(process.cwd(), "data", "school_info.json");

// Middleware
app.use(express.json());

// Memory store for active admin sessions and login captchas
const activeSessions = new Set<string>();
interface CaptchaChallenge {
  answer: number;
  expiresAt: number;
}
const captchaStore = new Map<string, CaptchaChallenge>();

// Clean up expired captchas every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, challenge] of captchaStore.entries()) {
    if (now > challenge.expiresAt) {
      captchaStore.delete(id);
    }
  }
}, 15 * 60 * 1000);

// Helper to write to .env file to keep .env in sync with UI password/username changes
async function updateEnvFile(username?: string, password?: string) {
  const envPath = path.join(process.cwd(), ".env");
  try {
    let content = "";
    try {
      content = await fs.readFile(envPath, "utf-8");
    } catch {
      // If it fails (e.g., file not found), start fresh
      content = "";
    }

    let lines = content.split(/\r?\n/);
    let adminPassFound = false;
    let adminUserFound = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("ADMIN_PASSWORD=")) {
        if (password) {
          lines[i] = `ADMIN_PASSWORD=${password}`;
          adminPassFound = true;
        }
      } else if (line.startsWith("ADMIN_USERNAME=")) {
        if (username) {
          lines[i] = `ADMIN_USERNAME=${username}`;
          adminUserFound = true;
        }
      }
    }

    if (username && !adminUserFound) {
      lines.push(`ADMIN_USERNAME=${username}`);
    }
    if (password && !adminPassFound) {
      lines.push(`ADMIN_PASSWORD=${password}`);
    }

    await fs.writeFile(envPath, lines.join("\n"), "utf-8");
    
    // Update process.env runtime variables immediately so the session survives on the same run
    if (username) process.env.ADMIN_USERNAME = username;
    if (password) process.env.ADMIN_PASSWORD = password;
  } catch (error) {
    console.error("Failed to update .env file:", error);
  }
}

// Helper to read school info
async function readSchoolInfo(): Promise<any> {
  const envUsername = process.env.ADMIN_USERNAME || "admin";
  const envPassword = process.env.ADMIN_PASSWORD || "Admin@Concept2083";

  const defaultClasses = ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7"];
  const defaultFees = defaultClasses.map(cls => ({
    className: cls,
    admissionFee: 0,
    monthlyFee: 0,
    examFee: 0,
    computerFee: 0,
    tcFee: 0,
    marksheetFee: 0,
    miscFee: 0
  }));

  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(data);
    
    // Let .env take ultimate priority so manual server resets/changes in .env take precedence immediately after restarting
    if (process.env.ADMIN_USERNAME) {
      parsed.adminUsername = process.env.ADMIN_USERNAME;
    } else if (!parsed.adminUsername) {
      parsed.adminUsername = envUsername;
    }
    
    if (process.env.ADMIN_PASSWORD) {
      parsed.adminPassword = process.env.ADMIN_PASSWORD;
    } else if (!parsed.adminPassword) {
      parsed.adminPassword = envPassword;
    }

    if (!parsed.fees || !Array.isArray(parsed.fees) || parsed.fees.length === 0) {
      parsed.fees = defaultFees;
    }
    
    return parsed;
  } catch (error) {
    // Return standard dummy schema if file reading fails
    return {
      adminUsername: envUsername,
      adminPassword: envPassword,
      tickerMessage: "New Admission Started for 2083 Session. Limited Scholarship Slots. * !!Admission Open!! * !!Admission Now!!",
      notices: [],
      drafts: [],
      fees: defaultFees,
      admissions: []
    };
  }
}

// Helper to write school info
async function writeSchoolInfo(info: any): Promise<boolean> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(info, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to write school info database:", error);
    return false;
  }
}

// Ensure database file directory exists
async function ensureDataPath() {
  const dir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Middleware to verify session tokens (supports stateless signatures to survive server restarts)
async function verifyAdminToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Access Denied. Authorization Header missing!" });
  }
  const token = authHeader.replace("Bearer ", "");
  if (activeSessions.has(token)) {
    return next();
  }

  // Fallback to stateless JWT-like token verification to survive restarts
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const [username, expiryStr, hash] = parts;
      const expiry = parseInt(expiryStr, 10);
      if (Date.now() <= expiry) {
        const info = await readSchoolInfo();
        const systemUsername = info.adminUsername || "admin";
        if (username.toLowerCase() === systemUsername.toLowerCase()) {
          const expectedHash = crypto
            .createHmac("sha256", info.adminPassword)
            .update(`${username}.${expiryStr}`)
            .digest("hex");
          if (hash === expectedHash) {
            activeSessions.add(token);
            return next();
          }
        }
      }
    }
  } catch (err) {
    console.error("Stateless signature verification error:", err);
  }

  return res.status(401).json({ error: "Session expired or invalid token. Please log in again." });
}

// -- API ROUTES --

// Fetch current public school info
app.get("/api/school-data", async (req, res) => {
  try {
    const info = await readSchoolInfo();
    // Do not return raw password to client
    const { adminPassword, ...publicInfo } = info;
    if (!publicInfo.drafts) {
      publicInfo.drafts = [];
    }
    if (!publicInfo.admissions) {
      publicInfo.admissions = [];
    }
    // Prevent browser and CDN caching of public school info
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.json(publicInfo);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read data: " + err.message });
  }
});

// Captcha challenge generator endpoint (bot mitigation)
app.get("/api/captcha", (req, res) => {
  const num1 = Math.floor(Math.random() * 15) + 3;
  const num2 = Math.floor(Math.random() * 15) + 3;
  const answer = num1 + num2;
  const challengeId = crypto.randomUUID();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins validity

  captchaStore.set(challengeId, { answer, expiresAt });
  res.json({
    challengeId,
    question: `Solve this puzzle to verify you are a human: What is ${num1} + ${num2}?`
  });
});

// Admin Authentication endpoint
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password, answer, challengeId } = req.body;

    // Validate CAPTCHA
    if (!challengeId || answer === undefined) {
      return res.status(400).json({ error: "Verification required! Answer the security puzzle." });
    }
    const challenge = captchaStore.get(challengeId);
    if (!challenge) {
      return res.status(400).json({ error: "Security challenge expired! Please request a new puzzle." });
    }
    // Delete the used captcha to prevent reuse
    captchaStore.delete(challengeId);

    if (Date.now() > challenge.expiresAt) {
      return res.status(400).json({ error: "Security puzzle expired!" });
    }
    if (parseInt(answer, 10) !== challenge.answer) {
      return res.status(400).json({ error: "Incorrect security code/calculation!" });
    }

    // Validate username and password
    const info = await readSchoolInfo();
    const systemUsername = info.adminUsername || "admin";
    if (
      !username || 
      username.trim().toLowerCase() !== systemUsername.toLowerCase() || 
      !password || 
      password !== info.adminPassword
    ) {
      // Brute-force delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return res.status(401).json({ error: "Invalid administrative credentials!" });
    }

        // Generate valid stateless session token that survives server restarts
    const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days token
    const tokenMessage = `${username.trim().toLowerCase()}.${expiry}`;
    const hash = crypto.createHmac("sha256", info.adminPassword).update(tokenMessage).digest("hex");
    const token = `${tokenMessage}.${hash}`;
    activeSessions.add(token);

    res.json({ success: true, token });
  } catch (err: any) {
    res.status(500).json({ error: "Server authentication error: " + err.message });
  }
});

// Log out active admin
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    activeSessions.delete(token);
  }
  res.json({ success: true, message: "Logged out successfully" });
});

// Validate session active status
app.get("/api/admin/verify", verifyAdminToken, (req, res) => {
  res.json({ active: true });
});

// Change Admin Password / Credentials
app.post("/api/admin/change-password", verifyAdminToken, async (req, res) => {
  try {
    const { oldPassword, newUsername, newPassword } = req.body;
    const info = await readSchoolInfo();
    if (oldPassword !== info.adminPassword) {
      return res.status(400).json({ error: "Old password did not match configuration!" });
    }
    
    if (newUsername && newUsername.trim().length >= 3) {
      info.adminUsername = newUsername.trim();
    }
    
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long." });
      }
      info.adminPassword = newPassword;
    }
    
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    // Synchronize to the .env file as well to keep changes mirrored
    await updateEnvFile(info.adminUsername, info.adminPassword);

    res.json({ success: true, message: "Admin credentials successfully changed!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update ticker message on Home page
app.put("/api/school-data/ticker", verifyAdminToken, async (req, res) => {
  try {
    const { tickerMessage } = req.body;
    if (tickerMessage === undefined) {
      return res.status(400).json({ error: "Ticker message content is empty!" });
    }
    const info = await readSchoolInfo();
    info.tickerMessage = tickerMessage.trim();
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, message: "Homepage running notice updated successfully!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update entire classes fee schedule
app.put("/api/school-data/fees", verifyAdminToken, async (req, res) => {
  try {
    const { fees } = req.body;
    if (!Array.isArray(fees)) {
      return res.status(400).json({ error: "Invalid layout for fee entries. Must be an array." });
    }
    const info = await readSchoolInfo();
    info.fees = fees.map(f => ({
      className: String(f.className),
      admissionFee: Math.max(0, parseInt(f.admissionFee, 10) || 0),
      monthlyFee: Math.max(0, parseInt(f.monthlyFee, 10) || 0),
      examFee: Math.max(0, parseInt(f.examFee, 10) || 0),
      computerFee: Math.max(0, parseInt(f.computerFee, 10) || 0),
      tcFee: Math.max(0, parseInt(f.tcFee, 10) || 0),
      marksheetFee: Math.max(0, parseInt(f.marksheetFee, 10) || 0),
      miscFee: Math.max(0, parseInt(f.miscFee, 10) || 0)
    }));
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, message: "Class Fee schedule updated successfully!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Add new Notice (Live or Draft)
app.post("/api/school-data/notices", verifyAdminToken, async (req, res) => {
  try {
    const { title, cat, desc, date, isDraft } = req.body;
    if (!title || !cat || !desc) {
      return res.status(400).json({ error: "Title, Category, and Details are required!" });
    }
    const info = await readSchoolInfo();
    const newNotice = {
      id: "notice-" + Date.now(),
      date: date || new Date().toLocaleDateString("en-NP", { month: "long", day: "numeric", year: "numeric" }),
      title: String(title).trim(),
      cat: String(cat).trim(),
      desc: String(desc).trim()
    };
    
    // Support parsing both boolean type and JSON string payload
    const shouldSaveAsDraft = isDraft === true || String(isDraft) === "true";
    if (shouldSaveAsDraft) {
      info.drafts = info.drafts || [];
      info.drafts.unshift(newNotice);
    } else {
      info.notices.unshift(newNotice);
    }

    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, notice: newNotice });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Notice (Live or Draft)
app.put("/api/school-data/notices/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, cat, desc, date } = req.body;
    if (!title || !cat || !desc) {
      return res.status(400).json({ error: "All notice elements must be provided." });
    }
    const info = await readSchoolInfo();
    
    // Check in live notices first
    const noticeIndex = info.notices.findIndex((n: any) => String(n.id) === String(id));
    if (noticeIndex !== -1) {
      info.notices[noticeIndex] = {
        ...info.notices[noticeIndex],
        title: String(title).trim(),
        cat: String(cat).trim(),
        desc: String(desc).trim(),
        date: date || info.notices[noticeIndex].date
      };
      
      const ok = await writeSchoolInfo(info);
      if (!ok) return res.status(500).json({ error: "Failed to write database changes" });
      return res.json({ success: true, notice: info.notices[noticeIndex] });
    }
    
    // Check in drafts
    info.drafts = info.drafts || [];
    const draftIndex = info.drafts.findIndex((d: any) => String(d.id) === String(id));
    if (draftIndex !== -1) {
      info.drafts[draftIndex] = {
        ...info.drafts[draftIndex],
        title: String(title).trim(),
        cat: String(cat).trim(),
        desc: String(desc).trim(),
        date: date || info.drafts[draftIndex].date
      };
      
      const ok = await writeSchoolInfo(info);
      if (!ok) return res.status(500).json({ error: "Failed to write database changes" });
      return res.json({ success: true, notice: info.drafts[draftIndex] });
    }

    return res.status(404).json({ error: "Notice element not found!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Live Notice Permanently (Now performs true complete deletion)
app.delete("/api/school-data/notices/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const info = await readSchoolInfo();
    info.notices = info.notices || [];
    
    const originalLength = info.notices.length;
    info.notices = info.notices.filter((n: any) => String(n.id) !== String(id));
    
    if (info.notices.length === originalLength) {
      return res.status(404).json({ error: "Notice element not found in live archive!" });
    }
    
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, message: "Notice deleted permanently from live database!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Publish Draft Notice -> Moves Draft to Live Notices
app.post("/api/school-data/drafts/:id/publish", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const info = await readSchoolInfo();
    info.drafts = info.drafts || [];
    
    const draftNotice = info.drafts.find((d: any) => String(d.id) === String(id));
    if (!draftNotice) {
      return res.status(404).json({ error: "Draft element not found!" });
    }
    
    // Add to live notices
    info.notices.unshift(draftNotice);
    // Remove from drafts list
    info.drafts = info.drafts.filter((d: any) => String(d.id) !== String(id));
    
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, notice: draftNotice, message: "Draft notice published to live portal!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Revert Live Notice to Draft -> Moves Live to Drafts list
app.post("/api/school-data/notices/:id/revert", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const info = await readSchoolInfo();
    info.drafts = info.drafts || [];
    
    const liveNotice = info.notices.find((n: any) => String(n.id) === String(id));
    if (!liveNotice) {
      return res.status(404).json({ error: "Live notice element not found!" });
    }
    
    // Add to drafts list
    info.drafts.unshift(liveNotice);
    // Remove from live notices
    info.notices = info.notices.filter((n: any) => String(n.id) !== String(id));
    
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, notice: liveNotice, message: "Live notice reverted to drafts successfully!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Draft Permanently -> Purges completely
app.delete("/api/school-data/drafts/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const info = await readSchoolInfo();
    info.drafts = info.drafts || [];
    const originalLength = info.drafts.length;
    info.drafts = info.drafts.filter((d: any) => String(d.id) !== String(id));
    
    if (info.drafts.length === originalLength) {
      return res.status(404).json({ error: "Draft not found!" });
    }
    
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, message: "Draft deleted permanently!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMISSION PATHS ---

// 1. Submit a public admission inquiry form
app.post("/api/school-data/admissions", async (req, res) => {
  try {
    const { studentName, targetClass, guardianContact, address, previousSchool } = req.body;
    if (!studentName || !targetClass || !guardianContact || !address) {
      return res.status(400).json({ error: "Student Name, Target Class, Guardian Contact and Address are required!" });
    }
    const info = await readSchoolInfo();
    info.admissions = info.admissions || [];

    const newRequest = {
      id: "adm-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      studentName: String(studentName).trim(),
      targetClass: String(targetClass).trim(),
      guardianContact: String(guardianContact).trim(),
      address: String(address).trim(),
      previousSchool: String(previousSchool || "").trim(),
      status: "requested",
      createdAt: new Date().toISOString()
    };

    info.admissions.unshift(newRequest);
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, admission: newRequest });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Update admission status (Verify Admin token)
app.put("/api/school-data/admissions/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["requested", "confirmed", "saved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value!" });
    }

    const info = await readSchoolInfo();
    info.admissions = info.admissions || [];

    const reqIndex = info.admissions.findIndex((a: any) => String(a.id) === String(id));
    if (reqIndex === -1) {
      return res.status(404).json({ error: "Admission request not found!" });
    }

    info.admissions[reqIndex].status = status;
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, admission: info.admissions[reqIndex] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Delete admission inquiry completely (Verify Admin Token)
app.delete("/api/school-data/admissions/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const info = await readSchoolInfo();
    info.admissions = info.admissions || [];

    const originalLength = info.admissions.length;
    info.admissions = info.admissions.filter((a: any) => String(a.id) !== String(id));

    if (info.admissions.length === originalLength) {
      return res.status(404).json({ error: "Admission request not found!" });
    }

    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to write database changes" });

    res.json({ success: true, message: "Admission request deleted permanently!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  await ensureDataPath();

  // Pre-initialize and persist default fees array if empty
  try {
    const info = await readSchoolInfo();
    await writeSchoolInfo(info);
  } catch (err) {
    console.error("Failed to pre-populate default fees on startup:", err);
  }

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server successfully running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
