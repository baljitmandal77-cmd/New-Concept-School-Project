import React, { useState, useEffect } from "react";
import { useSchoolData } from "../context/SchoolDataContext";
import { Notice, ClassFee, AdmissionRequest } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  KeyRound,
  Coins,
  Bell,
  Sparkles,
  RefreshCw,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Menu,
  Globe,
  Archive,
  UserPlus,
  MapPin,
  Phone,
  Check,
  Building2,
  Calendar
} from "lucide-react";

export default function AdminPanel() {
  const {
    tickerMessage,
    notices,
    drafts,
    fees,
    admissions = [],
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
    updateAdmissionStatus,
    deleteAdmissionRequest,
    adminToken,
    setAdminTokenState,
    logoutAdmin
  } = useSchoolData();

  // Notices tabs & draft states
  const [noticeSubTab, setNoticeSubTab] = useState<"live" | "draft">("live");
  const [isDraftCheck, setIsDraftCheck] = useState(false);

  // Admissions view filter state
  const [admissionFilter, setAdmissionFilter] = useState<"requested" | "confirmed" | "saved" | "all">("requested");

  // Authentication states
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaChallenge, setCaptchaChallenge] = useState<{ challengeId: string; question: string } | null>(null);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  // Panel navigation states
  const [activeTab, setActiveTab] = useState<"notices" | "fees" | "ticker" | "security" | "admissions">("notices");

  // Operational states for editing
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeForm, setNoticeForm] = useState({ title: "", cat: "Enrollment", desc: "", date: "" });

  const [editableFees, setEditableFees] = useState<ClassFee[]>([]);
  const [hasInitializedFees, setHasInitializedFees] = useState(false);
  const [feeStatus, setFeeStatus] = useState({ success: false, error: "", saving: false });

  const [tickerInput, setTickerInput] = useState("");
  const [tickerStatus, setTickerStatus] = useState({ success: false, error: "", saving: false });

  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState({ success: false, error: "", saving: false });

  // Custom confirmation modal and custom inline alert states to bypass iframe-blocked window.confirm / window.alert
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    message: "",
    onConfirm: () => {}
  });

  const [panelAlert, setPanelAlert] = useState<{
    show: boolean;
    message: string;
    type: "error" | "success";
  }>({
    show: false,
    message: "",
    type: "success"
  });

  const showAlert = (message: string, type: "error" | "success" = "error") => {
    setPanelAlert({ show: true, message, type });
    setTimeout(() => {
      setPanelAlert(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Initializing or fetching Captcha
  const loadCaptcha = async () => {
    try {
      const res = await fetch("/api/captcha");
      if (res.ok) {
        const data = await res.json();
        setCaptchaChallenge(data);
      }
    } catch (err) {
      console.error("Failed to load bot captcha:", err);
    }
  };

  useEffect(() => {
    if (!adminToken) {
      loadCaptcha();
    }
  }, [adminToken]);

  // Initialize local editable state copy once data is loaded (ignoring tab switches to prevent automatic overwriting)
  useEffect(() => {
    if (adminToken) {
      if (!hasInitializedFees && fees && fees.length > 0) {
        const sanitized = fees.map(f => ({
          className: f.className,
          admissionFee: f.admissionFee || 0,
          monthlyFee: f.monthlyFee || 0,
          examFee: f.examFee || 0,
          computerFee: f.computerFee || 0,
          tcFee: f.tcFee || 0,
          marksheetFee: f.marksheetFee || 0,
          miscFee: f.miscFee || 0
        }));
        setEditableFees(sanitized);
        setHasInitializedFees(true);
      }
      if (!tickerInput && tickerMessage) {
        setTickerInput(tickerMessage);
      }
    }
  }, [adminToken, fees, tickerMessage, hasInitializedFees]);

  // Handle Admin Authorization
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthenticating(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
          answer: captchaAnswer,
          challengeId: captchaChallenge?.challengeId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication Failed!");
      }

      setAuthSuccess(true);
      setTimeout(() => {
        setAdminTokenState(data.token);
        setAuthSuccess(false);
        setUsernameInput("");
        setPasswordInput("");
        setCaptchaAnswer("");
      }, 1000);
    } catch (err: any) {
      setAuthError(err.message);
      loadCaptcha(); // Reload captcha challenge on failure
      setCaptchaAnswer("");
    } finally {
      setAuthenticating(false);
    }
  };

  // Keep fees up-to-date with local modifications before saving (allows empty strings during typing)
  const handleFeeFieldChange = (index: number, field: keyof ClassFee, value: string) => {
    const rawVal = value === "" ? "" : Math.max(0, parseInt(value, 10));
    const copy = [...editableFees];
    copy[index] = { ...copy[index], [field]: rawVal as any };
    setEditableFees(copy);
  };

  const handleSaveFees = async () => {
    setFeeStatus({ success: false, error: "", saving: true });
    // Normalize and sanitize fields into integers to prevent storing empty strings as final values
    const sanitized = editableFees.map(f => ({
      className: f.className,
      admissionFee: Number(f.admissionFee) || 0,
      monthlyFee: Number(f.monthlyFee) || 0,
      examFee: Number(f.examFee) || 0,
      computerFee: Number(f.computerFee) || 0,
      tcFee: Number(f.tcFee) || 0,
      marksheetFee: Number(f.marksheetFee) || 0,
      miscFee: Number(f.miscFee) || 0
    }));

    const ok = await updateFees(sanitized);
    if (ok) {
      // Keep local state in sync after saving
      setEditableFees(sanitized);
      setFeeStatus({ success: true, error: "", saving: false });
      setTimeout(() => setFeeStatus(prev => ({ ...prev, success: false })), 3000);
    } else {
      setFeeStatus({ success: false, error: "Failed to update fees list. Session might have expired.", saving: false });
    }
  };

  // Run Ticker alert save
  const handleSaveTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    setTickerStatus({ success: false, error: "", saving: true });
    const ok = await updateTicker(tickerInput);
    if (ok) {
      setTickerStatus({ success: true, error: "", saving: false });
      setTimeout(() => setTickerStatus(prev => ({ ...prev, success: false })), 3000);
    } else {
      setTickerStatus({ success: false, error: "Failed to save news ticker. Security error.", saving: false });
    }
  };

  // Handle Changing administrative password / credentials
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ success: false, error: "", saving: true });

    if (passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ success: false, error: "New passwords do not match!", saving: false });
      return;
    }

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken || ""}`
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newUsername: passwordForm.newUsername,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPasswordStatus({ success: true, error: "", saving: false });
      setPasswordForm({ oldPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err: any) {
      setPasswordStatus({ success: false, error: err.message || "Failed to edit credentials.", saving: false });
    }
  };

  // Handle Notice Board Operations
  const openAddNoticeModal = () => {
    setEditingNotice(null);
    setNoticeForm({ title: "", cat: "Enrollment", desc: "", date: "" });
    setIsDraftCheck(false);
    setIsNoticeModalOpen(true);
  };

  const openEditNoticeModal = (notice: Notice) => {
    setEditingNotice(notice);
    setNoticeForm({
      title: notice.title,
      cat: notice.cat,
      desc: notice.desc,
      date: notice.date
    });
    setIsNoticeModalOpen(true);
  };

  const handleNoticeFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (editingNotice) {
      success = await editNotice(editingNotice.id, noticeForm);
    } else {
      success = await addNotice(noticeForm, isDraftCheck);
    }

    if (success) {
      setIsNoticeModalOpen(false);
      setNoticeForm({ title: "", cat: "Enrollment", desc: "", date: "" });
      setEditingNotice(null);
      setIsDraftCheck(false);
      showAlert("Notice saved successfully!", "success");
    } else {
      showAlert("Failed to save notice. Authentication or validation checks failed.", "error");
    }
  };

  const handleDeleteNoticeClick = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to permanently delete this live notice? This action is irreversible!",
      onConfirm: async () => {
        const success = await deleteNotice(id);
        if (success) {
          showAlert("Live notice deleted successfully!", "success");
        } else {
          showAlert("Failed to delete notice. Operation failed or request unauthorized.", "error");
        }
      }
    });
  };

  const handlePublishDraftClick = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to Publish this notice live on the website?",
      onConfirm: async () => {
        const success = await publishDraft(id);
        if (success) {
          showAlert("Draft notice published live!", "success");
        } else {
          showAlert("Failed to publish draft notice.", "error");
        }
      }
    });
  };

  const handleRevertToDraftClick = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to Revert this live notice to a draft? It will be hidden from the public website.",
      onConfirm: async () => {
        const success = await revertToDraft(id);
        if (success) {
          showAlert("Notice reverted to drafts successfully!", "success");
        } else {
          showAlert("Failed to revert notice to draft.", "error");
        }
      }
    });
  };

  const handleDeleteDraftPermanentlyClick = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: "WARNING: This will permanently delete this notice draft forever from the database! Are you absolutely sure?",
      onConfirm: async () => {
        const success = await deleteDraftPermanently(id);
        if (success) {
          showAlert("Draft notice deleted permanently!", "success");
        } else {
          showAlert("Failed to delete draft permanently.", "error");
        }
      }
    });
  };

  // If Not Authenticated, display High-Security Login Card with Bot Puzzle Captcha
  if (!adminToken) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-light-bg py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[40px] shadow-3xl overflow-hidden border border-black/5"
        >
          <div className="bg-primary text-white p-8 md:p-10 text-center relative">
            <div className="absolute top-4 right-4 text-accent/20">
              <Lock size={60} />
            </div>
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 shadow-lg">
              <KeyRound size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tight">Administrative Vault</h2>
            <p className="text-white/50 text-[10px] uppercase font-black tracking-widest mt-2">New Concept English School</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-8 md:p-10 space-y-8">
            {authError && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed font-bold">
                <AlertCircle className="shrink-0" size={16} />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed font-bold">
                <CheckCircle className="shrink-0" size={16} />
                <span>Vault Unlocked! Launching console...</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">Console Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-light-bg border focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                  placeholder="e.g. admin"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">Console Key password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-light-bg border focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {captchaChallenge && (
              <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-50 space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <p className="text-xs font-bold text-primary/80 leading-relaxed italic">{captchaChallenge.question}</p>
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    className="p-1.5 hover:bg-emerald-100/50 rounded-lg text-emerald-600 transition-colors shrink-0"
                    title="Refresh CAPTCHA puzzle"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
                <input
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-3 text-xs font-black shadow-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Your calculated result"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={authenticating || authSuccess}
              className="w-full bg-primary text-white py-4.5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black hover:shadow-accent/5 disabled:opacity-40 transition-all flex items-center justify-center gap-3"
            >
              {authenticating ? <RefreshCw className="animate-spin" size={16} /> : <Unlock size={16} />}
              Unlock Console
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard Main Frame
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-white rounded-[40px] md:rounded-[60px] shadow-3xl border border-black/5 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-primary text-white px-8 py-10 md:px-16 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-accent text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3 shadow-md">
              Security Grade Level: High
            </span>
            <h1 className="text-2xl md:text-4xl font-black italic text-white leading-tight">Admin Control Panel</h1>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.2em] mt-2">
              School Resource dispatch & Tuition Ledger
            </p>
          </div>
          <button
            onClick={logoutAdmin}
            className="bg-white/10 hover:bg-red-600 hover:text-white text-accent px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 self-stretch md:self-auto justify-center shadow"
          >
            <LogOut size={14} /> Close Session
          </button>
        </div>

        {/* Console Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-light-bg/50 border-r border-black/5 p-6 md:p-8 space-y-2">
            {[
              { id: "notices", label: "Notices Dispatcher", icon: <Bell size={16} /> },
              { id: "fees", label: "Classes Fee Ledger", icon: <Coins size={16} /> },
              { id: "ticker", label: "Banner News Ticker", icon: <Sparkles size={16} /> },
              { id: "admissions", label: "Admission Panel", icon: <UserPlus size={16} />, badge: (admissions || []).filter((a: any) => a.status === 'requested').length },
              { id: "security", label: "Vault Password", icon: <KeyRound size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-5 py-4.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all text-left ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg shadow-primary/10 -translate-y-0.5"
                    : "text-primary/70 hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black leading-none ${activeTab === tab.id ? "bg-accent text-primary" : "bg-red-500 text-white animate-pulse"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Core Content Box */}
          <div className="lg:col-span-9 p-8 md:p-14">
            <AnimatePresence mode="wait">
              {/* NOTICES PANEL */}
              {activeTab === "notices" && (
                <motion.div
                  key="notices"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-primary italic">Notices dispatcher</h2>
                      <p className="text-sm text-primary/40 font-semibold mt-1">
                        Add, modify or delete announcements displayed on the Notices Portal
                      </p>
                    </div>
                    <button
                      onClick={openAddNoticeModal}
                      className="bg-accent text-primary px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 self-stretch sm:self-auto justify-center"
                    >
                      <Plus size={16} /> Craft Announcement
                    </button>
                  </div>

                  {/* Notices Sub-Tabs */}
                  <div className="flex border-b border-black/5 pb-2 ml-1 space-x-6">
                    <button
                      type="button"
                      onClick={() => setNoticeSubTab("live")}
                      className={`pb-3 text-xs uppercase font-black tracking-wider transition-colors border-b-2 relative ${
                        noticeSubTab === "live"
                          ? "text-primary border-accent"
                          : "text-primary/40 border-transparent hover:text-primary/70"
                      }`}
                    >
                      Live Broadcasts ({notices.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoticeSubTab("draft")}
                      className={`pb-3 text-xs uppercase font-black tracking-wider transition-colors border-b-2 relative ${
                        noticeSubTab === "draft"
                          ? "text-primary border-accent"
                          : "text-primary/40 border-transparent hover:text-primary/70"
                      }`}
                    >
                      Drafts & Trash bin ({(drafts || []).length})
                    </button>
                  </div>

                  <div className="space-y-4">
                    {noticeSubTab === "live" ? (
                      notices.length === 0 ? (
                        <div className="text-center py-16 bg-light-bg rounded-3xl border border-dashed">
                          <p className="text-primary/40 font-bold text-sm">No live notices exist. Click button above to add!</p>
                        </div>
                      ) : (
                        notices.map((n) => (
                          <div
                            key={n.id}
                            className="p-6 md:p-8 bg-light-bg rounded-[32px] border border-black/5 hover:border-primary/20 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                          >
                            <div className="space-y-2 max-w-xl">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-wider">
                                  {n.cat}
                                </span>
                                <span className="text-xs font-bold text-primary/40">{n.date}</span>
                              </div>
                              <h4 className="text-lg font-black text-primary tracking-tight">{n.title}</h4>
                              <p className="text-xs text-primary/60 font-semibold line-clamp-2 leading-relaxed">{n.desc}</p>
                            </div>
                            <div className="flex gap-2 self-stretch md:self-auto">
                              <button
                                type="button"
                                onClick={() => openEditNoticeModal(n)}
                                className="flex-1 md:flex-none p-3.5 bg-white border rounded-xl hover:bg-accent hover:border-accent text-primary transition-colors flex justify-center items-center"
                                title="Edit live notice"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRevertToDraftClick(n.id)}
                                className="flex-1 md:flex-none p-3.5 bg-white border rounded-xl hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100 text-primary transition-colors flex justify-center items-center"
                                title="Revert to Draft"
                              >
                                <Archive size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteNoticeClick(n.id)}
                                className="flex-1 md:flex-none p-3.5 bg-white border rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-primary transition-colors flex justify-center items-center"
                                title="Delete permanently"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      (!drafts || drafts.length === 0) ? (
                        <div className="text-center py-16 bg-light-bg rounded-3xl border border-dashed">
                          <p className="text-primary/40 font-bold text-sm">Your drafts and trash archive is empty.</p>
                          <p className="text-xs text-primary/30 font-medium mt-1">Reverted or draft notices can be published live anytime!</p>
                        </div>
                      ) : (
                        drafts.map((d) => (
                          <div
                            key={d.id}
                            className="p-6 md:p-8 bg-amber-50/20 rounded-[32px] border border-amber-100 hover:border-amber-200 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                          >
                            <div className="space-y-2 max-w-xl">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] bg-amber-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-wider">
                                  {d.cat} (Draft)
                                </span>
                                <span className="text-xs font-bold text-primary/40">{d.date || "No date defined"}</span>
                              </div>
                              <h4 className="text-lg font-black text-amber-900 tracking-tight">{d.title}</h4>
                              <p className="text-xs text-amber-800/60 font-semibold line-clamp-2 leading-relaxed">{d.desc}</p>
                            </div>
                            <div className="flex gap-2 self-stretch md:self-auto">
                              <button
                                type="button"
                                onClick={() => handlePublishDraftClick(d.id)}
                                className="flex-1 md:flex-none px-4 py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 text-xs font-black uppercase tracking-widest"
                                title="Publish Draft Notice Live"
                              >
                                <Globe size={14} /> Publish Live
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditNoticeModal(d)}
                                className="p-3.5 bg-white border rounded-xl hover:bg-accent hover:border-accent text-primary transition-colors flex justify-center items-center"
                                title="Edit Draft"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDraftPermanentlyClick(d.id)}
                                className="p-3.5 bg-white border rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-primary transition-colors flex justify-center items-center"
                                title="Delete permanently"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {/* TUITION FEES PANEL */}
              {activeTab === "fees" && (
                <motion.div
                  key="fees"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-primary italic">Tuition & Admission register</h2>
                    <p className="text-sm text-primary/40 font-semibold mt-1">
                      Revise specific fee charts for all classes (Nursery to Grade 7) displayed on the Admissions screen.
                    </p>
                  </div>

                  {feeStatus.success && (
                    <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <CheckCircle size={16} />
                      Class schedules updated in file registry successfully!
                    </div>
                  )}

                  {feeStatus.error && (
                    <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <AlertCircle size={16} />
                      {feeStatus.error}
                    </div>
                  )}

                  {/* Unified Compact Responsive Ledger Table */}
                  <div className="overflow-x-auto rounded-[32px] border border-black/5 bg-white shadow-inner">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-primary text-white text-[10px] font-black uppercase tracking-wider border-none">
                          <th className="p-3 text-center">Class</th>
                          <th className="p-3 text-right">Admission</th>
                          <th className="p-3 text-right">Monthly</th>
                          <th className="p-3 text-right">Exam Fee</th>
                          <th className="p-3 text-right">Computer</th>
                          <th className="p-3 text-right">TC Fee</th>
                          <th className="p-3 text-right">Marksheet</th>
                          <th className="p-3 text-right">Misc Fee</th>
                          <th className="p-3 text-right bg-accent text-primary">Summary (NPR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-xs font-bold text-primary/80">
                        {editableFees.map((fee, idx) => {
                          const classSum =
                            (Number(fee.admissionFee) || 0) +
                            (Number(fee.monthlyFee) || 0) +
                            (Number(fee.examFee) || 0) +
                            (Number(fee.computerFee) || 0) +
                            (Number(fee.tcFee) || 0) +
                            (Number(fee.marksheetFee) || 0) +
                            (Number(fee.miscFee) || 0);

                          return (
                            <tr key={idx} className="hover:bg-light-bg/50 transition-colors">
                              <td className="p-3 font-black tracking-tight bg-light-bg/30 text-primary uppercase text-[11px] italic text-center whitespace-nowrap min-w-[70px]">
                                {fee.className}
                              </td>
                              <td className="p-1 px-1.5 min-w-[85px]">
                                <input
                                  type="number"
                                  value={fee.admissionFee === "" || fee.admissionFee === undefined ? "" : fee.admissionFee}
                                  onChange={(e) => handleFeeFieldChange(idx, "admissionFee", e.target.value)}
                                  className="w-full bg-light-bg/50 rounded-lg px-2 py-1.5 focus:outline-none focus:bg-white border focus:border-accent text-right font-black"
                                />
                              </td>
                              <td className="p-1 px-1.5 min-w-[85px]">
                                <input
                                  type="number"
                                  value={fee.monthlyFee === "" || fee.monthlyFee === undefined ? "" : fee.monthlyFee}
                                  onChange={(e) => handleFeeFieldChange(idx, "monthlyFee", e.target.value)}
                                  className="w-full bg-light-bg/50 rounded-lg px-2 py-1.5 focus:outline-none focus:bg-white border focus:border-accent text-right font-black"
                                />
                              </td>
                              <td className="p-1 px-1.5 min-w-[85px]">
                                <input
                                  type="number"
                                  value={fee.examFee === "" || fee.examFee === undefined ? "" : fee.examFee}
                                  onChange={(e) => handleFeeFieldChange(idx, "examFee", e.target.value)}
                                  className="w-full bg-light-bg/50 rounded-lg px-2 py-1.5 focus:outline-none focus:bg-white border focus:border-accent text-right font-black"
                                />
                              </td>
                              <td className="p-1 px-1.5 min-w-[85px]">
                                <input
                                  type="number"
                                  value={fee.computerFee === "" || fee.computerFee === undefined ? "" : fee.computerFee}
                                  onChange={(e) => handleFeeFieldChange(idx, "computerFee", e.target.value)}
                                  className="w-full bg-light-bg/50 rounded-lg px-2 py-1.5 focus:outline-none focus:bg-white border focus:border-accent text-right font-black"
                                />
                              </td>
                              <td className="p-1 px-1.5 min-w-[85px]">
                                <input
                                  type="number"
                                  value={fee.tcFee === "" || fee.tcFee === undefined ? "" : fee.tcFee}
                                  onChange={(e) => handleFeeFieldChange(idx, "tcFee", e.target.value)}
                                  className="w-full bg-light-bg/50 rounded-lg px-2 py-1.5 focus:outline-none focus:bg-white border focus:border-accent text-right font-black"
                                />
                              </td>
                              <td className="p-1 px-1.5 min-w-[85px]">
                                <input
                                  type="number"
                                  value={fee.marksheetFee === "" || fee.marksheetFee === undefined ? "" : fee.marksheetFee}
                                  onChange={(e) => handleFeeFieldChange(idx, "marksheetFee", e.target.value)}
                                  className="w-full bg-light-bg/50 rounded-lg px-2 py-1.5 focus:outline-none focus:bg-white border focus:border-accent text-right font-black"
                                />
                              </td>
                              <td className="p-1 px-1.5 min-w-[85px]">
                                <input
                                  type="number"
                                  value={fee.miscFee === "" || fee.miscFee === undefined ? "" : fee.miscFee}
                                  onChange={(e) => handleFeeFieldChange(idx, "miscFee", e.target.value)}
                                  className="w-full bg-light-bg/50 rounded-lg px-2 py-1.5 focus:outline-none focus:bg-white border focus:border-accent text-right font-black"
                                />
                              </td>
                              <td className="p-3 text-right font-black text-primary bg-accent/15 tabular-nums min-w-[90px]">
                                NPR {classSum.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveFees}
                      disabled={feeStatus.saving}
                      className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black disabled:opacity-45 transition-all flex items-center gap-3"
                    >
                      {feeStatus.saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                      Publish Ledger Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TICKER MESSAGE PANEL */}
              {activeTab === "ticker" && (
                <motion.div
                  key="ticker"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-primary italic">Homepage alert ticker</h2>
                    <p className="text-sm text-primary/40 font-semibold mt-1">
                      Update the high-impact red running ticker message scrolling on top of the Home page.
                    </p>
                  </div>

                  {tickerStatus.success && (
                    <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <CheckCircle size={16} />
                      Marquee flyer update loaded into memory successfully!
                    </div>
                  )}

                  <form onSubmit={handleSaveTicker} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                        Ticker message string
                      </label>
                      <textarea
                        value={tickerInput}
                        onChange={(e) => setTickerInput(e.target.value)}
                        rows={4}
                        className="w-full bg-light-bg border focus:border-accent ring-0 rounded-[24px] p-6 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="e.g., Admission Open Now for Academic Intake 2083!"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={tickerStatus.saving}
                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black disabled:opacity-45 transition-all flex items-center gap-3"
                      >
                        {tickerStatus.saving ? (
                          <RefreshCw className="animate-spin" size={14} />
                        ) : (
                          <Save size={14} />
                        )}
                        Sync Ticker Announcement
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* SECURITY / PASSWORD TAB */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-primary italic">Control credentials configuration</h2>
                    <p className="text-sm text-primary/40 font-semibold mt-1">
                      Overwrite the username and password required to unlock this administration vault.
                    </p>
                  </div>

                  {passwordStatus.success && (
                    <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <CheckCircle size={16} />
                      Security credentials updated successfully! Use new credentials on next log in.
                    </div>
                  )}

                  {passwordStatus.error && (
                    <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <AlertCircle size={16} />
                      {passwordStatus.error}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                        Current administrator password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className="w-full bg-light-bg border focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="••••••"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                        New secure username (Optional, min 3 characters)
                      </label>
                      <input
                        type="text"
                        value={passwordForm.newUsername}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newUsername: e.target.value })}
                        className="w-full bg-light-bg border focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="e.g. admin"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                        New secure password (Optional, min 6 characters)
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full bg-light-bg border focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="At least 6 characters"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                        Confirm new secure password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full bg-light-bg border focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="At least 6 characters"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={passwordStatus.saving}
                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black disabled:opacity-45 transition-all flex items-center gap-3"
                      >
                        {passwordStatus.saving ? (
                          <RefreshCw className="animate-spin" size={14} />
                        ) : (
                          <Save size={14} />
                        )}
                        Change Master Credentials
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ADMISSIONS PANEL */}
              {activeTab === "admissions" && (
                <motion.div
                  key="admissions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-primary italic">Admission inquiries</h2>
                      <p className="text-sm text-primary/40 font-semibold mt-1">
                        Track, verify, save, and manage lead intakes submitted from the public enrollment portal in real-time.
                      </p>
                    </div>
                  </div>

                  {/* Filter & Stats bar */}
                  <div className="flex flex-wrap items-center justify-between gap-6 border-b pb-6">
                    <div className="flex flex-wrap items-center gap-3">
                      {[
                        { id: "requested", label: "Requested / Pending" },
                        { id: "confirmed", label: "Confirmed" },
                        { id: "saved", label: "Saved / Archived" },
                        { id: "all", label: "All Lists" }
                      ].map((f) => {
                        const count = f.id === "all" 
                          ? (admissions || []).length 
                          : (admissions || []).filter((a: any) => a.status === f.id).length;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setAdmissionFilter(f.id as any)}
                            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                              admissionFilter === f.id
                                ? f.id === "requested" && count > 0
                                  ? "bg-red-500 text-white shadow-md shadow-red-200"
                                  : f.id === "confirmed"
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                                  : "bg-primary text-white shadow-md shadow-primary/10"
                                : "bg-light-bg hover:bg-primary/5 text-primary/60 border border-black/5"
                            }`}
                          >
                            <span>{f.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              admissionFilter === f.id 
                                ? "bg-white text-primary" 
                                : "bg-black/10 text-primary/60"
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inquiry lists */}
                  {(() => {
                    const filtered = (admissions || []).filter((a: any) => {
                      if (admissionFilter === "all") return true;
                      return a.status === admissionFilter;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[30px] bg-light-bg/30">
                          <UserPlus size={48} className="mx-auto text-primary/20 mb-4" />
                          <h3 className="font-black text-primary text-xl tracking-tight mb-2">No inquiries found</h3>
                          <p className="text-sm text-primary/40 font-semibold max-w-xs mx-auto">
                            Whenever a prospective student submits the enrollment inquiry form, it will appear here in real-time.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filtered.map((req: any) => {
                          const dateFmt = new Date(req.createdAt).toLocaleDateString("en-NP", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          });

                          return (
                            <motion.div
                              layout
                              key={req.id}
                              className={`bg-white border rounded-[30px] p-8 shadow-sm transition-all hover:shadow-md relative overflow-hidden flex flex-col justify-between ${
                                req.status === "requested"
                                  ? "border-red-200 shadow-red-50/10"
                                  : req.status === "confirmed"
                                  ? "border-emerald-200 shadow-emerald-50/10"
                                  : "border-gray-200"
                              }`}
                            >
                              {/* Background glow or corner ribbon */}
                              <div className={`absolute top-0 right-0 w-24 h-24 opacity-[0.03] rounded-bl-full ${
                                req.status === "requested" ? "bg-red-500" : req.status === "confirmed" ? "bg-emerald-500" : "bg-primary"
                              }`} />

                              <div>
                                <div className="flex justify-between items-start gap-4 mb-6">
                                  <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 ${
                                      req.status === "requested"
                                        ? "bg-red-100 text-red-600 animate-pulse"
                                        : req.status === "confirmed"
                                        ? "bg-emerald-100 text-emerald-600"
                                        : "bg-gray-100 text-gray-600"
                                    }`}>
                                      {req.status === "requested" ? "Requested / New" : req.status === "confirmed" ? "Admission Confirmed" : "Saved Record"}
                                    </span>
                                    <h4 className="font-extrabold text-primary text-xl tracking-tight capitalize">{req.studentName}</h4>
                                  </div>
                                  <div className="bg-primary text-white font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-widest shadow-sm shrink-0">
                                    {req.targetClass}
                                  </div>
                                </div>

                                <div className="space-y-4 text-sm font-semibold text-primary/60 border-t border-black/5 pt-5 mb-8">
                                  <div className="flex items-center gap-4">
                                    <Phone size={14} className="text-secondary shrink-0" />
                                    <a href={`tel:${req.guardianContact}`} className="hover:text-accent font-bold transition-colors text-primary font-bold">
                                      {req.guardianContact}
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <MapPin size={14} className="text-secondary shrink-0" />
                                    <span className="font-medium text-[13px]">{req.address}</span>
                                  </div>
                                  {req.previousSchool && (
                                    <div className="flex items-center gap-4">
                                      <Building2 size={14} className="text-secondary shrink-0" />
                                      <span className="font-medium text-[13px] italic">Prev: {req.previousSchool}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-4 text-primary/30 text-xs">
                                    <Calendar size={13} className="shrink-0" />
                                    <span>{dateFmt}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions footer */}
                              <div className="flex flex-wrap items-center gap-2 border-t border-black/5 pt-5 justify-between">
                                <div className="flex items-center gap-2">
                                  {req.status === "requested" && (
                                    <>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "confirmed")}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
                                      >
                                        <Check size={12} /> Confirm
                                      </button>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "saved")}
                                        className="bg-primary/5 hover:bg-primary/10 text-primary font-black rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                                      >
                                        <Archive size={12} /> Save
                                      </button>
                                    </>
                                  )}

                                  {req.status === "confirmed" && (
                                    <>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "saved")}
                                        className="bg-primary hover:bg-black text-white rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                                      >
                                        <Archive size={12} /> File / Save
                                      </button>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "requested")}
                                        className="bg-primary/5 hover:bg-primary/10 text-primary font-black rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all"
                                      >
                                        Make Pending
                                      </button>
                                    </>
                                  )}

                                  {req.status === "saved" && (
                                    <>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "confirmed")}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
                                      >
                                        <Check size={12} /> Confirm
                                      </button>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "requested")}
                                        className="bg-primary/5 hover:bg-primary/10 text-primary font-black rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all"
                                      >
                                        Make Pending
                                      </button>
                                    </>
                                  )}
                                </div>

                                <button
                                  onClick={() => {
                                    setConfirmModal({
                                      isOpen: true,
                                      message: `Do you want to permanently delete admission request of ${req.studentName}?`,
                                      onConfirm: async () => {
                                        const success = await deleteAdmissionRequest(req.id);
                                        if (success) {
                                          showAlert("Admission request deleted successfully!", "success");
                                        } else {
                                          showAlert("Failed to delete admission request.", "error");
                                        }
                                      }
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2.5 rounded-xl transition-all"
                                  title="Delete Inquiry Permanently"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MODAL WINDOW FOR ADDING/EDITING NOTICES */}
      <AnimatePresence>
        {isNoticeModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNoticeModalOpen(false)}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-[110] rounded-[32px] md:rounded-[40px] shadow-3xl border border-black/5"
            >
              <form onSubmit={handleNoticeFormSubmit} className="p-6 md:p-10 space-y-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-primary italic tracking-tight">
                      {editingNotice ? "Edit notice details" : "Publish new announcement"}
                    </h3>
                    <p className="text-[10px] uppercase font-black text-primary/40 tracking-widest mt-1">
                      Configure Notice descriptors
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNoticeModalOpen(false)}
                    className="p-2.5 bg-light-bg rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                      Notice Header / Title
                    </label>
                    <input
                      type="text"
                      value={noticeForm.title}
                      onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                      className="w-full bg-light-bg border focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold shadow-inner"
                      placeholder="e.g. Class Rescheduling"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                      Category Class
                    </label>
                    <select
                      value={noticeForm.cat}
                      onChange={(e) => setNoticeForm({ ...noticeForm, cat: e.target.value })}
                      className="w-full bg-light-bg border focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-black shadow-inner appearance-none"
                    >
                      {["Enrollment", "Test", "Urgent", "Holiday", "Events"].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                      Custom Publish Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={noticeForm.date}
                      onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                      className="w-full bg-light-bg border focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold shadow-inner"
                      placeholder="Default Current (e.g., Ashar, 2083)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                    Full Notice Body Details
                  </label>
                  <textarea
                    value={noticeForm.desc}
                    onChange={(e) => setNoticeForm({ ...noticeForm, desc: e.target.value })}
                    rows={4}
                    className="w-full bg-light-bg border focus:border-accent ring-0 rounded-[20px] p-5 focus:outline-none text-xs font-bold shadow-inner"
                    placeholder="Enter full notice descriptions and parent/staff guidance details here..."
                    required
                  />
                </div>

                {!editingNotice && (
                  <div className="flex items-center gap-3 pl-2 py-0.5">
                    <input
                      id="isDraftCheck"
                      type="checkbox"
                      checked={isDraftCheck}
                      onChange={(e) => setIsDraftCheck(e.target.checked)}
                      className="w-5 h-5 accent-accent rounded cursor-pointer"
                    />
                    <label htmlFor="isDraftCheck" className="text-xs font-black uppercase tracking-widest text-primary/75 cursor-pointer selection:bg-transparent">
                      Save as Draft (Do not publish live immediately)
                    </label>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsNoticeModalOpen(false)}
                    className="bg-light-bg text-primary px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black"
                  >
                    {editingNotice ? "Enforce Edit changes" : isDraftCheck ? "Save as Draft" : "Launch Announcement"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CUSTOM SECURE INLINE CONFIRMATION MODAL (Bypasses iframe security blocks on window.confirm) */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white z-[210] rounded-[40px] p-8 md:p-10 shadow-3xl border border-black/5"
            >
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-primary italic tracking-tight">Confirm Action</h3>
                  <p className="text-sm text-primary/70 font-semibold leading-relaxed">
                    {confirmModal.message}
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    className="flex-1 bg-light-bg text-primary px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const callback = confirmModal.onConfirm;
                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                      if (callback) {
                        try {
                          await callback();
                        } catch (err) {
                          console.error("Error executing confirm action:", err);
                        }
                      }
                    }}
                    className="flex-1 bg-primary text-white px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all"
                  >
                    Yes, Proceed
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CUSTOM SECURE INLINE TOAST ALERT (Bypasses iframe security blocks on window.alert) */}
      <AnimatePresence>
        {panelAlert.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[250] max-w-sm rounded-[24px] p-5 border shadow-2xl flex items-start gap-3 bg-white border-black/5"
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              panelAlert.type === "success" 
                ? "bg-emerald-50 text-emerald-600" 
                : "bg-red-50 text-red-600"
            }`}>
              {panelAlert.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-primary">
                {panelAlert.type === "success" ? "Success" : "Alert Notification"}
              </h4>
              <p className="text-xs text-primary/70 font-semibold leading-relaxed">
                {panelAlert.message}
              </p>
            </div>
            <button
              onClick={() => setPanelAlert(prev => ({ ...prev, show: false }))}
              className="text-primary/30 hover:text-primary transition-colors shrink-0 p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
