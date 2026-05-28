import express from "express";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load configuration from .env file
dotenv.config();

const app = express();
const PORT = 3000;
const DATA_FILE_PATH = path.join(process.cwd(), "data", "school_info.json");

// Middleware with higher limits for base64 file uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

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
    transportationFee: 0,
    miscFee: 0
  }));

  const defaultWebsiteContent = {
    schoolName: "New Concept Secondary School",
    principalName: "Kaushlendra Giri",
    principalRole: "Principal / Founder",
    principalQuote: "Our Vision Is To Build Character Before Carriers.",
    principalBio: "At New Concept, we believe every child is a potential masterpiece. Our goal is to provide the canvas, the colors, and the technique to let their inner brilliance shine brightly in the heart of Madhesh.",
    principalStat: "Ranked #1 for basic education institutional standards in Ekdara block for 3 consecutive years.",
    principalPhoto: "",
    campusPhoto1: "",
    campusPhoto2: "",
    campusPhoto3: "",
    faculty: [
      { id: "fac-sita", name: "Sita Kumari Sah", role: "Primary Coordinator", qual: "M.Ed in English", desc: "With 12 years of experience, she leads the linguistic foundation of our young scholars with passion.", img: "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=2070&auto=format&fit=crop" },
      { id: "fac-pukar", name: "Pukar Mandal", role: "Sr. Administrator", qual: "MBA (Human Resources)", desc: "The operational backbone of New Concept, ensuring seamless academic management and student support.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
      { id: "fac-kd", name: "K.D Sir", role: "Principal", qual: "M.A. (Ed. Admin)", desc: "A visionary leader focus on character building and institutional discipline.", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1974&auto=format&fit=crop" },
      { id: "fac-anish", name: "Anish Gupta", role: "ICT Instructor", qual: "B.Tech in CS", desc: "Bridging the gap between traditional learning and modern technology for our students.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" },
      { id: "fac-sunita", name: "Sunita Yadav", role: "Early Childhood Lead", qual: "B.Ed (Child Psych)", desc: "Specializes in play-based learning and cognitive development for Nursery students.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
      { id: "fac-kaviraj", name: "Kavi Raj Jha", role: "Mathematics Dept.", qual: "M.Sc in Applied Math", desc: "Simplifying complex numbers into fun challenges for primary grade students.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" }
    ],
    // Hero Defaults
    heroPhoto: "",
    heroTagline: "Ekdara's Premier Academic Institution",
    heroSubheader: "Empowering Young Minds",
    heroDesc: "Providing a world-class English medium foundation for children from Nursery to Grade 7 with a focus on holistic development, modern digital tools, and deep character building.",
    
    // Spotlight Defaults
    spotlightPhoto: "",
    spotlightTag: "Learning Spotlight",
    spotlightTitle: "Empowering with Modern Technology Integration",
    
    // Admissions BG
    admissionsBgPhoto: "",

    // School Contacts
    schoolPhone: "+977-9817681582, +977-9801625299",
    schoolEmail: "info@newconceptschool.edu.np",
    schoolAddress: "Ekdara Ward No. 3, Mahottari, Madhesh Province, Nepal",
    schoolGoogleMaps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564.931215431697!2d85.78204207613618!3d26.68752677002013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec191716e45d2b%3A0xc2816934fa793984!2snew%20concept%20english%20medium%20boarding%20school!5e0!3m2!1sen!2snp!4v1716400000000!5m2!1sen!2snp",

    outreachTeam: [
      { id: "out-pukar", name: "Pukar Mandal", role: "Sr. Administrator", phone: "+977-9817681582", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
      { id: "out-suman", name: "Suman Kumar", role: "Admission Head", phone: "+977-9817681582", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
      { id: "out-anita", name: "Anita Kumari", role: "Public Relations", phone: "+977-9817681582", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
      { id: "out-vikram", name: "Vikram Shah", role: "Logistics Mgr", phone: "+977-9817681582", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" }
    ],

    galleryPhotos: [
      { id: "gal-1", src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop", title: "Smart Science Lab", desc: "Advanced laboratory setup for basic experimentation and conceptual research." },
      { id: "gal-2", src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop", title: "Morning Assembly", desc: "Inculcating discipline and national pride through daily prayers and updates." },
      { id: "gal-3", src: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop", title: "ICT Learning Hub", desc: "Where students interact with digital worlds and coding fundamentals." },
      { id: "gal-4", src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop", title: "Cultural Festival", desc: "Celebrating the vibrant heritage of Madhesh through art, dance, and music." },
      { id: "gal-5", src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2132&auto=format&fit=crop", title: "Sports Pavilion", desc: "Promoting physical wellness and competitive spirit in athletics." },
      { id: "gal-6", src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2070&auto=format&fit=crop", title: "Play Area", desc: "Safe and modern recreational spaces for Nursery and Kindergarten scholars." }
    ],

    coursePrograms: [
      { id: "crs-nursery", name: "Nursery", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2070&auto=format&fit=crop", desc: "The beginning of a beautiful journey. We focus on play-based motor skill development and sensory learning.", focus: "Cognitive Play, Social Interaction, Art & Music" },
      { id: "crs-lkgukg", name: "LKG & UKG", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop", desc: "Preparing young minds for formal education with phonetic sounds, elementary counting, and etiquette.", focus: "Early Literacy, Numerical Foundation, Team Building" },
      { id: "crs-g13", name: "Grade 1 - 3", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop", desc: "Core conceptual learning in English, Maths, and Social Science through project-based teaching methodologies.", focus: "Reading Fluency, Logical Math, Cultural Studies" },
      { id: "crs-g45", name: "Grade 4 - 5", img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop", desc: "Transitioning into advanced analytical thinking and environmental awareness in preparation for upper-primary.", focus: "Complex Sci-Inquiry, Grammar Mastery, Social Responsibility" },
      { id: "crs-g67", name: "Grade 6 - 7", img: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop", desc: "Transitioning into advanced analytical thinking, computer applications, and digital literacy to face lower-secondary challenges.", focus: "Advanced Mathematics, Technology Basics, Leadership & Civic Sense" }
    ]
  };

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
    } else {
      parsed.fees = parsed.fees.map((f: any) => {
        const sanitized: any = { className: String(f.className) };
        for (const key of Object.keys(f)) {
          if (key === "className") continue;
          sanitized[key] = Math.max(0, Number(f[key]) || 0);
        }
        return sanitized;
      });
    }

    if (!parsed.monthlyFeeCategories || !Array.isArray(parsed.monthlyFeeCategories)) {
      parsed.monthlyFeeCategories = ["monthlyFee", "computerFee", "transportationFee"];
    }
    if (!parsed.yearlyFeeCategories || !Array.isArray(parsed.yearlyFeeCategories)) {
      parsed.yearlyFeeCategories = ["admissionFee", "examFee", "miscFee"];
    }

    if (!parsed.websiteContent) {
      parsed.websiteContent = defaultWebsiteContent;
    } else {
      // Safely bootstrap any missing config settings
      for (const [key, value] of Object.entries(defaultWebsiteContent)) {
        if (parsed.websiteContent[key] === undefined) {
          parsed.websiteContent[key] = value;
        }
      }
    }
    
    if (!parsed.adminNotifications || !Array.isArray(parsed.adminNotifications)) {
      parsed.adminNotifications = [];
    }
    if (!parsed.publicNotifications || !Array.isArray(parsed.publicNotifications)) {
      parsed.publicNotifications = [];
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
      monthlyFeeCategories: ["monthlyFee", "computerFee", "transportationFee"],
      yearlyFeeCategories: ["admissionFee", "examFee", "miscFee"],
      admissions: [],
      websiteContent: defaultWebsiteContent,
      adminNotifications: [],
      publicNotifications: []
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

// Active Verification and File Upload Protection against unauthorized or non-safe files
// This helper extracts content, determines format, checks file signatures/magic words,
// generates a localized randomly hashed name, and writes it to disk safely.
async function validateAndSaveBase64File(base64Data: string, prefix: "cert" | "photo" | "notice"): Promise<string | null> {
  if (!base64Data) return null;
  
  try {
    const matches = base64Data.match(/^data:([^;]+);base64,(.*)$/);
    if (!matches) return null;
    
    const mimeType = matches[1].toLowerCase();
    const base64Content = matches[2];
    
    let extension = "";
    if (mimeType === "application/pdf") {
      extension = ".pdf";
    } else if (mimeType === "image/png") {
      extension = ".png";
    } else if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      extension = ".jpg";
    } else if (mimeType === "image/webp") {
      extension = ".webp";
    } else {
      return null; // Rejected content type
    }
    
    const buffer = Buffer.from(base64Content, "base64");
    if (buffer.length === 0) return null;

    // Strict Magic Byte verification - hacker file execution spoof warning
    if (extension === ".pdf") {
      // PDF: %PDF-(25 50 44 46)
      if (buffer.length < 4 || buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
        return null;
      }
    } else if (extension === ".png") {
      // PNG: 89 50 4E 47
      if (buffer.length < 4 || buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4E || buffer[3] !== 0x47) {
        return null;
      }
    } else if (extension === ".jpg") {
      // JPEG: FF D8 FF
      if (buffer.length < 3 || buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
        return null;
      }
    } else if (extension === ".webp") {
      // WEBP: RIFF ... WEBP
      if (buffer.length < 12 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
        return null;
      }
    }

    const randomHash = crypto.randomBytes(8).toString("hex");
    const filename = `${prefix}-${Date.now()}-${randomHash}${extension}`;
    const targetPath = path.join(process.cwd(), "uploads", filename);
    
    // Explicitly write with mode 0o644 (owner write/read, others read, absolutely non-executable)
    await fs.writeFile(targetPath, buffer, { mode: 0o644 });
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error securing uploaded base64 file:", error);
    return null;
  }
}

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

// Update dynamic website layout content (Principal Desk + Faculty + School name)
app.put("/api/school-data/website-content", verifyAdminToken, async (req, res) => {
  try {
    const updatedContent = req.body;
    if (!updatedContent || typeof updatedContent !== "object") {
      return res.status(400).json({ error: "Invalid dynamic CMS payload" });
    }

    const info = await readSchoolInfo();
    
    // Sanitize and copy values
    info.websiteContent = info.websiteContent || {};
    for (const key of Object.keys(updatedContent)) {
      if (["faculty", "outreachTeam", "galleryPhotos", "coursePrograms", "features", "timelineEvents"].includes(key)) {
        continue;
      }
      info.websiteContent[key] = String(updatedContent[key] ?? "").trim();
    }

    if (Array.isArray(updatedContent.faculty)) {
      info.websiteContent.faculty = updatedContent.faculty.map((member: any) => ({
        id: member.id || "fac-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        name: String(member.name || "").trim(),
        role: String(member.role || "").trim(),
        qual: String(member.qual || "").trim(),
        desc: String(member.desc || "").trim(),
        img: String(member.img || "").trim()
      }));
    }

    if (Array.isArray(updatedContent.outreachTeam)) {
      info.websiteContent.outreachTeam = updatedContent.outreachTeam.map((member: any) => ({
        id: member.id || "out-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        name: String(member.name || "").trim(),
        role: String(member.role || "").trim(),
        phone: String(member.phone || "").trim(),
        img: String(member.img || "").trim()
      }));
    }

    if (Array.isArray(updatedContent.galleryPhotos)) {
      info.websiteContent.galleryPhotos = updatedContent.galleryPhotos.map((photo: any) => {
        const urlValue = String(photo.url || photo.src || "").trim();
        return {
          id: photo.id || "gal-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          url: urlValue,
          src: urlValue,
          title: String(photo.title || "").trim(),
          category: String(photo.category || "").trim(),
          desc: String(photo.desc || '').trim() || String(photo.category || "").trim()
        };
      });
    }

    if (Array.isArray(updatedContent.coursePrograms)) {
      info.websiteContent.coursePrograms = updatedContent.coursePrograms.map((prog: any) => ({
        id: prog.id || "prog-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        name: String(prog.name || "").trim(),
        img: String(prog.img || "").trim(),
        desc: String(prog.desc || "").trim(),
        focus: String(prog.focus || "").trim()
      }));
    }

    if (Array.isArray(updatedContent.features)) {
      info.websiteContent.features = updatedContent.features.map((feat: any) => ({
        id: feat.id || "feat-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        title: String(feat.title || "").trim(),
        desc: String(feat.desc || "").trim(),
        img: String(feat.img || "").trim(),
        localName: String(feat.localName || "").trim()
      }));
    }

    if (Array.isArray(updatedContent.timelineEvents)) {
      info.websiteContent.timelineEvents = updatedContent.timelineEvents.map((evt: any) => ({
        id: evt.id || "evt-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        time: String(evt.time || "").trim(),
        event: String(evt.event || "").trim(),
        img: String(evt.img || "").trim(),
        localName: String(evt.localName || "").trim()
      }));
    }

    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to save website dynamic content" });

    res.json({ success: true, message: "School dynamic content CMS updated successfully!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update entire classes fee schedule
app.put("/api/school-data/fees", verifyAdminToken, async (req, res) => {
  try {
    const { fees, monthlyFeeCategories, yearlyFeeCategories } = req.body;
    if (!Array.isArray(fees)) {
      return res.status(400).json({ error: "Invalid layout for fee entries. Must be an array." });
    }
    const info = await readSchoolInfo();
    
    // Dynamically store all class fees based on what's received
    info.fees = fees.map((f: any) => {
      const sanitized: any = { className: String(f.className) };
      for (const key of Object.keys(f)) {
        if (key === "className") continue;
        sanitized[key] = Math.max(0, Number(f[key]) || 0);
      }
      return sanitized;
    });

    if (Array.isArray(monthlyFeeCategories)) {
      info.monthlyFeeCategories = monthlyFeeCategories.map(c => String(c).trim());
    }
    if (Array.isArray(yearlyFeeCategories)) {
      info.yearlyFeeCategories = yearlyFeeCategories.map(c => String(c).trim());
    }

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
    const { title, cat, desc, date, isDraft, attachmentBase64, attachmentName } = req.body;
    if (!title || !cat || !desc) {
      return res.status(400).json({ error: "Title, Category, and Details are required!" });
    }

    let finalAttachmentUrl = "";
    if (attachmentBase64) {
      const savedUrl = await validateAndSaveBase64File(attachmentBase64, "notice");
      if (savedUrl) {
        finalAttachmentUrl = savedUrl;
      }
    }

    const info = await readSchoolInfo();
    const newNotice = {
      id: "notice-" + Date.now(),
      date: date || new Date().toLocaleDateString("en-NP", { month: "long", day: "numeric", year: "numeric" }),
      title: String(title).trim(),
      cat: String(cat).trim(),
      desc: String(desc).trim(),
      attachmentUrl: finalAttachmentUrl || undefined,
      attachmentName: finalAttachmentUrl ? (attachmentName || "Attached_Document") : undefined
    };
    
    // Support parsing both boolean type and JSON string payload
    const shouldSaveAsDraft = isDraft === true || String(isDraft) === "true";
    if (shouldSaveAsDraft) {
      info.drafts = info.drafts || [];
      info.drafts.unshift(newNotice);
    } else {
      info.notices.unshift(newNotice);
      
      // Notify students/parents of new notice
      const newPublicNotification = {
        id: "pn-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        title: "New Notice Posted",
        message: `A new notice has been posted: "${String(title).trim()}" in category "${String(cat).trim()}"`,
        createdAt: new Date().toISOString(),
        read: false
      };
      info.publicNotifications = info.publicNotifications || [];
      info.publicNotifications.unshift(newPublicNotification);
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
    const { title, cat, desc, date, attachmentBase64, attachmentName, attachmentUrl } = req.body;
    if (!title || !cat || !desc) {
      return res.status(400).json({ error: "All notice elements must be provided." });
    }

    let finalAttachmentUrl = attachmentUrl || "";
    let finalAttachmentName = attachmentName || "";

    if (attachmentBase64) {
      const savedUrl = await validateAndSaveBase64File(attachmentBase64, "notice");
      if (savedUrl) {
        finalAttachmentUrl = savedUrl;
        finalAttachmentName = attachmentName || "Attached_Document";
      }
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
        date: date || info.notices[noticeIndex].date,
        attachmentUrl: finalAttachmentUrl || undefined,
        attachmentName: finalAttachmentUrl ? (finalAttachmentName || "Attached_Document") : undefined
      };
      
      // Notify students/parents of updated notice
      const newPublicNotification = {
        id: "pn-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        title: "Notice Updated",
        message: `Notice updated: "${String(title).trim()}" in category "${String(cat).trim()}"`,
        createdAt: new Date().toISOString(),
        read: false
      };
      info.publicNotifications = info.publicNotifications || [];
      info.publicNotifications.unshift(newPublicNotification);
      
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
        date: date || info.drafts[draftIndex].date,
        attachmentUrl: finalAttachmentUrl || undefined,
        attachmentName: finalAttachmentUrl ? (finalAttachmentName || "Attached_Document") : undefined
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
    
    // Notify students/parents of newly published notice
    const newPublicNotification = {
      id: "pn-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      title: "Notice Published",
      message: `A notice has been published: "${String(draftNotice.title).trim()}" in category "${String(draftNotice.cat).trim()}"`,
      createdAt: new Date().toISOString(),
      read: false
    };
    info.publicNotifications = info.publicNotifications || [];
    info.publicNotifications.unshift(newPublicNotification);
    
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
    const { studentName, targetClass, guardianContact, address, previousSchool, birthCertificate, studentPhoto } = req.body;
    if (!studentName || !targetClass || !guardianContact || !address) {
      return res.status(400).json({ error: "Student Name, Target Class, Guardian Contact and Address are required!" });
    }

    // Process secure file uploads
    let birthCertUrl = "";
    if (birthCertificate) {
      const savedPath = await validateAndSaveBase64File(birthCertificate, "cert");
      if (savedPath) {
        birthCertUrl = savedPath;
      } else {
        return res.status(400).json({ error: "Invalid birth certificate file format! Only secure PDF and images are allowed." });
      }
    }

    let photoUrl = "";
    if (studentPhoto) {
      const savedPath = await validateAndSaveBase64File(studentPhoto, "photo");
      if (savedPath) {
        photoUrl = savedPath;
      } else {
        return res.status(400).json({ error: "Invalid student picture file format! Only safe images are allowed." });
      }
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
      birthCertificate: birthCertUrl,
      studentPhoto: photoUrl,
      status: "requested",
      createdAt: new Date().toISOString()
    };

    info.admissions.unshift(newRequest);
    
    // Create Admin Notification when an admission form is submitted
    const newAdminNotification = {
      id: "an-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      title: "New Admission Inquiry",
      message: `Inquiry submitted for ${studentName} (Class: ${targetClass}) by guardian (${guardianContact}).`,
      createdAt: new Date().toISOString(),
      read: false
    };
    info.adminNotifications = info.adminNotifications || [];
    info.adminNotifications.unshift(newAdminNotification);

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

// --- ADMIN NOTIFICATIONS PATHS ---

// Mark all admin notifications as read
app.put("/api/school-data/notifications/admin/read", verifyAdminToken, async (req, res) => {
  try {
    const info = await readSchoolInfo();
    info.adminNotifications = info.adminNotifications || [];
    info.adminNotifications.forEach((n: any) => {
      n.read = true;
    });
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to save database changes." });
    res.json({ success: true, message: "All notifications marked as read." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Clear all admin notifications
app.delete("/api/school-data/notifications/admin", verifyAdminToken, async (req, res) => {
  try {
    const info = await readSchoolInfo();
    info.adminNotifications = [];
    const ok = await writeSchoolInfo(info);
    if (!ok) return res.status(500).json({ error: "Failed to save database changes." });
    res.json({ success: true, message: "All notifications cleared." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  await ensureDataPath();

  // Secure uploads directory initialization
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fsSync.existsSync(uploadsDir)) {
    fsSync.mkdirSync(uploadsDir, { recursive: true });
  }

  // Pre-initialize and persist default fees array if empty
  try {
    const info = await readSchoolInfo();
    await writeSchoolInfo(info);
  } catch (err) {
    console.error("Failed to pre-populate default fees on startup:", err);
  }

  // Serve Dynamic uploads strictly statically safely
  app.use("/uploads", express.static(uploadsDir, {
    setHeaders: (res, filePath) => {
      // Prevent browser mime-sniffing
      res.setHeader("X-Content-Type-Options", "nosniff");
      // Stop framing or clickjacking attacks
      res.setHeader("X-Frame-Options", "DENY");
      // Highly secure CSP context: disables any interactive javascript, forms, scripts or framing on the file
      res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox;");

      const ext = path.extname(filePath).toLowerCase();
      if (ext === ".pdf") {
        res.setHeader("Content-Type", "application/pdf");
      } else if (ext === ".png") {
        res.setHeader("Content-Type", "image/png");
      } else if (ext === ".jpg" || ext === ".jpeg") {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (ext === ".webp") {
        res.setHeader("Content-Type", "image/webp");
      } else {
        res.setHeader("Content-Type", "application/octet-stream");
      }
    }
  }));

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
