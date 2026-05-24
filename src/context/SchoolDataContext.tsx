import React, { createContext, useContext, useState, useEffect } from "react";
import { Notice, ClassFee, AdmissionRequest, SchoolDataPayload, SchoolDataContextType } from "../types";

export const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export function useSchoolData() {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error("useSchoolData must be used within a SchoolDataProvider");
  }
  return context;
}

export function SchoolDataProvider({ children }: { children: React.ReactNode }) {
  const [tickerMessage, setTickerMessage] = useState<string>("Admission Started for 2083 Session.");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [drafts, setDrafts] = useState<Notice[]>([]);
  const [fees, setFees] = useState<ClassFee[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem("nc_admin_token");
  });

  const setAdminTokenState = (token: string | null) => {
    setAdminToken(token);
    if (token) {
      localStorage.setItem("nc_admin_token", token);
    } else {
      localStorage.removeItem("nc_admin_token");
    }
  };

  // Fetch all database records
  const refreshData = async () => {
    try {
      setLoading(true);
      // Add a timestamp cache-buster query parameter to force fetching fresh data bypassing browser caching
      const res = await fetch(`/api/school-data?t=${Date.now()}`);
      if (!res.ok) throw new Error("Connection failed");
      const data: Omit<SchoolDataPayload, "adminPassword"> = await res.json();
      setTickerMessage(data.tickerMessage || "");
      setNotices(data.notices || []);
      setDrafts(data.drafts || []);
      setFees(data.fees || []);
      setAdmissions(data.admissions || []);
    } catch (error) {
      console.error("Error loading school data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verify connection and session token on startup according to the "Validate Connection to Firestore" check
  // (We use it to assert Express client is online and the session token is still valid)
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("nc_admin_token");
      if (storedToken) {
        try {
          const res = await fetch("/api/admin/verify", {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          if (!res.ok) {
            setAdminTokenState(null);
          }
        } catch (err) {
          console.error("Failed to verify admin status on load:", err);
        }
      }
      await refreshData();
    };
    init();
  }, []);

  // Real-time silent polling when admin session is active
  useEffect(() => {
    if (!adminToken) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/school-data?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setTickerMessage(data.tickerMessage || "");
          setNotices(data.notices || []);
          setDrafts(data.drafts || []);
          setFees(data.fees || []);
          setAdmissions(data.admissions || []);
        }
      } catch (err) {
        console.error("Silent poll failed:", err);
      }
    }, 6000); // Poll every 6 seconds for extreme fast, lightweight UI reactivity

    return () => clearInterval(interval);
  }, [adminToken]);

  // Update Ticker Message
  const updateTicker = async (message: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/school-data/ticker", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken || ""}`
        },
        body: JSON.stringify({ tickerMessage: message })
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        setTickerMessage(message);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Update Fees schedule
  const updateFees = async (updatedFees: ClassFee[]): Promise<boolean> => {
    try {
      const res = await fetch("/api/school-data/fees", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken || ""}`
        },
        body: JSON.stringify({ fees: updatedFees })
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        setFees(updatedFees);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Add Notice
  const addNotice = async (notice: Omit<Notice, "id">, isDraft?: boolean): Promise<boolean> => {
    try {
      const res = await fetch("/api/school-data/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken || ""}`
        },
        body: JSON.stringify({ ...notice, isDraft })
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Edit Notice
  const editNotice = async (id: string, notice: Omit<Notice, "id">): Promise<boolean> => {
    try {
      const res = await fetch(`/api/school-data/notices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken || ""}`
        },
        body: JSON.stringify(notice)
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Delete Notice (moves Live notice to drafts folder)
  const deleteNotice = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/school-data/notices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken || ""}`
        }
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Publish Draft
  const publishDraft = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/school-data/drafts/${id}/publish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken || ""}`
        }
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Revert Live Notice to Draft
  const revertToDraft = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/school-data/notices/${id}/revert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken || ""}`
        }
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Delete Draft Permanently
  const deleteDraftPermanently = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/school-data/drafts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken || ""}`
        }
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Submit public admission inquiry
  const submitAdmissionRequest = async (req: Omit<AdmissionRequest, "id" | "status" | "createdAt">): Promise<boolean> => {
    try {
      const res = await fetch("/api/school-data/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to submit admission request:", err);
      return false;
    }
  };

  // Update admission status (Verify token)
  const updateAdmissionStatus = async (id: string, status: "requested" | "confirmed" | "saved"): Promise<boolean> => {
    try {
      const res = await fetch(`/api/school-data/admissions/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken || ""}`
        },
        body: JSON.stringify({ status })
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update admission status:", err);
      return false;
    }
  };

  // Delete admission request permanently (Verify token)
  const deleteAdmissionRequest = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/school-data/admissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken || ""}`
        }
      });
      if (res.status === 401) {
        setAdminTokenState(null);
        alert("Session expired or server restarted. Please log in again.");
        return false;
      }
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to delete admission request:", err);
      return false;
    }
  };

  // Logout Admin
  const logoutAdmin = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken || ""}`
        }
      });
    } catch (error) {
      console.error("Logout fetch failed", error);
    } finally {
      setAdminTokenState(null);
    }
  };

  return (
    <SchoolDataContext.Provider
      value={{
        tickerMessage,
        notices,
        drafts,
        fees,
        admissions,
        loading,
        refreshData,
        updateTicker,
        updateFees,
        addNotice,
        editNotice,
        deleteNotice,
        publishDraft,
        revertToDraft,
        deleteDraftPermanently,
        submitAdmissionRequest,
        updateAdmissionStatus,
        deleteAdmissionRequest,
        adminToken,
        setAdminTokenState,
        logoutAdmin
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
}
