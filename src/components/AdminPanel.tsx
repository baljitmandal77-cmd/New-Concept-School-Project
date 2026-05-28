import React, { useState, useEffect } from "react";
import { useSchoolData } from "../context/SchoolDataContext";
import { Notice, ClassFee, AdmissionRequest, FacultyMember, WebsiteContent, OutreachMember, GalleryPhoto, CourseProgram } from "../types";
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
  EyeOff,
  Menu,
  Globe,
  Archive,
  UserPlus,
  MapPin,
  Phone,
  Check,
  Building2,
  Calendar,
  Camera,
  Image as ImageIcon,
  User,
  Award,
  BookOpen,
  FileText,
  Clock,
  PlusCircle
} from "lucide-react";

export const defaultFeaturesList = [
  {
    id: "feat-1",
    img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop",
    localName: "unique_feature.jpg",
    title: "Holistic Environment",
    desc: "Our School is designed to inspire creativity, with open spaces and modern courses."
  },
  {
    id: "feat-2",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    localName: "tech_learning.jpg",
    title: "Tech-Infused Learning",
    desc: "Students use computer and smart boards to grasp complex concepts through visualization."
  },
  {
    id: "feat-3",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2040&auto=format&fit=crop",
    localName: "moral_integrity.jpg",
    title: "Moral Integrity",
    desc: "We instill core human values and ethics to ensure our students grow into responsible citizens."
  },
  {
    id: "feat-4",
    img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2040&auto=format&fit=crop",
    localName: "cctv_secured.jpg",
    title: "CCTV Secured Campus",
    desc: "24/7 high-definition smart camera surveillance and active security protocols across every corner."
  },
  {
    id: "feat-5",
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
    localName: "safe_transport.jpg",
    title: "GPS-Tracked Transport",
    desc: "Comfortable and secure school transport covering primary routes with real-time tracking support."
  },
  {
    id: "feat-6",
    img: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=2070&auto=format&fit=crop",
    localName: "sports_wellness.jpg",
    title: "Elite Sports & Wellness",
    desc: "Ample playground with training facilities to develop sportsmanship, fitness, and team synergy."
  }
];

export const defaultTimelineEventsList = [
  {
    id: "time-1",
    time: "09:30 AM",
    event: "Morning Assembly",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    localName: "assembly.jpg"
  },
  {
    id: "time-2",
    time: "11:00 AM",
    event: "Smart Class Labs",
    img: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0ed?q=80&w=2070&auto=format&fit=crop",
    localName: "science_lab.jpg"
  },
  {
    id: "time-3",
    time: "01:00 PM",
    event: "Healthy Lunch Break",
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=2048&auto=format&fit=crop",
    localName: "healthy_lunch.jpg"
  },
  {
    id: "time-4",
    time: "02:30 PM",
    event: "Co-Curricular Clubs",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
    localName: "curricular_clubs.jpg"
  }
];

export const formatCategoryLabel = (key: string) => {
  if (key === "monthlyFee") return "Monthly Fee";
  if (key === "computerFee") return "Computer Lab";
  if (key === "transportationFee") return "Transportation Fee";
  if (key === "admissionFee") return "Admission Fee";
  if (key === "examFee") return "Exam Fee";
  if (key === "miscFee") return "Other Fees";
  
  const label = key
    .replace(/([a-zA-Z])([0-9]+)/g, "$1 $2")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim();
    
  if (!label) return key;
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export default function AdminPanel() {
  const {
    tickerMessage,
    notices,
    drafts,
    fees,
    monthlyFeeCategories = [],
    yearlyFeeCategories = [],
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
    logoutAdmin,
    websiteContent,
    adminNotifications = [],
    publicNotifications = [],
    markAdminNotificationsRead,
    clearAdminNotifications,
    updateWebsiteContent: originalUpdateWebsiteContent
  } = useSchoolData();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const updateWebsiteContent = async (payload: WebsiteContent) => {
    const enrichedPayload: WebsiteContent = {
      ...payload,
      timelineEvents: cmsTimelineEvents
    };
    return originalUpdateWebsiteContent(enrichedPayload);
  };

  const isCmsInitializedRef = React.useRef(false);

  // Helper to get local or saved base64 image sources for pillars/features
  const getImgSrc = (feat: any) => {
    if (!feat) return "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071";
    if (feat.img && (feat.img.startsWith("data:") || feat.img.startsWith("http://") || feat.img.startsWith("https://"))) {
      return feat.img;
    }
    if (feat.localName) {
      return `/images/${feat.localName}`;
    }
    return feat.img || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071";
  };

  // Helper to get local or saved base64 image sources for timeline events
  const getTimelineImgSrc = (evt: any) => {
    if (!evt) return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022";
    if (evt.img && (evt.img.startsWith("data:") || evt.img.startsWith("http://") || evt.img.startsWith("https://"))) {
      return evt.img;
    }
    if (evt.localName) {
      return `/images/${evt.localName}`;
    }
    return evt.img || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022";
  };

  // CMS state
  const [cmsForm, setCmsForm] = useState({
    schoolName: "",
    schoolLogo: "",
    principalName: "",
    principalRole: "",
    principalQuote: "",
    principalBio: "",
    principalStat: "",
    principalPhoto: "",
    campusPhoto1: "",
    campusPhoto2: "",
    campusPhoto3: "",
    heroTagline: "",
    heroSubheader: "",
    heroDesc: "",
    heroPhoto: "",
    spotlightPhoto: "",
    spotlightTag: "",
    spotlightTitle: "",
    admissionsBgPhoto: "",
    schoolPhone: "9801671714 / 9817681582",
    schoolEmail: "admissions@NCEMBS.edu.np",
    schoolAddress: "Baheda, Ekdara-6, Mahottari, Madhesh Nepal",
    schoolGoogleMaps: "",
  });

  const [cmsFaculty, setCmsFaculty] = useState<FacultyMember[]>([]);
  const [cmsOutreachTeam, setCmsOutreachTeam] = useState<OutreachMember[]>([]);
  const [cmsGalleryPhotos, setCmsGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [cmsCoursePrograms, setCmsCoursePrograms] = useState<CourseProgram[]>([]);
  const [cmsFeatures, setCmsFeatures] = useState<any[]>([]);
  const [cmsTimelineEvents, setCmsTimelineEvents] = useState<any[]>([]);
  const [cmsStatus, setCmsStatus] = useState({ success: false, error: "", saving: false });

  // For faculty item modal/form
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [facultyForm, setFacultyForm] = useState<Omit<FacultyMember, "id">>({
    name: "",
    role: "",
    qual: "",
    desc: "",
    img: ""
  });

  // For course item modal/form
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseProgram | null>(null);
  const [courseForm, setCourseForm] = useState<Omit<CourseProgram, "id">>({
    name: "",
    img: "",
    desc: "",
    focus: ""
  });

  // For homepage features item modal/form
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any | null>(null);
  const [featureForm, setFeatureForm] = useState<{ title: string; desc: string; img: string; localName?: string }>({
    title: "",
    desc: "",
    img: "",
    localName: ""
  });

  // For daily timeline / journey events (Morning Assembly, Healthy Lunch Break etc)
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<any | null>(null);
  const [timelineForm, setTimelineForm] = useState<{ time: string; event: string; img: string; localName?: string }>({
    time: "",
    event: "",
    img: "",
    localName: ""
  });

  // For outreach item modal/form
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);
  const [editingOutreach, setEditingOutreach] = useState<OutreachMember | null>(null);
  const [outreachForm, setOutreachForm] = useState<Omit<OutreachMember, "id">>({
    name: "",
    role: "",
    phone: "",
    img: ""
  });

  // For gallery item modal/form
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryPhoto | null>(null);
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryPhoto, "id">>({
    title: "",
    category: "",
    url: "",
    desc: ""
  });

  // websiteContent loading logic moved below state declarations to support dirty/tab checks

  // Handle image upload to Base64
  const handleCmsImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showAlert("Please upload a valid image file!", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showAlert("Image file too large! Maximum limit is 10MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (field === "facultyPhoto") {
        setFacultyForm(prev => ({ ...prev, img: base64String }));
      } else if (field === "coursePhoto") {
        setCourseForm(prev => ({ ...prev, img: base64String }));
      } else if (field === "featurePhoto") {
        setFeatureForm(prev => ({ ...prev, img: base64String }));
      } else if (field === "timelinePhoto") {
        setTimelineForm(prev => ({ ...prev, img: base64String }));
      } else if (field === "outreachPhoto") {
        setOutreachForm(prev => ({ ...prev, img: base64String }));
      } else if (field === "galleryPhoto") {
        setGalleryForm(prev => ({ ...prev, url: base64String }));
      } else {
        setCmsForm(prev => ({ ...prev, [field]: base64String }));
      }
      showAlert("Image uploaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  // Save regular website dynamic content (schoolName, principal info, campus photos etc)
  const handleSaveCmsSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteContent) return;

    setCmsStatus({ success: false, error: "", saving: true });

    const updatedPayload: WebsiteContent = {
      ...cmsForm,
      faculty: cmsFaculty,
      outreachTeam: cmsOutreachTeam,
      galleryPhotos: cmsGalleryPhotos,
      coursePrograms: cmsCoursePrograms,
      features: cmsFeatures
    };

    const success = await updateWebsiteContent(updatedPayload);
    if (success) {
      setCmsStatus({ success: true, error: "", saving: false });
      showAlert("Website dynamic content published successfully!", "success");
    } else {
      setCmsStatus({ success: false, error: "Database rejected publication, please try again.", saving: false });
      showAlert("Publication rejected by ledger database.", "error");
    }
  };

  // Faculty actions
  const handleAddOrEditFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteContent) return;

    let updatedFacultyList = [...cmsFaculty];

    if (editingFaculty) {
      // Edit mode
      updatedFacultyList = updatedFacultyList.map(member => 
        member.id === editingFaculty.id 
          ? { ...member, ...facultyForm }
          : member
      );
    } else {
      // Add mode
      const newMember: FacultyMember = {
        id: `fac-${Date.now()}`,
        ...facultyForm
      };
      updatedFacultyList.push(newMember);
    }

    // Save configuration immediately to backend
    const updatedPayload: WebsiteContent = {
      ...cmsForm,
      faculty: updatedFacultyList,
      outreachTeam: cmsOutreachTeam,
      galleryPhotos: cmsGalleryPhotos,
      coursePrograms: cmsCoursePrograms,
      features: cmsFeatures
    };

    const success = await updateWebsiteContent(updatedPayload);
    if (success) {
      setCmsFaculty(updatedFacultyList);
      setIsFacultyModalOpen(false);
      setEditingFaculty(null);
      setFacultyForm({ name: "", role: "", qual: "", desc: "", img: "" });
      showAlert(editingFaculty ? "Faculty details revised successfully!" : "New Faculty enrolled successfully!", "success");
    } else {
      showAlert("Failed to persist changes in ledger.", "error");
    }
  };

  const handleDeleteFaculty = (memberId: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      message: `Do you want to permanently delete faculty member "${name}" from the school database?`,
      onConfirm: async () => {
        const updatedFacultyList = cmsFaculty.filter(m => m.id !== memberId);
        const updatedPayload: WebsiteContent = {
          ...cmsForm,
          faculty: updatedFacultyList,
          outreachTeam: cmsOutreachTeam,
          galleryPhotos: cmsGalleryPhotos,
          coursePrograms: cmsCoursePrograms,
          features: cmsFeatures
        };

        const success = await updateWebsiteContent(updatedPayload);
        if (success) {
          setCmsFaculty(updatedFacultyList);
          showAlert("Faculty removed from index.", "success");
        } else {
          showAlert("Failed to delete faculty member.", "error");
        }
      }
    });
  };

  // Course actions
  const handleAddOrEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteContent) return;

    let updatedCourseList = [...cmsCoursePrograms];

    if (editingCourse) {
      updatedCourseList = updatedCourseList.map(course => 
        course.id === editingCourse.id 
          ? { ...course, ...courseForm }
          : course
      );
    } else {
      const newCourse: CourseProgram = {
        id: `course-${Date.now()}`,
        ...courseForm
      };
      updatedCourseList.push(newCourse);
    }

    const updatedPayload: WebsiteContent = {
      ...cmsForm,
      faculty: cmsFaculty,
      outreachTeam: cmsOutreachTeam,
      galleryPhotos: cmsGalleryPhotos,
      coursePrograms: updatedCourseList,
      features: cmsFeatures
    };

    const success = await updateWebsiteContent(updatedPayload);
    if (success) {
      setCmsCoursePrograms(updatedCourseList);
      setIsCourseModalOpen(false);
      setEditingCourse(null);
      setCourseForm({ name: "", img: "", desc: "", focus: "" });
      showAlert(editingCourse ? "Course revised successfully!" : "New Course enrolled successfully!", "success");
    } else {
      showAlert("Failed to persist changes.", "error");
    }
  };

  const handleDeleteCourse = (courseId: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      message: `Do you want to permanently delete course "${name}" from the curriculum index?`,
      onConfirm: async () => {
        const updatedCourseList = cmsCoursePrograms.filter(c => c.id !== courseId);
        const updatedPayload: WebsiteContent = {
          ...cmsForm,
          faculty: cmsFaculty,
          outreachTeam: cmsOutreachTeam,
          galleryPhotos: cmsGalleryPhotos,
          coursePrograms: updatedCourseList,
          features: cmsFeatures
        };

        const success = await updateWebsiteContent(updatedPayload);
        if (success) {
          setCmsCoursePrograms(updatedCourseList);
          showAlert("Course removed successfully.", "success");
        } else {
          showAlert("Failed to delete course.", "error");
        }
      }
    });
  };

  // Outreach actions
  const handleAddOrEditOutreach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteContent) return;

    let updatedOutreachList = [...cmsOutreachTeam];

    if (editingOutreach) {
      updatedOutreachList = updatedOutreachList.map(member => 
        member.id === editingOutreach.id 
          ? { ...member, ...outreachForm }
          : member
      );
    } else {
      const newMember: OutreachMember = {
        id: `outreach-${Date.now()}`,
        ...outreachForm
      };
      updatedOutreachList.push(newMember);
    }

    const updatedPayload: WebsiteContent = {
      ...cmsForm,
      faculty: cmsFaculty,
      outreachTeam: updatedOutreachList,
      galleryPhotos: cmsGalleryPhotos,
      coursePrograms: cmsCoursePrograms,
      features: cmsFeatures
    };

    const success = await updateWebsiteContent(updatedPayload);
    if (success) {
      setCmsOutreachTeam(updatedOutreachList);
      setIsOutreachModalOpen(false);
      setEditingOutreach(null);
      setOutreachForm({ name: "", role: "", phone: "", img: "" });
      showAlert(editingOutreach ? "Staff bio revised successfully!" : "New Staff member enrolled successfully!", "success");
    } else {
      showAlert("Failed to persist changes.", "error");
    }
  };

  const handleDeleteOutreach = (memberId: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      message: `Do you want to permanently delete staff member "${name}" from the outreach database?`,
      onConfirm: async () => {
        const updatedOutreachList = cmsOutreachTeam.filter(o => o.id !== memberId);
        const updatedPayload: WebsiteContent = {
          ...cmsForm,
          faculty: cmsFaculty,
          outreachTeam: updatedOutreachList,
          galleryPhotos: cmsGalleryPhotos,
          coursePrograms: cmsCoursePrograms,
          features: cmsFeatures
        };

        const success = await updateWebsiteContent(updatedPayload);
        if (success) {
          setCmsOutreachTeam(updatedOutreachList);
          showAlert("Staff member removed.", "success");
        } else {
          showAlert("Failed to delete staff member.", "error");
        }
      }
    });
  };

  // Gallery actions
  const handleAddOrEditGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteContent) return;

    let updatedGalleryList = [...cmsGalleryPhotos];

    if (editingGallery) {
      updatedGalleryList = updatedGalleryList.map(photo => 
        photo.id === editingGallery.id 
          ? { ...photo, ...galleryForm }
          : photo
      );
    } else {
      const newPhoto: GalleryPhoto = {
        id: `gallery-${Date.now()}`,
        ...galleryForm
      };
      updatedGalleryList.push(newPhoto);
    }

    const updatedPayload: WebsiteContent = {
      ...cmsForm,
      faculty: cmsFaculty,
      outreachTeam: cmsOutreachTeam,
      galleryPhotos: updatedGalleryList,
      coursePrograms: cmsCoursePrograms,
      features: cmsFeatures
    };

    const success = await updateWebsiteContent(updatedPayload);
    if (success) {
      setCmsGalleryPhotos(updatedGalleryList);
      setIsGalleryModalOpen(false);
      setEditingGallery(null);
      setGalleryForm({ title: "", category: "", url: "", desc: "" });
      showAlert(editingGallery ? "Gallery item revised successfully!" : "New Gallery item uploaded successfully!", "success");
    } else {
      showAlert("Failed to persist changes.", "error");
    }
  };

  const handleDeleteGallery = (photoId: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      message: `Do you want to permanently delete gallery photo "${title || 'Untitled'}"?`,
      onConfirm: async () => {
        const updatedGalleryList = cmsGalleryPhotos.filter(g => g.id !== photoId);
        const updatedPayload: WebsiteContent = {
          ...cmsForm,
          faculty: cmsFaculty,
          outreachTeam: cmsOutreachTeam,
          galleryPhotos: updatedGalleryList,
          coursePrograms: cmsCoursePrograms,
          features: cmsFeatures
        };

        const success = await updateWebsiteContent(updatedPayload);
        if (success) {
          setCmsGalleryPhotos(updatedGalleryList);
          showAlert("Gallery item removed.", "success");
        } else {
          showAlert("Failed to delete gallery item.", "error");
        }
      }
    });
  };

  // Feature actions
  const handleAddOrEditFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteContent) return;

    let updatedFeatureList = [...cmsFeatures];

    // If editing a default feature and cmsFeatures is empty, pre-populate from defaults
    if (updatedFeatureList.length === 0 && editingFeature) {
      updatedFeatureList = defaultFeaturesList.map(item => ({ ...item }));
    }

    if (editingFeature) {
      updatedFeatureList = updatedFeatureList.map(feat => 
        feat.id === editingFeature.id 
          ? { ...feat, ...featureForm }
          : feat
      );
    } else {
      const newFeature = {
        id: `feat-${Date.now()}`,
        ...featureForm
      };
      updatedFeatureList.push(newFeature);
    }

    const updatedPayload: WebsiteContent = {
      ...cmsForm,
      faculty: cmsFaculty,
      outreachTeam: cmsOutreachTeam,
      galleryPhotos: cmsGalleryPhotos,
      coursePrograms: cmsCoursePrograms,
      features: updatedFeatureList
    };

    const success = await updateWebsiteContent(updatedPayload);
    if (success) {
      setCmsFeatures(updatedFeatureList);
      setIsFeatureModalOpen(false);
      setEditingFeature(null);
      setFeatureForm({ title: "", desc: "", img: "", localName: "" });
      showAlert(editingFeature ? "Curriculum pillar updated successfully!" : "New Curriculum pillar added successfully!", "success");
    } else {
      showAlert("Failed to persist changes.", "error");
    }
  };

  const handleDeleteFeature = (featId: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      message: `Do you want to permanently delete homepage curriculum pillar "${title}"?`,
      onConfirm: async () => {
        let updatedFeatureList = [...cmsFeatures];
        if (updatedFeatureList.length === 0) {
          updatedFeatureList = defaultFeaturesList.map(item => ({ ...item }));
        }
        updatedFeatureList = updatedFeatureList.filter(f => f.id !== featId);

        const updatedPayload: WebsiteContent = {
          ...cmsForm,
          faculty: cmsFaculty,
          outreachTeam: cmsOutreachTeam,
          galleryPhotos: cmsGalleryPhotos,
          coursePrograms: cmsCoursePrograms,
          features: updatedFeatureList
        };

        const success = await updateWebsiteContent(updatedPayload);
        if (success) {
          setCmsFeatures(updatedFeatureList);
          showAlert("Homepage feature removed.", "success");
        } else {
          showAlert("Failed to delete feature.", "error");
        }
      }
    });
  };

  // Timeline / Daily Journey actions
  const handleAddOrEditTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteContent) return;

    let updatedList = [...cmsTimelineEvents];

    // If editing/creating one of the defaults but cmsTimelineEvents is empty in db
    if (updatedList.length === 0 && editingTimeline) {
      updatedList = defaultTimelineEventsList.map(item => ({ ...item }));
    }

    if (editingTimeline) {
      updatedList = updatedList.map(evt => 
        evt.id === editingTimeline.id 
          ? { ...evt, ...timelineForm }
          : evt
      );
    } else {
      const newEvent = {
        id: `time-${Date.now()}`,
        ...timelineForm
      };
      updatedList.push(newEvent);
    }

    const updatedPayload: WebsiteContent = {
      ...cmsForm,
      faculty: cmsFaculty,
      outreachTeam: cmsOutreachTeam,
      galleryPhotos: cmsGalleryPhotos,
      coursePrograms: cmsCoursePrograms,
      features: cmsFeatures,
      timelineEvents: updatedList
    };

    const success = await originalUpdateWebsiteContent(updatedPayload);
    if (success) {
      setCmsTimelineEvents(updatedList);
      setIsTimelineModalOpen(false);
      setEditingTimeline(null);
      setTimelineForm({ time: "", event: "", img: "", localName: "" });
      showAlert(editingTimeline ? "Timeline daily journey revised successfully!" : "New timeline event added successfully!", "success");
    } else {
      showAlert("Failed to persist timeline changes.", "error");
    }
  };

  const handleDeleteTimelineEvent = (eventId: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      message: `Do you want to permanently delete daily journey event "${title}"?`,
      onConfirm: async () => {
        let updatedList = [...cmsTimelineEvents];
        if (updatedList.length === 0) {
          updatedList = defaultTimelineEventsList.map(item => ({ ...item }));
        }
        updatedList = updatedList.filter(e => e.id !== eventId);

        const updatedPayload: WebsiteContent = {
          ...cmsForm,
          faculty: cmsFaculty,
          outreachTeam: cmsOutreachTeam,
          galleryPhotos: cmsGalleryPhotos,
          coursePrograms: cmsCoursePrograms,
          features: cmsFeatures,
          timelineEvents: updatedList
        };

        const success = await originalUpdateWebsiteContent(updatedPayload);
        if (success) {
          setCmsTimelineEvents(updatedList);
          showAlert("Daily journey timeline event deleted successfully.", "success");
        } else {
          showAlert("Failed to delete event.", "error");
        }
      }
    });
  };

  // Notices tabs & draft states
  const [noticeSubTab, setNoticeSubTab] = useState<"live" | "draft">("live");
  const [isDraftCheck, setIsDraftCheck] = useState(false);

  // Admissions view filter state
  const [admissionFilter, setAdmissionFilter] = useState<"requested" | "confirmed" | "saved" | "all">("requested");

  // Authentication states
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaChallenge, setCaptchaChallenge] = useState<{ challengeId: string; question: string } | null>(null);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  // Panel navigation states
  const [activeTab, setActiveTab] = useState<"notices" | "fees" | "ticker" | "security" | "admissions" | "cms">("notices");

  // Operational states for editing
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeForm, setNoticeForm] = useState<{
    title: string;
    cat: string;
    desc: string;
    date: string;
    attachmentBase64?: string;
    attachmentName?: string;
    attachmentUrl?: string;
  }>({
    title: "",
    cat: "Enrollment",
    desc: "",
    date: "",
    attachmentBase64: "",
    attachmentName: "",
    attachmentUrl: ""
  });

  const [editableFees, setEditableFees] = useState<ClassFee[]>([]);
  const [adminMonthlyCats, setAdminMonthlyCats] = useState<string[]>([]);
  const [adminYearlyCats, setAdminYearlyCats] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newClassNameInput, setNewClassNameInput] = useState("");
  const [adminFeeTab, setAdminFeeTab] = useState<"monthly" | "yearly">("monthly");
  const [hasInitializedFees, setHasInitializedFees] = useState(false);
  const [feeStatus, setFeeStatus] = useState({ success: false, error: "", saving: false });

  const [tickerInput, setTickerInput] = useState("");
  const [tickerStatus, setTickerStatus] = useState({ success: false, error: "", saving: false });

  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState({ success: false, error: "", saving: false });

  // Load websiteContent into state with a single initialization guard to prevent typing overwrite
  useEffect(() => {
    if (websiteContent && !isCmsInitializedRef.current) {
      setCmsForm({
        schoolName: websiteContent.schoolName || "",
        schoolLogo: websiteContent.schoolLogo || "",
        principalName: websiteContent.principalName || "",
        principalRole: websiteContent.principalRole || "",
        principalQuote: websiteContent.principalQuote || "",
        principalBio: websiteContent.principalBio || "",
        principalStat: websiteContent.principalStat || "",
        principalPhoto: websiteContent.principalPhoto || "",
        campusPhoto1: websiteContent.campusPhoto1 || "",
        campusPhoto2: websiteContent.campusPhoto2 || "",
        campusPhoto3: websiteContent.campusPhoto3 || "",
        heroTagline: websiteContent.heroTagline || "Ekdara's Premier Academic Institution",
        heroSubheader: websiteContent.heroSubheader || "English Medium Boarding School",
        heroDesc: websiteContent.heroDesc || "Providing a world-class English medium foundation for children from Nursery to Grade 7 with a focus on holistic development, modern digital tools, and deep character building.",
        heroPhoto: websiteContent.heroPhoto || "",
        spotlightPhoto: websiteContent.spotlightPhoto || "",
        spotlightTag: websiteContent.spotlightTag || "Learning Spotlight",
        spotlightTitle: websiteContent.spotlightTitle || "Empowering with Modern Technology Integration",
        admissionsBgPhoto: websiteContent.admissionsBgPhoto || "",
        schoolPhone: websiteContent.schoolPhone || "9801671714 / 9817681582",
        schoolEmail: websiteContent.schoolEmail || "admissions@NCEMBS.edu.np",
        schoolAddress: websiteContent.schoolAddress || "Baheda, Ekdara-6, Mahottari, Madhesh Nepal",
        schoolGoogleMaps: websiteContent.schoolGoogleMaps || "",
      });
      setCmsFaculty(websiteContent.faculty || []);
      setCmsOutreachTeam(websiteContent.outreachTeam || []);
      setCmsGalleryPhotos(websiteContent.galleryPhotos || []);
      setCmsCoursePrograms(websiteContent.coursePrograms || []);
      setCmsFeatures(websiteContent.features || []);
      setCmsTimelineEvents(websiteContent.timelineEvents || []);
      isCmsInitializedRef.current = true;
    }
  }, [websiteContent]);

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
        const sanitized = fees.map(f => {
          const item: any = { className: f.className };
          for (const key of Object.keys(f)) {
            if (key !== "className") {
              item[key] = f[key] === "" ? "" : (f[key] === undefined ? "" : f[key]);
            }
          }
          return item;
        });
        setEditableFees(sanitized);
        setAdminMonthlyCats(monthlyFeeCategories || []);
        setAdminYearlyCats(yearlyFeeCategories || []);
        setHasInitializedFees(true);
      }
      if (!tickerInput && tickerMessage) {
        setTickerInput(tickerMessage);
      }
    }
  }, [adminToken, fees, tickerMessage, monthlyFeeCategories, yearlyFeeCategories, hasInitializedFees]);

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
  const handleFeeFieldChange = (index: number, field: string, value: string) => {
    const rawVal = value === "" ? "" : Math.max(0, parseInt(value, 10));
    const copy = [...editableFees];
    copy[index] = { ...copy[index], [field]: rawVal };
    setEditableFees(copy);
  };

  const handleSaveFees = async () => {
    setFeeStatus({ success: false, error: "", saving: true });
    
    // Normalize and sanitize all properties except className into numbers
    const sanitized = editableFees.map(f => {
      const item: any = { className: f.className };
      for (const key of Object.keys(f)) {
        if (key !== "className") {
          item[key] = f[key] === "" ? 0 : (Number(f[key]) || 0);
        }
      }
      return item;
    });

    const ok = await updateFees(sanitized, adminMonthlyCats, adminYearlyCats);
    if (ok) {
      setEditableFees(sanitized);
      setFeeStatus({ success: true, error: "", saving: false });
      setTimeout(() => setFeeStatus(prev => ({ ...prev, success: false })), 3000);
    } else {
      setFeeStatus({ success: false, error: "Failed to update fees list. Session might have expired.", saving: false });
    }
  };

  // Dynamically add a fee category (column)
  const handleAddCategory = (tab: "monthly" | "yearly", name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Convert to a neat alphanumeric identifier for state keys (standard: lowercase first word, capital next words)
    const key = trimmedName
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");

    if (!key) return;

    if (tab === "monthly") {
      if (adminMonthlyCats.includes(key)) {
        showAlert("Fee category already exists in monthly list!");
        return;
      }
      setAdminMonthlyCats([...adminMonthlyCats, key]);
    } else {
      if (adminYearlyCats.includes(key)) {
        showAlert("Fee category already exists in yearly list!");
        return;
      }
      setAdminYearlyCats([...adminYearlyCats, key]);
    }

    // Initialize the new property as 0 on all local rows
    setEditableFees(editableFees.map(f => ({ ...f, [key]: 0 })));
    setNewCategoryName("");
    showAlert(`Category column "${trimmedName}" added successfully! Remember to Publish Ledger Changes to save.`, "success");
  };

  // Dynamically remove a fee category (column)
  const handleRemoveCategory = (tab: "monthly" | "yearly", key: string, label: string) => {
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to completely delete "${label}" column key? All values entered for this column will be lost across all classes.`,
      onConfirm: () => {
        if (tab === "monthly") {
          setAdminMonthlyCats(adminMonthlyCats.filter(c => c !== key));
        } else {
          setAdminYearlyCats(adminYearlyCats.filter(c => c !== key));
        }

        setEditableFees(editableFees.map(f => {
          const copy = { ...f };
          delete copy[key];
          return copy;
        }));
        showAlert(`Column "${label}" removed from layout. Publish changes to persist.`, "success");
      }
    });
  };

  // Dynamically add a class/grade row
  const handleAddClassRow = (className: string) => {
    const trimmed = className.trim();
    if (!trimmed) return;
    if (editableFees.some(f => f.className.toUpperCase() === trimmed.toUpperCase())) {
      showAlert("A row for this Class already exists in the ledger grid!");
      return;
    }

    const newRow: any = { className: trimmed };
    adminMonthlyCats.forEach(cat => { newRow[cat] = 0; });
    adminYearlyCats.forEach(cat => { newRow[cat] = 0; });

    setEditableFees([...editableFees, newRow]);
    setNewClassNameInput("");
    showAlert(`Class row for "${trimmed}" added! Remember to Publish Ledger Changes to save.`, "success");
  };

  // Dynamically remove a class/grade row
  const handleRemoveClassRow = (index: number, className: string) => {
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to permanently delete Class row "${className}"? This will vanish its registry data from this panel.`,
      onConfirm: () => {
        const copy = [...editableFees];
        copy.splice(index, 1);
        setEditableFees(copy);
        showAlert(`Class row for "${className}" removed. Publish changes to save.`, "success");
      }
    });
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
    setNoticeForm({
      title: "",
      cat: "Enrollment",
      desc: "",
      date: "",
      attachmentBase64: "",
      attachmentName: "",
      attachmentUrl: ""
    });
    setIsDraftCheck(false);
    setIsNoticeModalOpen(true);
  };

  const openEditNoticeModal = (notice: Notice) => {
    setEditingNotice(notice);
    setNoticeForm({
      title: notice.title,
      cat: notice.cat,
      desc: notice.desc,
      date: notice.date,
      attachmentBase64: "",
      attachmentName: notice.attachmentName || "",
      attachmentUrl: notice.attachmentUrl || ""
    });
    setIsNoticeModalOpen(true);
  };

  const handleNoticeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validMimeTypes.includes(file.type)) {
      showAlert("Invalid file format! Please upload an image (PNG, JPEG, WebP) or PDF.", "error");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showAlert("File size is too large! Maximum limit is 20MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNoticeForm(prev => ({
        ...prev,
        attachmentBase64: base64String,
        attachmentName: file.name
      }));
      showAlert(`Selected file: ${file.name}`, "success");
    };
    reader.readAsDataURL(file);
  };

  const handleClearNoticeAttachment = () => {
    setNoticeForm(prev => ({
      ...prev,
      attachmentBase64: "",
      attachmentName: "",
      attachmentUrl: ""
    }));
    showAlert("Attachment cleared", "success");
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
      setNoticeForm({
        title: "",
        cat: "Enrollment",
        desc: "",
        date: "",
        attachmentBase64: "",
        attachmentName: "",
        attachmentUrl: ""
      });
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
      <div className="min-h-[90vh] flex items-center justify-center px-4 bg-[#030c17] py-20 relative overflow-hidden">
        {/* Subtle decorative background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0c233f]/65 backdrop-blur-xl rounded-[40px] shadow-premium overflow-hidden border border-white/10"
        >
          <div className="bg-[#030c17] p-8 md:p-10 text-center relative border-b border-white/5">
            <div className="absolute top-4 right-4 text-accent/10 block">
              <Lock size={60} />
            </div>
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-[#030c17] mx-auto mb-4 shadow-luxe">
              <KeyRound size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white">Administrative Vault</h2>
            <p className="text-accent text-[9px] uppercase font-black tracking-widest mt-2 font-sans">New Concept English School</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-8 md:p-10 space-y-8">
            {authError && (
              <div className="bg-red-950/50 text-red-400 border border-red-500/30 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed font-bold">
                <AlertCircle className="shrink-0 text-red-400" size={16} />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed font-bold">
                <CheckCircle className="shrink-0 text-emerald-400" size={16} />
                <span>Vault Unlocked! Launching console...</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#ffb703] block ml-2">Console Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#11243d] border border-[#ffb703]/25 focus:border-[#ffb703] text-white placeholder-white/45 ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-extrabold shadow-inner focus:ring-4 focus:ring-[#ffb703]/20 transition-all"
                  placeholder="e.g. admin"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#ffb703] block ml-2">Console Key password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setUsernameInput ? setPasswordInput(e.target.value) : undefined}
                    className="w-full bg-[#11243d] border border-[#ffb703]/25 focus:border-[#ffb703] text-white placeholder-white/45 ring-0 rounded-2xl pl-5 pr-12 py-4 focus:outline-none text-sm font-extrabold shadow-inner focus:ring-4 focus:ring-[#ffb703]/20 transition-all"
                    placeholder="••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ffb703] hover:text-white transition-colors focus:outline-none cursor-pointer p-1.5 bg-[#0c233f]/80 rounded-xl border border-[#ffb703]/30 hover:border-white shadow-md z-10 hover:scale-105"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {captchaChallenge && (
              <div className="bg-amber-500/10 p-5 rounded-3xl border border-amber-500/30 space-y-4">
                <div className="flex justify-between items-center gap-3">
                  <p className="text-xs font-black text-[#ffb703] uppercase tracking-wider leading-relaxed italic">
                    AI Bot Verification: <span className="text-white text-sm font-black underline decoration-[#ffb703] ml-1">{captchaChallenge.question}</span>
                  </p>
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-amber-300 transition-colors shrink-0 border border-amber-500/20"
                    title="Refresh CAPTCHA puzzle"
                  >
                    <RefreshCw size={14} className="animate-spin-slow" />
                  </button>
                </div>
                <input
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-full bg-[#11243d] border border-amber-500/30 text-white placeholder-white/40 focus:border-white rounded-xl px-4 py-3 text-sm font-black shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                  placeholder="Type calculated result"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={authenticating || authSuccess}
              className="w-full bg-[#ffb703] text-[#030c17] py-4.5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-white hover:text-[#030c17] disabled:opacity-40 transition-all flex items-center justify-center gap-3 cursor-pointer"
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
      <div className="bg-[#0c233f] text-white rounded-[40px] md:rounded-[60px] shadow-3xl border border-white/10 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#030c17] text-white px-8 py-10 md:px-16 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5">
          <div>
            <span className="bg-accent text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3 shadow-md">
              Security Grade Level: High
            </span>
            <h1 className="text-2xl md:text-4xl font-black italic text-white leading-tight">Admin Control Panel</h1>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.2em] mt-2">
              School Resource dispatch & Tuition Ledger
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto relative justify-end">
            {/* Animated System Alerts Bell Component */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="bg-white/10 hover:bg-white/15 text-accent p-3.5 rounded-2xl font-black transition-all flex items-center justify-center relative shadow active:scale-95 duration-200"
                title="System Notifications"
              >
                <Bell size={18} className={adminNotifications.some((n: any) => !n.read) ? "animate-bounce text-[#ffb703]" : ""} />
                {adminNotifications.some((n: any) => !n.read) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center border border-[#030c17]">
                    {adminNotifications.filter((n: any) => !n.read).length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0c233f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-50 text-left text-white"
                  >
                    <div className="bg-[#030c17] p-5 border-b border-white/10 flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-xs uppercase tracking-wider text-accent">System Alerts</h4>
                        <p className="text-[10px] text-white/50 mt-1">{adminNotifications.length} Notifications total</p>
                      </div>
                      <div className="flex gap-2">
                        {adminNotifications.some((n: any) => !n.read) && (
                          <button
                            onClick={() => {
                              markAdminNotificationsRead();
                              setNotifDropdownOpen(false);
                            }}
                            className="text-[9px] bg-accent/20 hover:bg-accent hover:text-primary px-2.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all"
                            title="Mark all as read"
                          >
                            Read All
                          </button>
                        )}
                        {adminNotifications.length > 0 && (
                          <button
                            onClick={() => {
                              clearAdminNotifications();
                              setNotifDropdownOpen(false);
                            }}
                            className="text-[9px] bg-red-500/20 hover:bg-red-500 text-white px-2.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all"
                            title="Clear all alerts"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto divide-y divide-white/5">
                      {adminNotifications.length === 0 ? (
                        <div className="p-8 text-center text-white/40 text-xs font-semibold">
                          <Bell size={24} className="mx-auto mb-3 opacity-20" />
                          No new admission alerts.
                        </div>
                      ) : (
                        adminNotifications.map((n: any) => (
                          <div key={n.id} className={`p-4.5 transition-all relative group ${!n.read ? "bg-white/5" : "hover:bg-white/5 opacity-85"}`}>
                            <div className="flex items-start gap-3">
                              <div className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${!n.read ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`}></div>
                              <div>
                                <p className="text-xs font-black text-white group-hover:text-accent transition-colors leading-tight mb-1">{n.title}</p>
                                <p className="text-[11px] text-white/70 font-semibold leading-relaxed mb-2">{n.message}</p>
                                <span className="text-[9px] text-[#ffb703] font-mono uppercase tracking-wider">
                                  {new Date(n.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric" })} at {new Date(n.createdAt).toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={logoutAdmin}
              className="bg-white/10 hover:bg-red-600 hover:text-white text-accent px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 self-stretch md:self-auto justify-center shadow"
            >
              <LogOut size={14} /> Close Session
            </button>
          </div>
        </div>

        {/* Console Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-[#030c17] border-r border-white/10 p-6 md:p-8 space-y-2">
            {[
              { id: "notices", label: "Notices Dispatcher", icon: <Bell size={16} /> },
              { id: "fees", label: "Classes Fee Ledger", icon: <Coins size={16} /> },
              { id: "ticker", label: "Banner News Ticker", icon: <Sparkles size={16} /> },
              { id: "admissions", label: "Admission Panel", icon: <UserPlus size={16} />, badge: (admissions || []).filter((a: any) => a.status === 'requested').length },
              { id: "cms", label: "Website Settings (CMS)", icon: <Globe size={16} /> },
              { id: "security", label: "Vault Password", icon: <KeyRound size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-5 py-4.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all text-left ${
                  activeTab === tab.id
                    ? "bg-accent text-[#0c233f] shadow-lg shadow-accent/10 -translate-y-0.5 animate-none"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black leading-none ${activeTab === tab.id ? "bg-[#0c233f] text-accent font-black" : "bg-red-500 text-white animate-pulse"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Core Content Box */}
          <div className="lg:col-span-9 p-8 md:p-14 bg-[#0a0f18] text-white">
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
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white italic">Notices Dispatcher</h2>
                      <p className="text-sm text-white/50 font-semibold mt-1">
                        Add, modify or delete announcements displayed on the Notices Portal
                      </p>
                    </div>
                    <button
                      onClick={openAddNoticeModal}
                      className="bg-accent text-[#0c233f] hover:bg-white hover:text-[#030c17] px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 self-stretch sm:self-auto justify-center"
                    >
                      <Plus size={16} /> Craft Announcement
                    </button>
                  </div>

                  {/* Notices Sub-Tabs */}
                  <div className="flex border-b border-white/5 pb-2 ml-1 space-x-6">
                    <button
                      type="button"
                      onClick={() => setNoticeSubTab("live")}
                      className={`pb-3 text-xs uppercase font-black tracking-wider transition-colors border-b-2 relative ${
                        noticeSubTab === "live"
                          ? "text-accent border-accent"
                          : "text-white/40 border-transparent hover:text-white/70"
                      }`}
                    >
                      Live Broadcasts ({notices.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoticeSubTab("draft")}
                      className={`pb-3 text-xs uppercase font-black tracking-wider transition-colors border-b-2 relative ${
                        noticeSubTab === "draft"
                          ? "text-accent border-accent"
                          : "text-white/40 border-transparent hover:text-white/70"
                      }`}
                    >
                      Drafts & Trash bin ({(drafts || []).length})
                    </button>
                  </div>

                  <div className="space-y-4">
                    {noticeSubTab === "live" ? (
                      notices.length === 0 ? (
                        <div className="text-center py-16 bg-[#0c233f]/50 rounded-3xl border border-dashed border-white/10">
                          <p className="text-white/40 font-bold text-sm">No live notices exist. Click button above to add!</p>
                        </div>
                      ) : (
                        notices.map((n) => (
                          <div
                            key={n.id}
                            className="p-6 md:p-8 bg-[#0c233f]/40 rounded-[32px] border border-white/5 hover:border-accent/40 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                          >
                            <div className="space-y-2 max-w-xl">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] bg-accent text-[#0c233f] px-3 py-1 rounded-full font-black uppercase tracking-wider">
                                  {n.cat}
                                </span>
                                <span className="text-xs font-bold text-white/40">{n.date}</span>
                              </div>
                              <h4 className="text-lg font-black text-white tracking-tight">{n.title}</h4>
                              <p className="text-xs text-white/60 font-semibold line-clamp-2 leading-relaxed">{n.desc}</p>
                            </div>
                            <div className="flex gap-2 self-stretch md:self-auto">
                              <button
                                type="button"
                                onClick={() => openEditNoticeModal(n)}
                                className="flex-1 md:flex-none p-3.5 bg-[#0c233f] hover:bg-accent hover:text-[#0c233f] border border-white/10 text-white rounded-xl transition-colors flex justify-center items-center"
                                title="Edit live notice"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRevertToDraftClick(n.id)}
                                className="flex-1 md:flex-none p-3.5 bg-[#0c233f] hover:bg-amber-600 hover:text-white border border-white/10 text-white rounded-xl transition-colors flex justify-center items-center"
                                title="Revert to Draft"
                              >
                                <Archive size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteNoticeClick(n.id)}
                                className="flex-1 md:flex-none p-3.5 bg-[#0c233f] hover:bg-red-600 hover:text-white border border-white/10 text-white rounded-xl transition-colors flex justify-center items-center"
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
                        <div className="text-center py-16 bg-[#0c233f]/50 rounded-3xl border border-dashed border-white/10">
                          <p className="text-white/40 font-bold text-sm">Your drafts and trash archive is empty.</p>
                          <p className="text-xs text-white/30 font-medium mt-1">Reverted or draft notices can be published live anytime!</p>
                        </div>
                      ) : (
                        drafts.map((d) => (
                          <div
                            key={d.id}
                            className="p-6 md:p-8 bg-amber-950/20 rounded-[32px] border border-amber-500/20 hover:border-amber-500/40 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                          >
                            <div className="space-y-2 max-w-xl">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] bg-amber-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-wider">
                                  {d.cat} (Draft)
                                </span>
                                <span className="text-xs font-bold text-white/40">{d.date || "No date defined"}</span>
                              </div>
                              <h4 className="text-lg font-black text-amber-300 tracking-tight">{d.title}</h4>
                              <p className="text-xs text-amber-100/60 font-semibold line-clamp-2 leading-relaxed">{d.desc}</p>
                            </div>
                            <div className="flex gap-2 self-stretch md:self-auto">
                              <button
                                type="button"
                                onClick={() => handlePublishDraftClick(d.id)}
                                className="flex-1 md:flex-none px-4 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex justify-center items-center gap-2 text-xs font-black uppercase tracking-widest"
                                title="Publish Draft Notice Live"
                              >
                                <Globe size={14} /> Publish Live
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditNoticeModal(d)}
                                className="p-3.5 bg-[#0c233f] hover:bg-accent hover:text-[#0c233f] border border-white/10 text-white rounded-xl transition-colors flex justify-center items-center"
                                title="Edit Draft"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDraftPermanentlyClick(d.id)}
                                className="p-3.5 bg-[#0c233f] hover:bg-red-600 hover:text-white border border-white/10 text-[#f55] rounded-xl transition-colors flex justify-center items-center"
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
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white italic">Tuition & Admission Register</h2>
                    <p className="text-sm text-white/50 font-semibold mt-1">
                      Revise specific fee charts for all classes displayed on the Admissions screen. Fully responsive with unlimited custom categories.
                    </p>
                  </div>

                  {feeStatus.success && (
                    <div className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <CheckCircle size={16} />
                      Class schedules updated in file registry successfully!
                    </div>
                  )}

                  {feeStatus.error && (
                    <div className="bg-red-950/80 text-red-400 border border-red-800 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <AlertCircle size={16} />
                      {feeStatus.error}
                    </div>
                  )}

                  {/* Dual Tab Mode Selector */}
                  <div className="flex border border-white/10 bg-[#0d2c54]/50 p-2 gap-2 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setAdminFeeTab("monthly")}
                      className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        adminFeeTab === "monthly"
                          ? "bg-accent text-[#0c233f] shadow-md"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Monthly Wise Fees
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminFeeTab("yearly")}
                      className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        adminFeeTab === "yearly"
                          ? "bg-accent text-[#0c233f] shadow-md"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Yearly / One-Time Fees
                    </button>
                  </div>

                  {/* Category & Row Add Forms Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#030c17] p-6 rounded-[24px] border border-white/10">
                    {/* Add Category Column Column */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse inline-block" />
                        Manage {adminFeeTab === "monthly" ? "Monthly" : "Yearly"} Columns
                      </h3>
                      <p className="text-xs text-white/50 font-semibold leading-relaxed">
                        Add a brand new fee column category (e.g. "Library Fee", "Terminal Exam") to the active {adminFeeTab} ledger tab. Column count has no limitations.
                      </p>
                      
                      {/* List active columns for deletion */}
                      <div className="flex flex-wrap gap-2 py-2">
                        {(adminFeeTab === "monthly" ? adminMonthlyCats : adminYearlyCats).map((catName) => (
                          <div 
                            key={catName}
                            className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] font-bold text-white flex items-center gap-1.5 transition-all hover:bg-white/10"
                          >
                            <span>
                              {formatCategoryLabel(catName)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(
                                adminFeeTab, 
                                catName, 
                                formatCategoryLabel(catName)
                              )}
                              className="text-white/40 hover:text-red-400 transition-colors"
                              title="Delete Column"
                            >
                              <X size={12} className="stroke-[3]" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Exam Fee, 1st Terminal Fee"
                          className="flex-1 bg-black text-white text-xs font-semibold rounded-xl px-4 py-3 focus:outline-none border border-white/10 focus:border-accent"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCategory(adminFeeTab, newCategoryName)}
                          className="bg-accent text-black hover:bg-white rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition-all shadow-md"
                        >
                          Add Column
                        </button>
                      </div>
                    </div>

                    {/* Add Class Row Column */}
                    <div className="space-y-4 border-t border-white/5 md:border-t-0 md:border-l md:border-white/5 md:pl-6 pt-4 md:pt-0">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse inline-block" />
                        Manage Class Rows
                      </h3>
                      <p className="text-xs text-white/50 font-semibold leading-relaxed">
                        Add a new class or grade level row to the ledger schedule (e.g. "Grade 8", "Playgroup"). You can delete or modify these class structures anytime.
                      </p>

                      <div className="flex gap-2 pt-6">
                        <input
                          type="text"
                          value={newClassNameInput}
                          placeholder="e.g., Grade 8, Playgroup"
                          onChange={(e) => setNewClassNameInput(e.target.value)}
                          className="flex-1 bg-black text-white text-xs font-semibold rounded-xl px-4 py-3 focus:outline-none border border-white/10 focus:border-accent"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddClassRow(newClassNameInput)}
                          className="bg-accent text-black hover:bg-white rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition-all shadow-md"
                        >
                          Add Row
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unified Compact Responsive Ledger Table */}
                  <div className="overflow-x-auto rounded-[32px] border border-white/10 bg-[#030c17] shadow-inner">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-[#0c233f] text-white text-[10px] font-black uppercase tracking-wider border-none">
                          <th className="p-4 text-center bg-[#051429]">Class</th>
                          {(adminFeeTab === "monthly" ? adminMonthlyCats : adminYearlyCats).map((cat) => (
                            <th key={cat} className="p-4 text-right">
                              {formatCategoryLabel(cat)}
                            </th>
                          ))}
                          <th className="p-4 text-right bg-accent text-[#0c233f]">
                            {adminFeeTab === "monthly" ? "Monthly Total" : "Yearly Total"}
                          </th>
                          <th className="p-4 text-center bg-red-950/20 text-red-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs font-bold text-white/80">
                        {editableFees.map((fee, idx) => {
                          const activeCats = adminFeeTab === "monthly" ? adminMonthlyCats : adminYearlyCats;
                          const sumTotal = activeCats.reduce((sum, cat) => sum + (Number(fee[cat]) || 0), 0);

                          return (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              {/* Class Row Header */}
                              <td className="p-4 font-black tracking-tight bg-white/5 text-white uppercase text-[11px] italic text-center whitespace-nowrap min-w-[70px]">
                                {fee.className}
                              </td>

                              {/* Dynamic Input Columns */}
                              {activeCats.map((catName) => (
                                <td key={catName} className="p-2 px-3 min-w-[125px]">
                                  <input
                                    type="number"
                                    value={fee[catName] === "" || fee[catName] === undefined ? "" : fee[catName]}
                                    onChange={(e) => handleFeeFieldChange(idx, catName, e.target.value)}
                                    className="w-full bg-black text-white rounded-xl px-3 py-2 focus:outline-none focus:bg-[#0c233f] border border-white/15 focus:border-accent text-right font-black font-mono"
                                  />
                                </td>
                              ))}

                              {/* Total Column */}
                              <td className="p-4 text-right font-black text-accent bg-accent/15 tabular-nums min-w-[90px] font-mono">
                                Rs. {sumTotal.toLocaleString()}
                              </td>

                              {/* Actions Column */}
                              <td className="p-4 text-center whitespace-nowrap bg-red-950/5">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveClassRow(idx, fee.className)}
                                  className="text-white/40 hover:text-red-400 p-2 rounded-lg hover:bg-red-950/50 transition-all"
                                  title={`Remove Class ${fee.className}`}
                                >
                                  <Trash2 size={14} />
                                </button>
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
                      className="bg-accent text-[#0c233f] hover:bg-white hover:text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg disabled:opacity-45 transition-all flex items-center gap-3"
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
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white italic">Homepage Alert Ticker</h2>
                    <p className="text-sm text-white/50 font-semibold mt-1">
                      Update the high-impact running ticker message scrolling on the top of the Home page.
                    </p>
                  </div>

                  {tickerStatus.success && (
                    <div className="bg-emerald-950/45 text-emerald-400 border border-emerald-500/25 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <CheckCircle size={16} />
                      Marquee flyer update loaded into memory successfully!
                    </div>
                  )}

                  <form onSubmit={handleSaveTicker} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-2">
                        Ticker message string
                      </label>
                      <textarea
                        value={tickerInput}
                        onChange={(e) => setTickerInput(e.target.value)}
                        rows={4}
                        className="w-full bg-[#0c233f]/50 border border-white/10 text-white focus:border-accent ring-0 rounded-[24px] p-6 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="e.g., Admission Open Now for Academic Intake 2083!"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={tickerStatus.saving}
                        className="bg-accent text-[#0c233f] hover:bg-white hover:text-[#030c17] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg disabled:opacity-45 transition-all flex items-center gap-3"
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
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white italic">Control credentials configuration</h2>
                    <p className="text-sm text-white/50 font-semibold mt-1">
                      Overwrite the username and password required to unlock this administration vault.
                    </p>
                  </div>

                  {passwordStatus.success && (
                    <div className="bg-emerald-950/45 text-emerald-400 border border-emerald-500/25 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <CheckCircle size={16} />
                      Security credentials updated successfully! Use new credentials on next log in.
                    </div>
                  )}

                  {passwordStatus.error && (
                    <div className="bg-red-950/45 text-red-400 border border-red-500/25 p-4 rounded-2xl flex gap-3 text-xs font-bold items-center">
                      <AlertCircle size={16} />
                      {passwordStatus.error}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-2">
                        Current administrator password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className="w-full bg-[#0c233f]/50 border border-white/10 text-white focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="••••••"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-2">
                        New secure username (Optional, min 3 characters)
                      </label>
                      <input
                        type="text"
                        value={passwordForm.newUsername}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newUsername: e.target.value })}
                        className="w-full bg-[#0c233f]/50 border border-white/10 text-white focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="e.g. admin"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-2">
                        New secure password (Optional, min 6 characters)
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full bg-[#0c233f]/50 border border-white/10 text-white focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="At least 6 characters"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-2">
                        Confirm new secure password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full bg-[#0c233f]/50 border border-white/10 text-white focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-sm font-bold shadow-inner"
                        placeholder="At least 6 characters"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={passwordStatus.saving}
                        className="bg-accent text-[#0c233f] hover:bg-white hover:text-[#030c17] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg disabled:opacity-45 transition-all flex items-center gap-3"
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
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white italic">Admission Inquiries</h2>
                      <p className="text-sm text-white/50 font-semibold mt-1">
                        Track, verify, save, and manage lead intakes submitted from the public enrollment portal in real-time.
                      </p>
                    </div>
                  </div>

                  {/* Filter & Stats bar */}
                  <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-6">
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
                                  ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                                  : f.id === "confirmed"
                                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                                  : "bg-accent text-[#0c233f] shadow-md shadow-accent/10"
                                : "bg-[#0c233f]/50 hover:bg-white/5 text-white/60 border border-white/5"
                            }`}
                          >
                            <span>{f.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              admissionFilter === f.id 
                                ? "bg-white text-primary" 
                                : "bg-white/10 text-white/60"
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
                        <div className="text-center py-20 border-2 border-dashed border-white/15 rounded-[30px] bg-[#0c233f]/20">
                          <UserPlus size={48} className="mx-auto text-white/20 mb-4" />
                          <h3 className="font-black text-white text-xl tracking-tight mb-2">No inquiries found</h3>
                          <p className="text-sm text-white/40 font-semibold max-w-xs mx-auto">
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
                              className={`bg-[#0c233f]/30 border rounded-[30px] p-8 transition-all relative overflow-hidden flex flex-col justify-between ${
                                req.status === "requested"
                                  ? "border-red-500/30 bg-red-950/10"
                                  : req.status === "confirmed"
                                  ? "border-emerald-500/30 bg-emerald-950/10"
                                  : "border-white/10"
                              }`}
                            >
                              {/* Background glow or corner ribbon */}
                              <div className={`absolute top-0 right-0 w-24 h-24 opacity-[0.05] rounded-bl-full ${
                                req.status === "requested" ? "bg-red-500" : req.status === "confirmed" ? "bg-emerald-500" : "bg-accent"
                              }`} />

                              <div>
                                <div className="flex justify-between items-start gap-4 mb-6">
                                  <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 ${
                                      req.status === "requested"
                                        ? "bg-red-500/20 text-red-400 animate-pulse"
                                        : req.status === "confirmed"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : "bg-white/10 text-white/60"
                                    }`}>
                                      {req.status === "requested" ? "Requested / New" : req.status === "confirmed" ? "Admission Confirmed" : "Saved Record"}
                                    </span>
                                    <h4 className="font-extrabold text-white text-xl tracking-tight capitalize">{req.studentName}</h4>
                                  </div>
                                  <div className="bg-accent text-[#0c233f] font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-widest shadow-sm shrink-0">
                                    {req.targetClass}
                                  </div>
                                </div>

                                <div className="space-y-4 text-sm font-semibold text-white/70 border-t border-white/5 pt-5 mb-8">
                                  <div className="flex items-center gap-4">
                                    <Phone size={14} className="text-accent shrink-0" />
                                    <a href={`tel:${req.guardianContact}`} className="text-accent hover:text-white font-bold transition-colors">
                                      {req.guardianContact}
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <MapPin size={14} className="text-accent shrink-0" />
                                    <span className="font-medium text-[13px]">{req.address}</span>
                                  </div>
                                  {req.previousSchool && (
                                    <div className="flex items-center gap-4">
                                      <Building2 size={14} className="text-accent shrink-0" />
                                      <span className="font-medium text-[13px] italic text-white/50">Prev: {req.previousSchool}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-4 text-white/30 text-xs">
                                    <Calendar size={13} className="shrink-0" />
                                    <span>{dateFmt}</span>
                                  </div>

                                  {(req.studentPhoto || req.birthCertificate) && (
                                    <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
                                      <div className="text-[10px] uppercase font-black tracking-widest text-[#ffb703]">Attached Identification Documents</div>
                                      <div className="grid grid-cols-2 gap-3.5">
                                        {req.studentPhoto && (
                                          <div className="relative group bg-[#091523]/60 border border-white/5 p-2 rounded-2xl flex flex-col justify-between hover:border-[#ffb703]/20 transition-all">
                                            <span className="text-[8px] font-black text-white/40 uppercase block mb-1">Student Photo</span>
                                            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/40 flex items-center justify-center relative">
                                              {req.studentPhoto.toLowerCase().endsWith('.pdf') ? (
                                                <div 
                                                  onClick={() => window.open(req.studentPhoto, "_blank")}
                                                  className="w-full h-full flex flex-col items-center justify-center p-3 bg-red-950/20 text-red-400 cursor-pointer text-center"
                                                  title="Open Student Photo PDF"
                                                >
                                                  <FileText size={32} className="stroke-[1.5] mb-1.5" />
                                                  <span className="text-[9px] font-black uppercase tracking-wider text-red-300">PDF Document</span>
                                                  <span className="text-[7px] text-white/40 mt-0.5">Click to view</span>
                                                </div>
                                              ) : (
                                                <img 
                                                  src={req.studentPhoto} 
                                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer" 
                                                  onClick={() => window.open(req.studentPhoto, "_blank")}
                                                  alt="Student" 
                                                  title="Open in new tab"
                                                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=2070&auto=format&fit=crop"; }}
                                                />
                                              )}
                                            </div>
                                            <a 
                                              href={req.studentPhoto} 
                                              download={`student-${req.studentName.replace(/\s+/g, '_')}-${req.id}.jpg`}
                                              target="_blank" 
                                              rel="noreferrer"
                                              className="mt-2 text-center text-[9px] font-black text-accent uppercase tracking-widest hover:text-white transition-colors"
                                            >
                                              View Full Photo
                                            </a>
                                          </div>
                                        )}
                                        {req.birthCertificate && (
                                          <div className="relative group bg-[#091523]/60 border border-[#ffb703]/10 p-2 rounded-2xl flex flex-col justify-between hover:border-[#ffb703]/40 transition-all shadow-md">
                                            <span className="text-[8px] font-black text-[#ffb703] uppercase block mb-1">Birth Certificate</span>
                                            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/45 flex items-center justify-center relative border border-white/5">
                                              {req.birthCertificate.toLowerCase().endsWith('.pdf') ? (
                                                <div 
                                                  onClick={() => window.open(req.birthCertificate, "_blank")}
                                                  className="w-full h-full flex flex-col items-center justify-center p-3 bg-red-950/30 text-red-400 cursor-pointer text-center"
                                                  title="Open Birth Certificate PDF"
                                                >
                                                  <FileText size={32} className="stroke-[1.5] mb-1.5 text-red-500" />
                                                  <span className="text-[9px] font-black uppercase tracking-wider text-red-300">PDF Document</span>
                                                  <span className="text-[7px] text-white/45 mt-0.5">Click to view</span>
                                                </div>
                                              ) : (
                                                <img 
                                                  src={req.birthCertificate} 
                                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer" 
                                                  onClick={() => window.open(req.birthCertificate, "_blank")}
                                                  alt="Certificate" 
                                                  title="Open in new tab"
                                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                              )}
                                            </div>
                                            <a 
                                              href={req.birthCertificate} 
                                              download={`birth-cert-${req.studentName.replace(/\s+/g, '_')}-${req.id}.jpg`}
                                              target="_blank" 
                                              rel="noreferrer"
                                              className="mt-2 text-center text-[9px] font-black text-accent uppercase tracking-widest hover:text-white transition-colors"
                                            >
                                              View Document
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Actions footer */}
                              <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-5 justify-between">
                                <div className="flex items-center gap-2">
                                  {req.status === "requested" && (
                                    <>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "confirmed")}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
                                      >
                                        <Check size={12} /> Confirm
                                      </button>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "saved")}
                                        className="bg-[#0c233f] hover:bg-white/5 text-white border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                                      >
                                        <Archive size={12} /> Save
                                      </button>
                                    </>
                                  )}

                                  {req.status === "confirmed" && (
                                    <>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "saved")}
                                        className="bg-accent text-[#0c233f] hover:bg-white hover:text-[#030c17] rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                                      >
                                        <Archive size={12} /> File / Save
                                      </button>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "requested")}
                                        className="bg-[#0c233f] hover:bg-white/5 text-white border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all"
                                      >
                                        Make Pending
                                      </button>
                                    </>
                                  )}

                                  {req.status === "saved" && (
                                    <>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "confirmed")}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
                                      >
                                        <Check size={12} /> Confirm
                                      </button>
                                      <button
                                        onClick={() => updateAdmissionStatus(req.id, "requested")}
                                        className="bg-[#0c233f] hover:bg-white/5 text-white border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all"
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
                                  className="text-red-400 hover:text-white bg-red-950/40 hover:bg-red-600 border border-red-500/20 p-2.5 rounded-xl transition-all"
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

              {/* CMS WEBSITE CONTENT SETTINGS */}
              {activeTab === "cms" && (
                <motion.div
                  key="cms"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12 animate-none"
                >
                  <div className="border-b border-white/5 pb-6">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white italic">Website Content Editor (CMS)</h2>
                    <p className="text-sm text-white/50 font-semibold mt-1">
                      Instantly customize headers, text, bio descriptions, campus images, and faculty members across the whole school website.
                    </p>
                  </div>

                  {/* MAIN CMS BUILDER FORM */}
                  <form onSubmit={handleSaveCmsSettings} className="space-y-10">
                    
                    {/* SECTION 1: GLOBAL BRANDING */}
                    <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Building2 className="text-accent" size={20} />
                        <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider">1. Institutional Identity & Logo</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#ffb703] block ml-1 font-mono">
                            School Full Official Name
                          </label>
                          <input
                            type="text"
                            value={cmsForm.schoolName}
                            onChange={(e) => setCmsForm({ ...cmsForm, schoolName: e.target.value })}
                            className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                            placeholder="e.g. New Concept English Medium Boarding School"
                            required
                          />
                          <p className="text-[10px] text-white/40 leading-relaxed font-semibold">
                            Changing this name updates high-contrast titles, navigation headers, page labels, and administrative metadata.
                          </p>
                        </div>

                        <div className="space-y-2 bg-[#091523]/40 p-4 border border-white/5 rounded-2xl">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#ffb703] block ml-1 font-mono">
                            Official School Logo
                          </label>
                          <div className="relative border border-dashed border-white/20 rounded-[20px] p-3 bg-[#020a14] hover:bg-[#11243d]/60 transition-all flex flex-col items-center justify-center text-center group h-[110px] overflow-hidden">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCmsImageUpload(e, "schoolLogo")}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            {cmsForm.schoolLogo ? (
                              <div className="absolute inset-0 z-10 bg-[#020a14] flex items-center gap-3 p-4">
                                <img
                                  src={cmsForm.schoolLogo}
                                  className="w-14 h-14 rounded-full object-contain bg-[#030d1a]/50 p-1 border border-white/10"
                                  alt="School Logo Preview"
                                />
                                <div className="text-left">
                                  <span className="block text-[10px] font-black text-white uppercase tracking-wider">Logo Set</span>
                                  <span className="block text-[8px] text-accent font-black tracking-widest uppercase mt-0.5 cursor-pointer hover:underline">
                                    Click to Replace
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1.5 z-10 pointer-events-none">
                                <div className="w-7 h-7 rounded-full bg-[#ffb703]/10 border border-[#ffb703]/20 flex items-center justify-center mx-auto text-[#ffb703]">
                                  <Camera size={12} />
                                </div>
                                <span className="block text-[9px] font-black text-white uppercase tracking-wider">Upload Brand Logo</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: PRINCIPAL & LEADER'S VISION */}
                    <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <User className="text-accent" size={20} />
                        <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider">2. Leadership Slogan & Message</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                            Principal Full Name
                          </label>
                          <input
                            type="text"
                            value={cmsForm.principalName}
                            onChange={(e) => setCmsForm({ ...cmsForm, principalName: e.target.value })}
                            className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                            placeholder="e.g. Mr. Kaushlendra Giri"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                            Academic Role / Qualification Title
                          </label>
                          <input
                            type="text"
                            value={cmsForm.principalRole}
                            onChange={(e) => setCmsForm({ ...cmsForm, principalRole: e.target.value })}
                            className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                            placeholder="e.g. Principal / Founder"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Quote & Bio Fields column span */}
                        <div className="md:col-span-2 space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                              Inspirational Vision Quote
                            </label>
                            <input
                              type="text"
                              value={cmsForm.principalQuote}
                              onChange={(e) => setCmsForm({ ...cmsForm, principalQuote: e.target.value })}
                              className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                              placeholder="e.g. Our Vision Is To Build Character Before Carriers."
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                              Leadership Bio Statement / Description
                            </label>
                            <textarea
                              value={cmsForm.principalBio}
                              onChange={(e) => setCmsForm({ ...cmsForm, principalBio: e.target.value })}
                              rows={4}
                              className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-[20px] p-5 focus:outline-none text-xs font-semibold text-white shadow-inner leading-relaxed text-left"
                              placeholder="Describe the principal's background, standard views, and dedication to school success..."
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                              Bottom Highlight Stat
                            </label>
                            <input
                              type="text"
                              value={cmsForm.principalStat}
                              onChange={(e) => setCmsForm({ ...cmsForm, principalStat: e.target.value })}
                              className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                              placeholder="e.g. Ranked #1 for basic education institutional standards..."
                              required
                            />
                          </div>
                        </div>

                        {/* Principal Portrait file attachment */}
                        <div className="space-y-2 bg-[#091523]/20 p-4 border border-white/5 rounded-2xl">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                            Principal Portrait Image
                          </label>
                          <div className="relative border border-dashed border-white/20 rounded-[24px] p-5 bg-[#091523]/80 hover:bg-[#11243d]/60 transition-all flex flex-col items-center justify-center text-center group h-[290px] overflow-hidden">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCmsImageUpload(e, "principalPhoto")}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            {cmsForm.principalPhoto ? (
                              <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col items-center justify-center">
                                <img
                                  src={cmsForm.principalPhoto}
                                  className="w-full h-full object-cover"
                                  alt="Principal Portrait Preview"
                                />
                                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md py-2.5 px-3 rounded-lg flex items-center justify-center gap-1 text-[9px] font-black text-accent uppercase tracking-widest border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                                  <Camera size={12} /> Replace Photo
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3 z-10 pointer-events-none">
                                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent group-hover:scale-110 transition-transform">
                                  <Camera size={20} />
                                </div>
                                <div>
                                  <span className="block text-xs font-extrabold text-white">Upload New Photo</span>
                                  <span className="block text-[9px] text-white/30 mt-1">Accepts PNG/JPG up to 10MB</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: CAMPUS SHOWCASE */}
                    <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <ImageIcon className="text-accent" size={20} />
                        <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider">3. Campus Gallery Showcase</h3>
                      </div>
                      
                      <p className="text-xs text-white/40 leading-relaxed font-semibold">
                        This section manages the 3 large wide campus environment pictures that look amazing in the Gallery Section of the About and Campus Pages.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { field: "campusPhoto1" as const, label: "Campus Picture 1" },
                          { field: "campusPhoto2" as const, label: "Campus Picture 2" },
                          { field: "campusPhoto3" as const, label: "Campus Picture 3" }
                        ].map((photo) => (
                          <div key={photo.field} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                              {photo.label}
                            </label>
                            <div className="relative border border-dashed border-white/20 rounded-[20px] p-4 bg-[#091523]/80 hover:bg-[#11243d]/60 transition-all flex flex-col items-center justify-center text-center group h-[160px] overflow-hidden">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleCmsImageUpload(e, photo.field)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                              />
                              {cmsForm[photo.field] ? (
                                <div className="absolute inset-0 z-10 bg-slate-900">
                                  <img
                                    src={cmsForm[photo.field]}
                                    className="w-full h-full object-cover"
                                    alt={photo.label}
                                  />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <span className="bg-black/70 border border-white/10 text-accent font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                      <Camera size={11} /> Replace
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2 z-10 pointer-events-none">
                                  <Camera size={18} className="text-white/40 mx-auto" />
                                  <div>
                                    <span className="block text-[11px] font-black text-white/70">Upload Image</span>
                                    <span className="block text-[8px] text-white/30 mt-0.5 font-mono">High resolutions</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 4: HERO & LANDING COVER CONFIG */}
                    <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <ImageIcon className="text-accent" size={20} />
                        <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider">3.5 Hero Section & Wide Cover</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                              Hero Tagline Banner Text
                            </label>
                            <input
                              type="text"
                              value={cmsForm.heroTagline}
                              onChange={(e) => setCmsForm({ ...cmsForm, heroTagline: e.target.value })}
                              className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                              placeholder="e.g. Ekdara's Premier Academic Institution"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                              Hero Subtitle Text
                            </label>
                            <input
                              type="text"
                              value={cmsForm.heroSubheader}
                              onChange={(e) => setCmsForm({ ...cmsForm, heroSubheader: e.target.value })}
                              className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                              placeholder="English Medium Boarding School"
                              required
                            />
                          </div>
                        </div>

                        {/* Hero Photo upload */}
                        <div className="space-y-2 bg-[#091523]/20 p-4 border border-white/5 rounded-2xl">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                            Main Hero Wide Landscape Cover Photo
                          </label>
                          <div className="relative border border-dashed border-white/20 rounded-[20px] p-4 bg-[#091523]/80 hover:bg-[#11243d]/60 transition-all flex flex-col items-center justify-center text-center group h-[120px] overflow-hidden">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCmsImageUpload(e, "heroPhoto")}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            {cmsForm.heroPhoto ? (
                              <div className="absolute inset-0 z-10 bg-slate-900">
                                <img
                                  src={cmsForm.heroPhoto}
                                  className="w-full h-full object-cover"
                                  alt="Hero Showcase Preview"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <span className="bg-black/70 border border-white/10 text-accent font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    <Camera size={11} /> Replace
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 z-10 pointer-events-none">
                                <Camera size={18} className="text-white/40 mx-auto" />
                                <div>
                                  <span className="block text-[11px] font-black text-white/70">Upload Banner Cover (Nursery to Grade 7 style)</span>
                                  <span className="block text-[8px] text-white/30 mt-0.5 font-mono">High resolutions</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                          Hero Main Paragraph Description
                        </label>
                        <textarea
                          value={cmsForm.heroDesc}
                          onChange={(e) => setCmsForm({ ...cmsForm, heroDesc: e.target.value })}
                          rows={3}
                          className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-[20px] p-5 focus:outline-none text-xs font-semibold text-white shadow-inner leading-relaxed text-left"
                          placeholder="Provide deep details about holistic growth, computer labs, english skills..."
                          required
                        />
                      </div>
                    </div>

                    {/* SECTION 5: EDUCATION SPOTLIGHT */}
                    <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <ImageIcon className="text-accent" size={20} />
                        <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider">3.6 Learning Spotlight Panel</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                              Spotlight Tag/Badge Text
                            </label>
                            <input
                              type="text"
                              value={cmsForm.spotlightTag}
                              onChange={(e) => setCmsForm({ ...cmsForm, spotlightTag: e.target.value })}
                              className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                              placeholder="e.g. Learning Spotlight"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                              Spotlight Main Header Title
                            </label>
                            <input
                              type="text"
                              value={cmsForm.spotlightTitle}
                              onChange={(e) => setCmsForm({ ...cmsForm, spotlightTitle: e.target.value })}
                              className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                              placeholder="e.g. Empowering with Modern Technology Integration"
                              required
                            />
                          </div>
                        </div>

                        {/* Spotlight photo upload */}
                        <div className="space-y-2 bg-[#091523]/20 p-4 border border-white/5 rounded-2xl">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                            Spotlight Side Card Image
                          </label>
                          <div className="relative border border-dashed border-white/20 rounded-[20px] p-4 bg-[#091523]/80 hover:bg-[#11243d]/60 transition-all flex flex-col items-center justify-center text-center group h-[120px] overflow-hidden">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCmsImageUpload(e, "spotlightPhoto")}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            {cmsForm.spotlightPhoto ? (
                              <div className="absolute inset-0 z-10 bg-slate-900">
                                <img
                                  src={cmsForm.spotlightPhoto}
                                  className="w-full h-full object-cover"
                                  alt="Spotlight Preview"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <span className="bg-black/70 border border-white/10 text-accent font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    <Camera size={11} /> Replace
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 z-10 pointer-events-none">
                                <Camera size={18} className="text-white/40 mx-auto" />
                                <div>
                                  <span className="block text-[11px] font-black text-white/70">Upload Spotlight Graphic Photo</span>
                                  <span className="block text-[8px] text-white/30 mt-0.5 font-mono">Modern computer lab or student groups</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5.5: ADMISSIONS WIDGET LANDING BACKGROUND */}
                    <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <ImageIcon className="text-accent" size={20} />
                        <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider">3.7 Admissions Portal Banner Backdrop</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-3">
                          <p className="text-xs text-white/60 leading-relaxed font-semibold">
                            Customize the dynamic dark overlay picture shown behind the "Inquire Online" / Admissions Support form. By default, it takes a beautiful blurred students picture but you can overwrite it with your own local campus events.
                          </p>
                        </div>

                        {/* admissions backdrop upload */}
                        <div className="space-y-2 bg-[#091523]/20 p-4 border border-white/5 rounded-2xl">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#ffb703]/80 block ml-1 font-mono">
                            Admissions Cover backdrop
                          </label>
                          <div className="relative border border-dashed border-[#ffb703]/30 rounded-[20px] p-4 bg-[#091523]/80 hover:bg-[#11243d]/60 transition-all flex flex-col items-center justify-center text-center group h-[110px] overflow-hidden">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCmsImageUpload(e, "admissionsBgPhoto")}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            {cmsForm.admissionsBgPhoto ? (
                              <div className="absolute inset-0 z-10 bg-slate-900">
                                <img
                                  src={cmsForm.admissionsBgPhoto}
                                  className="w-full h-full object-cover"
                                  alt="Admissions Cover Preview"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <span className="bg-black/70 border border-[#ffb703]/20 text-accent font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    <Camera size={11} /> Replace cover
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 z-10 pointer-events-none">
                                <Camera size={14} className="text-accent/60 mx-auto animate-pulse" />
                                <div>
                                  <span className="block text-[10px] font-black text-[#ffb703]/80">Upload custom support cover</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5.8: CAMPUS CONTACTS & INTEGRATIONS */}
                    <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Phone className="text-accent" size={20} />
                        <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider">3.8 School Contact Info & Call Centers</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                            Official Contact Phone Number(s)
                          </label>
                          <input
                            type="text"
                            value={cmsForm.schoolPhone}
                            onChange={(e) => setCmsForm({ ...cmsForm, schoolPhone: e.target.value })}
                            className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                            placeholder="e.g. 9801671714 / 9817681582"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                            Admissions Support Email
                          </label>
                          <input
                            type="email"
                            value={cmsForm.schoolEmail}
                            onChange={(e) => setCmsForm({ ...cmsForm, schoolEmail: e.target.value })}
                            className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                            placeholder="admissions@NCEMBS.edu.np"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                            Physical Geographical Address
                          </label>
                          <input
                            type="text"
                            value={cmsForm.schoolAddress}
                            onChange={(e) => setCmsForm({ ...cmsForm, schoolAddress: e.target.value })}
                            className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                            placeholder="Baheda, Ekdara-6, Mahottari, Madhesh Nepal"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/55 block ml-1 font-mono">
                            Google Maps Embed link / Location URL
                          </label>
                          <input
                            type="text"
                            value={cmsForm.schoolGoogleMaps}
                            onChange={(e) => setCmsForm({ ...cmsForm, schoolGoogleMaps: e.target.value })}
                            className="w-full bg-[#11243d] border border-white/10 focus:border-accent ring-0 rounded-2xl px-5 py-4 focus:outline-none text-xs font-bold text-white shadow-inner"
                            placeholder="Embed location map iframe link..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* SAVE BUTTON FOR FIELDS */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={cmsStatus.saving}
                        className="bg-accent text-[#0c233f] hover:bg-white hover:text-[#030c17] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg disabled:opacity-45 transition-all flex items-center gap-3 cursor-pointer"
                      >
                        {cmsStatus.saving ? (
                          <RefreshCw className="animate-spin" size={14} />
                        ) : (
                          <Save size={14} />
                        )}
                        Publish Website Changes
                      </button>
                    </div>
                  </form>

                  {/* SECTION 4: FACULTY & TEACHING STAFF MANAGER */}
                  <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
                      <div className="flex items-center gap-3">
                        <Award className="text-accent" size={20} />
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider">4. School Faculty Registry</h3>
                          <p className="text-[10px] text-white/40 font-bold uppercase mt-0.5">Add, Edit or remove academic faculty dynamically</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFaculty(null);
                          setFacultyForm({ name: "", role: "", qual: "", desc: "", img: "" });
                          setIsFacultyModalOpen(true);
                        }}
                        className="bg-accent text-[#0c233f] hover:bg-white hover:text-black transition-all px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <Plus size={14} /> Enroll New Teacher
                      </button>
                    </div>

                    {/* Faculty list rendering card */}
                    {cmsFaculty.length === 0 ? (
                      <div className="text-center py-12 border border-white/5 border-dashed rounded-2xl bg-black/20">
                        <User className="text-white/20 mx-auto mb-3" size={32} />
                        <h4 className="text-sm font-black text-white/60">No Faculty Registered</h4>
                        <p className="text-[11px] text-white/30 mt-1">Enroll your standard coordinator and subject leads to build the website list.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cmsFaculty.map((member) => (
                          <div 
                            key={member.id} 
                            className="bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden group flex flex-col justify-between transition-all"
                          >
                            <div className="p-5 space-y-4">
                              <div className="flex items-center gap-4 border-b border-white/5 pb-3">
                                {member.img ? (
                                  <img 
                                    src={member.img} 
                                    className="w-12 h-12 object-cover rounded-xl border border-white/10 flex-shrink-0"
                                    alt={member.name}
                                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=150&auto=format"; }}
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center flex-shrink-0 text-white/40">
                                    <User size={18} />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h4 className="text-xs font-black text-white truncate">{member.name}</h4>
                                  <p className="text-[10px] font-extrabold text-[#7c3aed] truncate uppercase mt-0.5">{member.role}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-1.5">
                                <span className="inline-block bg-[#ffb703]/10 text-accent border border-[#ffb703]/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider font-mono">
                                  {member.qual}
                                </span>
                                <p className="text-[10px] text-white/50 leading-relaxed font-semibold line-clamp-3">
                                  {member.desc}
                                </p>
                              </div>
                            </div>

                            <div className="bg-[#030c17]/60 border-t border-white/5 px-4 py-3 flex justify-end gap-2.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingFaculty(member);
                                  setFacultyForm({
                                    name: member.name,
                                    role: member.role,
                                    qual: member.qual,
                                    desc: member.desc,
                                    img: member.img
                                  });
                                  setIsFacultyModalOpen(true);
                                }}
                                className="text-accent/80 hover:text-white bg-accent/5 hover:bg-accent/15 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Edit size={10} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFaculty(member.id, member.name)}
                                className="text-red-400 hover:text-white bg-red-950/20 hover:bg-red-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={10} /> Dismiss
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 5: CURRICULUM PROGRAMS & COURSE LIST */}
                  <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
                      <div className="flex items-center gap-3">
                        <BookOpen className="text-accent" size={20} />
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider font-sans">5. Academic Curriculum Courses</h3>
                          <p className="text-[10px] text-white/40 font-bold uppercase mt-0.5">Customize programs, primary goals, highlights, and images</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCourse(null);
                          setCourseForm({ name: "", img: "", desc: "", focus: "" });
                          setIsCourseModalOpen(true);
                        }}
                        className="bg-accent text-[#0c233f] hover:bg-white hover:text-black transition-all px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <Plus size={14} /> Add Curriculum Program
                      </button>
                    </div>

                    {cmsCoursePrograms.length === 0 ? (
                      <div className="text-center py-12 border border-white/5 border-dashed rounded-2xl bg-black/20">
                        <BookOpen className="text-white/20 mx-auto mb-3" size={32} />
                        <h4 className="text-sm font-black text-white/60">No Academic Programs Saved</h4>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cmsCoursePrograms.map((course) => (
                          <div 
                            key={course.id} 
                            className="bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden group flex flex-col justify-between transition-all"
                          >
                            <div className="p-5 space-y-4">
                              <div className="flex items-center gap-4 border-b border-white/5 pb-3">
                                {course.img ? (
                                  <img 
                                    src={course.img} 
                                    className="w-12 h-12 object-cover rounded-xl border border-white/10 flex-shrink-0"
                                    alt={course.name}
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center flex-shrink-0 text-white/40 font-black text-xs font-mono">
                                    NC
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h4 className="text-xs font-black text-white truncate">{course.name}</h4>
                                  <p className="text-[9px] font-bold text-accent truncate uppercase mt-0.5">{course.focus?.split(',').length || 0} Special Highlights</p>
                                </div>
                              </div>
                              
                              <p className="text-[10px] text-white/55 leading-relaxed font-semibold line-clamp-3">
                                {course.desc}
                              </p>

                              {course.focus && (
                                <div className="flex flex-wrap gap-1">
                                  {course.focus.split(',').slice(0, 3).map((item, i) => (
                                    <span key={i} className="text-[8px] bg-white/5 text-white/70 px-1.5 py-0.5 rounded font-mono truncate max-w-[80px]">
                                      {item.trim()}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="bg-[#030c17]/60 border-t border-white/5 px-4 py-3 flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCourse(course);
                                  setCourseForm({
                                    name: course.name,
                                    img: course.img,
                                    desc: course.desc,
                                    focus: course.focus
                                  });
                                  setIsCourseModalOpen(true);
                                }}
                                className="text-accent hover:text-white bg-accent/5 hover:bg-accent/15 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Edit size={10} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCourse(course.id, course.name)}
                                className="text-red-400 hover:text-white bg-red-950/20 hover:bg-red-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={10} /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 6: OUTREACH & FIELD TEAM REPRESENTATIVES */}
                  <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
                      <div className="flex items-center gap-3">
                        <User className="text-accent" size={20} />
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider font-sans">6. Local Administrative & Community Leads</h3>
                          <p className="text-[10px] text-white/40 font-bold uppercase mt-0.5">Manage local contacts and supportive desk team bios</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingOutreach(null);
                          setOutreachForm({ name: "", role: "", phone: "", img: "" });
                          setIsOutreachModalOpen(true);
                        }}
                        className="bg-accent text-[#0c233f] hover:bg-white hover:text-black transition-all px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <Plus size={14} /> Add Community Lead
                      </button>
                    </div>

                    {cmsOutreachTeam.length === 0 ? (
                      <div className="text-center py-12 border border-white/5 border-dashed rounded-2xl bg-black/20">
                        <User className="text-white/20 mx-auto mb-3" size={32} />
                        <h4 className="text-sm font-black text-white/60">No Community Representatives</h4>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cmsOutreachTeam.map((member) => (
                          <div 
                            key={member.id} 
                            className="bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden group flex flex-col justify-between transition-all"
                          >
                            <div className="p-5 space-y-3">
                              <div className="flex items-center gap-4 border-b border-white/5 pb-3">
                                {member.img ? (
                                  <img 
                                    src={member.img} 
                                    className="w-12 h-12 object-cover rounded-xl border border-white/10 flex-shrink-0"
                                    alt={member.name}
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center flex-shrink-0 text-white/40">
                                    <User size={18} />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h4 className="text-xs font-black text-white truncate">{member.name}</h4>
                                  <p className="text-[9px] font-bold text-accent truncate uppercase mt-0.5">{member.role}</p>
                                </div>
                              </div>
                              <p className="text-[10px] text-white/65 font-bold font-mono border-t border-white/5 pt-2">
                                Phone: {member.phone}
                              </p>
                            </div>

                            <div className="bg-[#030c17]/60 border-t border-white/5 px-4 py-3 flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingOutreach(member);
                                  setOutreachForm({
                                    name: member.name,
                                    role: member.role,
                                    phone: member.phone,
                                    img: member.img
                                  });
                                  setIsOutreachModalOpen(true);
                                }}
                                className="text-accent hover:text-white bg-accent/5 hover:bg-accent/15 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Edit size={10} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOutreach(member.id, member.name)}
                                className="text-red-400 hover:text-white bg-red-950/20 hover:bg-red-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={10} /> Dismiss
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 7: INTERACTIVE PUBLIC GALLERY ARCHIVE */}
                  <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="text-accent" size={20} />
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider font-sans">7. School Photo Gallery Library</h3>
                          <p className="text-[10px] text-white/40 font-bold uppercase mt-0.5">Upload photos from sports days, computer class, and campus celebrations</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGallery(null);
                          setGalleryForm({ title: "", category: "", url: "", desc: "" });
                          setIsGalleryModalOpen(true);
                        }}
                        className="bg-accent text-[#0c233f] hover:bg-white hover:text-black transition-all px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <Plus size={14} /> Upload To Gallery
                      </button>
                    </div>

                    {cmsGalleryPhotos.length === 0 ? (
                      <div className="text-center py-12 border border-white/5 border-dashed rounded-2xl bg-black/20">
                        <Camera className="text-white/20 mx-auto mb-3" size={32} />
                        <h4 className="text-sm font-black text-white/60">No Gallery Photos Active</h4>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {cmsGalleryPhotos.map((photo) => (
                          <div 
                            key={photo.id} 
                            className="bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden group flex flex-col justify-between transition-all relative h-[180px]"
                          >
                            <img 
                              src={photo.url} 
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              alt={photo.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-3 opacity-90 h-full">
                              <span className="text-[8px] uppercase tracking-widest text-[#ffb703] font-black block font-mono">
                                {photo.category}
                              </span>
                              <h4 className="text-[10px] font-black text-white truncate my-0.5">
                                {photo.title || 'Untitled Celebration'}
                              </h4>
                              
                              <div className="flex gap-2.5 mt-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingGallery(photo);
                                    setGalleryForm({
                                      title: photo.title || "",
                                      category: photo.category || "",
                                      url: photo.url,
                                      desc: photo.desc || ""
                                    });
                                    setIsGalleryModalOpen(true);
                                  }}
                                  className="text-accent bg-black/80 px-2 py-1 rounded text-[8px] font-black font-mono hover:bg-white hover:text-black transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGallery(photo.id, photo.title || "Untitled")}
                                  className="text-red-400 bg-black/80 px-2 py-1 rounded text-[8px] font-black font-mono hover:bg-red-600 hover:text-white transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 8: HOMEPAGE ACADEMIC CORE / PILLARS */}
                  <div className="bg-[#0c233f]/40 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
                      <div className="flex items-center gap-3">
                        <Sparkles className="text-accent" size={20} />
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white uppercase text-[12px] md:text-[13px] tracking-wider font-sans animate-pulse">8. Homepage Curriculum Pillars</h3>
                          <p className="text-[10px] text-white/40 font-bold uppercase mt-0.5">Customize the cards like Holistic Environment, Tech-Infused Learning etc. on the homepage</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFeature(null);
                          setFeatureForm({ title: "", desc: "", img: "", localName: "" });
                          setIsFeatureModalOpen(true);
                        }}
                        className="bg-accent text-[#0c233f] hover:bg-white hover:text-black transition-all px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <Plus size={14} /> Add Curriculum Pillar
                      </button>
                    </div>

                    {cmsFeatures.length === 0 && (
                      <div className="bg-[#ffb703]/10 border border-[#ffb703]/25 rounded-2xl p-4 mb-2 flex items-start gap-3">
                        <AlertCircle className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                        <div>
                          <h4 className="text-xs font-black text-[#ffb703] uppercase tracking-wide">Using Default System Features</h4>
                          <p className="text-[11px] text-white/70 font-semibold mt-0.5">
                            Showing the 6 default factory curriculum pillars (Holistic Environment, Moral Integrity, Sports etc). 
                            Editing any card below will automatically convert it into a customizable website pill in your live database!
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(cmsFeatures.length > 0 ? cmsFeatures : defaultFeaturesList).map((feat, i) => {
                        const isDefault = cmsFeatures.length === 0;
                        const imgSrc = getImgSrc(feat);
                        return (
                          <div 
                            key={feat.id || i}
                            className="bg-[#030d1a]/85 border border-white/10 hover:border-accent/40 rounded-[28px] overflow-hidden group flex flex-col justify-between transition-all shadow-xl hover:shadow-[#ffb703]/5 relative"
                          >
                            <div className="p-5 space-y-4">
                              <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/60 relative border border-white/5 group-hover:border-accent/30 transition-colors">
                                <img 
                                  src={imgSrc} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  alt={feat.title} 
                                  onError={(e) => {
                                    // Fallback to placeholder if visual fails for base64 or corrupt values
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071";
                                  }}
                                />
                                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 animate-pulse">
                                  {isDefault ? (
                                    <span className="bg-amber-500/90 text-black font-black text-[9px] uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-md">
                                      Default Pillar
                                    </span>
                                  ) : (
                                    <span className="bg-[#22c55e]/95 text-white font-black text-[9px] uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-md">
                                      Customized Live
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-1.5">
                                <span className="text-[9px] text-[#ffb703] uppercase tracking-widest font-black block font-mono">Academic Core</span>
                                <h4 className="text-white font-black text-base tracking-tight">{feat.title}</h4>
                                <p className="text-white/60 text-xs font-semibold leading-relaxed line-clamp-3 min-h-[50px]">{feat.desc}</p>
                              </div>
                            </div>

                            <div className="p-4 border-t border-white/5 bg-black/30 flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingFeature(feat);
                                  setFeatureForm({
                                    title: feat.title || "",
                                    desc: feat.desc || "",
                                    img: feat.img || "",
                                    localName: feat.localName || ""
                                  });
                                  setIsFeatureModalOpen(true);
                                }}
                                className="flex-1 bg-white/5 text-white hover:bg-accent hover:text-[#0c233f] text-[10px] uppercase font-black tracking-wider py-3 rounded-2xl font-mono transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Edit size={12} /> {isDefault ? "Customize Core" : "Edit Pillar"}
                              </button>
                              
                              {!isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFeature(feat.id, feat.title || "Untitled")}
                                  className="px-3 bg-red-950/20 text-red-400 hover:bg-red-600 hover:text-white text-[10px] uppercase font-black tracking-wider py-3 rounded-2xl font-mono transition-all text-center cursor-pointer"
                                  title="Delete custom feature"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* LIVE INTERACTIVE DEMO CONTAINER/PREVIEW */}
                    <div className="bg-[#101e30] border border-white/5 rounded-[28px] p-5 mt-6 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Eye className="text-accent" size={16} />
                          <h4 className="text-xs font-black uppercase text-white tracking-widest">Active Homepage Preview (Live Render Simulator)</h4>
                        </div>
                        <span className="bg-[#ffb703]/10 border border-[#ffb703]/25 text-[#ffb703] text-[9px] font-mono px-2.5 py-0.5 rounded-full font-black animate-pulse uppercase tracking-wider">
                          Simulation Viewport
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-white/55 leading-relaxed max-w-2xl font-medium">
                        This simulator renders the exact aesthetic layout of the school homepage curriculum section, displaying customized base64 photo feeds and detail summaries dynamically.
                      </p>

                      <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#020811] p-6 max-h-[440px] overflow-y-auto custom-scrollbar">
                        <div className="max-w-5xl mx-auto space-y-8">
                          
                          <div className="text-center space-y-2">
                            <span className="bg-[#ffb703]/5 border border-[#ffb703]/15 text-[#ffb703] uppercase tracking-[0.25em] text-[8px] px-3 py-1 rounded-full font-black font-sans leading-none inline-block">
                              Curriculum Pillars
                            </span>
                            <h3 className="text-lg md:text-xl font-black text-white italic tracking-tight">
                              Shaping Minds, Building Character
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {(cmsFeatures.length > 0 ? cmsFeatures : defaultFeaturesList).map((item, i) => (
                              <div 
                                key={item.id || i}
                                className="group relative h-[280px] rounded-[24px] overflow-hidden shadow-lg border border-white/10 flex flex-col justify-end bg-[#0c1424] text-left"
                              >
                                <img 
                                  src={getImgSrc(item)} 
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" 
                                  alt={item.title} 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071";
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>

                                <div className="relative p-4 text-left w-full mt-auto">
                                  <span className="inline-block bg-accent text-[#0c233f] px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] mb-2 shadow-sm font-sans">
                                      Academic Core
                                  </span>
                                  <h4 className="text-sm font-black text-white truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-tight">
                                     {item.title}
                                  </h4>
                                  <p className="text-white/80 text-[10px] leading-relaxed line-clamp-2 mt-1 font-semibold drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.5)]">
                                     {item.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    {/* SECTION 9: HOMEPAGE DAILY TIMELINE / JOURNEY (MORNING ASSEMBLY, HEALTHY LUNCH BREAK etc) */}
                    <div className="bg-[#0b1727]/90 border border-white/5 rounded-[40px] p-6 lg:p-10 space-y-6 md:space-y-8 mt-12 relative overflow-hidden">
                      {/* background decorative element */}
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 border-b border-white/5 pb-6">
                        <div>
                          <div className="flex items-center gap-2 text-[#ffb703] text-xs font-black uppercase tracking-widest font-mono mb-2">
                            <Clock size={14} className="stroke-[2.5]" /> Interactive Section Manager
                          </div>
                          <h3 className="text-xl md:text-3xl font-black text-white italic tracking-tight">
                            Section 9: Daily Activity Journey Timeline
                          </h3>
                          <p className="text-[11px] md:text-xs text-white/50 font-semibold tracking-wide mt-1 font-sans">
                            Customize the step-by-step visual schedule of the school day (e.g. Morning Assembly, Healthy Lunch Break etc) shown dynamically on the school website homepage!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTimeline(null);
                            setTimelineForm({ time: "", event: "", img: "", localName: "" });
                            setIsTimelineModalOpen(true);
                          }}
                          className="bg-[#ffb703] text-[#0c233f] hover:bg-white hover:text-primary px-6 py-3.5 rounded-2xl font-mono text-[10px] uppercase font-black tracking-wider transition-all shadow-lg shadow-accent/15 cursor-pointer flex items-center gap-2 shrink-0 self-end sm:self-auto"
                        >
                          <PlusCircle size={14} className="stroke-[2.5]" /> Add Journey Event
                        </button>
                      </div>

                      {cmsTimelineEvents.length === 0 && (
                        <div className="bg-[#ffb703]/10 border border-[#ffb703]/25 rounded-2xl p-4 flex items-start gap-3 relative z-10">
                          <AlertCircle className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                          <div>
                            <h4 className="text-xs font-black text-[#ffb703] uppercase tracking-wide">Using Default System Events</h4>
                            <p className="text-[11px] text-white/70 font-semibold mt-0.5 font-sans">
                              Currently displaying the 4 standard daily activities (Morning Assembly, Smart Class Labs, Healthy Lunch Break, etc.).
                              Editing any event below will automatically migrate it into your live custom school database!
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {(cmsTimelineEvents.length > 0 ? cmsTimelineEvents : defaultTimelineEventsList).map((evt, i) => {
                          const isDefault = cmsTimelineEvents.length === 0;
                          const imgSrc = getTimelineImgSrc(evt);
                          return (
                            <div 
                              key={evt.id || i}
                              className="bg-[#030d1a]/85 border border-white/10 hover:border-accent/40 rounded-[28px] overflow-hidden group flex flex-col justify-between transition-all shadow-xl hover:shadow-[#ffb703]/5 relative"
                            >
                              <div className="p-5 space-y-4">
                                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black/60 relative border border-white/5 group-hover:border-accent/30 transition-colors">
                                  <img 
                                    src={imgSrc} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    alt={evt.event} 
                                    onError={(e) => {
                                      // Fallback Unsplash image
                                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022";
                                    }}
                                  />
                                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 animate-pulse">
                                    {isDefault ? (
                                      <span className="bg-amber-500/90 text-black font-black text-[9px] uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-md">
                                        Default Day
                                      </span>
                                    ) : (
                                      <span className="bg-[#22c55e]/95 text-white font-black text-[9px] uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-md">
                                        Custom Live
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-1.5 pt-1">
                                  <span className="inline-block bg-[#ffb703]/10 border border-[#ffb703]/25 text-[#ffb703] px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest font-mono">
                                    {evt.time}
                                  </span>
                                  <h4 className="text-white font-black text-sm tracking-tight pt-1">{evt.event}</h4>
                                </div>
                              </div>

                              <div className="p-4 border-t border-white/5 bg-black/30 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTimeline(evt);
                                    setTimelineForm({
                                      time: evt.time || "",
                                      event: evt.event || "",
                                      img: evt.img || "",
                                      localName: evt.localName || ""
                                    });
                                    setIsTimelineModalOpen(true);
                                  }}
                                  className="flex-1 bg-white/5 text-white hover:bg-accent hover:text-[#0c233f] text-[10px] uppercase font-black tracking-wider py-3 rounded-2xl font-mono transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <Edit size={12} /> {isDefault ? "Customize" : "Edit Event"}
                                </button>
                                
                                {!isDefault && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTimelineEvent(evt.id, evt.event || "Untitled")}
                                    className="px-3 bg-red-950/20 text-red-400 hover:bg-red-600 hover:text-white text-[10px] uppercase font-black tracking-wider py-3 rounded-2xl font-mono transition-all text-center cursor-pointer"
                                    title="Delete custom event"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* LIVE INTERACTIVE DEMO CONTAINER/PREVIEW FOR TIMELINE */}
                      <div className="bg-[#101e30] border border-white/5 rounded-[28px] p-5 mt-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                            <Eye className="text-[#ffb703]" size={16} />
                            <h4 className="text-xs font-black uppercase text-white tracking-widest">Active Activity Timeline Preview (Public UI Simulation)</h4>
                          </div>
                          <span className="bg-[#ffb703]/10 border border-[#ffb703]/25 text-[#ffb703] text-[9px] font-mono px-2.5 py-0.5 rounded-full font-black animate-pulse uppercase tracking-wider">
                            Live Home Viewport
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-white/55 leading-relaxed max-w-2xl font-medium font-sans">
                          This simulator reproduces the live layout of the school daily timeline on the homepage, testing base64 photo dimensions and exact schedule alignments instantaneously.
                        </p>

                        <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0d233f]/20 p-6 max-h-[440px] overflow-y-auto custom-scrollbar text-center">
                          <div className="max-w-6xl mx-auto space-y-8 py-4">
                            
                            <div className="text-center space-y-2">
                              <span className="bg-[#ffb703]/5 border border-[#ffb703]/15 text-[#ffb703] uppercase tracking-[0.25em] text-[8px] px-3 py-1 rounded-full font-black font-sans leading-none inline-block">
                                Life at NCEMBS
                              </span>
                              <h3 className="text-lg md:text-xl font-black text-white italic tracking-tight font-sans">
                                Experience The Daily Journey
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                              {(cmsTimelineEvents.length > 0 ? cmsTimelineEvents : defaultTimelineEventsList).map((node, i) => (
                                <div key={i} className="group bg-[#041124] backdrop-blur-md rounded-[30px] overflow-hidden border border-white/10 hover:border-[#ffb703]/40 hover:bg-[#0d2c54]/70 transition-all duration-500 shadow-premium flex flex-col text-left">
                                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-800 shrink-0">
                                    <img 
                                      src={getTimelineImgSrc(node)} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[0.8s]" 
                                      alt={node.event} 
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022";
                                      }}
                                    />
                                  </div>
                                  <div className="p-4 flex flex-col text-left">
                                    <span className="inline-block self-start bg-[#ffb703]/10 border border-[#ffb703]/30 text-[#ffb703] px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest mb-2 shadow-sm font-sans">
                                      {node.time}
                                    </span>
                                    <h5 className="text-white group-hover:text-accent transition-colors font-black text-xs tracking-tight leading-tight">{node.event}</h5>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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

                <div className="space-y-4">
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

                <div className="space-y-2 border-t pt-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 block ml-2">
                    Notice Attachment (Optional Image or PDF - Max 20MB)
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-light-bg p-4 rounded-[20px] border border-black/5">
                    <label className="flex-shrink-0 cursor-pointer bg-primary text-white hover:bg-black transition-colors px-5 py-3 rounded-xl font-bold text-xs tracking-wider text-center">
                      Choose Attachment File
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleNoticeFileUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2 text-xs text-primary/60 font-semibold bg-white px-4 py-3 rounded-xl border">
                      {noticeForm.attachmentName ? (
                        <div className="flex items-center gap-2 truncate">
                          <span className="truncate text-primary font-black">{noticeForm.attachmentName}</span>
                          {noticeForm.attachmentUrl && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold flex-shrink-0">Saved</span>
                          )}
                          {noticeForm.attachmentBase64 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold flex-shrink-0">New</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-primary/30 italic">No file selected (Optional)</span>
                      )}
                      {(noticeForm.attachmentName || noticeForm.attachmentUrl) && (
                        <button
                          type="button"
                          onClick={handleClearNoticeAttachment}
                          className="text-red-500 hover:text-red-700 text-xs font-bold whitespace-nowrap"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
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

      {/* MODAL WINDOW FOR ADDING/EDITING FACULTY MEMBERS */}
      <AnimatePresence>
        {isFacultyModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsFacultyModalOpen(false);
                setEditingFaculty(null);
                setFacultyForm({ name: "", role: "", qual: "", desc: "", img: "" });
              }}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-[110] rounded-[32px] md:rounded-[40px] shadow-3xl border border-black/5"
            >
              <form onSubmit={handleAddOrEditFaculty} className="p-6 md:p-10 space-y-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-primary italic tracking-tight">
                      {editingFaculty ? "Edit Faculty Member" : "Enroll New Faculty Member"}
                    </h3>
                    <p className="text-[10px] uppercase font-black text-primary/40 tracking-widest mt-1">
                      Provide teacher roles, qualifications and bio profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFacultyModalOpen(false);
                      setEditingFaculty(null);
                      setFacultyForm({ name: "", role: "", qual: "", desc: "", img: "" });
                    }}
                    className="p-2.5 bg-[#f1f5f9] rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Teacher Full Name
                    </label>
                    <input
                      type="text"
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold shadow-inner text-primary"
                      placeholder="e.g. Shyam Sundar Lal"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Academic Designation / Subject Name
                    </label>
                    <input
                      type="text"
                      value={facultyForm.role}
                      onChange={(e) => setFacultyForm({ ...facultyForm, role: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold shadow-inner text-primary"
                      placeholder="e.g. Senior Head of Mathematics"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Formal Qualifications
                    </label>
                    <input
                      type="text"
                      value={facultyForm.qual}
                      onChange={(e) => setFacultyForm({ ...facultyForm, qual: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold shadow-inner text-primary"
                      placeholder="e.g. M.Sc. Math in child logic, B.Ed"
                      required
                    />
                  </div>

                  {/* Faculty Member Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Profile Picture
                    </label>
                    <div className="relative border border-dashed border-[#cbcbcb] rounded-2xl p-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-all flex items-center justify-between cursor-pointer text-left h-[50px] overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCmsImageUpload(e, "facultyPhoto")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center gap-3">
                        {facultyForm.img ? (
                          <img 
                            src={facultyForm.img} 
                            className="w-8 h-8 object-cover rounded-lg border border-primary/10" 
                            alt="Preview" 
                          />
                        ) : (
                          <Camera className="text-[#0c233f]/50" size={16} />
                        )}
                        <span className="text-xs font-extrabold text-[#0c233f]/70 truncate max-w-[150px]">
                          {facultyForm.img ? "Photo Uploaded" : "Upload Picture"}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#0c233f]/40">JPEG/PNG, max 10MB</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                    Detailed Professional Biography
                  </label>
                  <textarea
                    value={facultyForm.desc}
                    onChange={(e) => setFacultyForm({ ...facultyForm, desc: e.target.value })}
                    rows={4}
                    className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-[20px] p-5 focus:outline-none text-xs font-bold shadow-inner text-primary leading-relaxed text-left"
                    placeholder="Enter academic records, dynamic teaching values, and parent support descriptors..."
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFacultyModalOpen(false);
                      setEditingFaculty(null);
                      setFacultyForm({ name: "", role: "", qual: "", desc: "", img: "" });
                    }}
                    className="bg-[#f1f5f9] text-[#0c233f] px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#e2e8f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#0c233f]"
                  >
                    {editingFaculty ? "Enforce Revise Changes" : "Save / Register Faculty"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL WINDOW FOR ADDING/EDITING CURRICULUM COURSES */}
      <AnimatePresence>
        {isCourseModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCourseModalOpen(false);
                setEditingCourse(null);
                setCourseForm({ name: "", img: "", desc: "", focus: "" });
              }}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-[110] rounded-[32px] md:rounded-[40px] shadow-3xl border border-black/5"
            >
              <form onSubmit={handleAddOrEditCourse} className="p-6 md:p-10 space-y-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-primary italic tracking-tight">
                      {editingCourse ? "Edit Curriculum Session" : "Add Academic Level/Course"}
                    </h3>
                    <p className="text-[10px] uppercase font-black text-primary/40 tracking-widest mt-1">
                      Set course requirements, highlights, and promotional photos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCourseModalOpen(false);
                      setEditingCourse(null);
                      setCourseForm({ name: "", img: "", desc: "", focus: "" });
                    }}
                    className="p-2.5 bg-[#f1f5f9] rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Class Level / Program Name
                    </label>
                    <input
                      type="text"
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold shadow-inner text-primary"
                      placeholder="e.g. Primary Wings (Nursery to Grade 5)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Highlights / Key focus (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={courseForm.focus}
                      onChange={(e) => setCourseForm({ ...courseForm, focus: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold shadow-inner text-primary"
                      placeholder="e.g. Smart Classes, Computer Practice, Hindi Speaking"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Class Showcase Graphic Cover
                    </label>
                    <div className="relative border border-dashed border-[#cbcbcb] rounded-2xl p-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-all flex items-center justify-between cursor-pointer text-left h-[50px] overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCmsImageUpload(e, "coursePhoto")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center gap-3">
                        {courseForm.img ? (
                          <img 
                            src={courseForm.img} 
                            className="w-8 h-8 object-cover rounded-lg border border-primary/10" 
                            alt="Course Cover Preview" 
                          />
                        ) : (
                          <Camera className="text-[#0c233f]/50" size={16} />
                        )}
                        <span className="text-xs font-extrabold text-[#0c233f]/70 truncate max-w-[150px]">
                          {courseForm.img ? "Photo Uploaded" : "Upload Picture"}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#0c233f]/40">JPEG/PNG, max 10MB</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                    Brief Course Program Description
                  </label>
                  <textarea
                    value={courseForm.desc}
                    onChange={(e) => setCourseForm({ ...courseForm, desc: e.target.value })}
                    rows={4}
                    className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-[20px] p-5 focus:outline-none text-xs font-bold shadow-inner text-primary leading-relaxed text-left"
                    placeholder="Describe specific study items, class focus, holistic growth standards..."
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCourseModalOpen(false);
                      setEditingCourse(null);
                      setCourseForm({ name: "", img: "", desc: "", focus: "" });
                    }}
                    className="bg-[#f1f5f9] text-[#0c233f] px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#e2e8f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#0c233f]"
                  >
                    {editingCourse ? "Save Program Changes" : "Create Curriculum level"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL WINDOW FOR ADDING/EDITING OUTREACH ROSTERS */}
      <AnimatePresence>
        {isOutreachModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOutreachModalOpen(false);
                setEditingOutreach(null);
                setOutreachForm({ name: "", role: "", phone: "", img: "" });
              }}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl bg-white z-[110] rounded-[32px] shadow-3xl border border-black/5"
            >
              <form onSubmit={handleAddOrEditOutreach} className="p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-black text-primary italic tracking-tight">
                      {editingOutreach ? "Modify Community Lead" : "Enroll Outreach Lead"}
                    </h3>
                    <p className="text-[10px] uppercase font-black text-primary/40 tracking-widest mt-1">
                      Configure secondary helpline and administrative representatives
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOutreachModalOpen(false);
                      setEditingOutreach(null);
                      setOutreachForm({ name: "", role: "", phone: "", img: "" });
                    }}
                    className="p-2.5 bg-[#f1f5f9] rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Lead Full Name
                    </label>
                    <input
                      type="text"
                      value={outreachForm.name}
                      onChange={(e) => setOutreachForm({ ...outreachForm, name: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold text-primary shadow-inner"
                      placeholder="e.g. Kaushal Giri"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Official Role/Designation Title
                    </label>
                    <input
                      type="text"
                      value={outreachForm.role}
                      onChange={(e) => setOutreachForm({ ...outreachForm, role: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold text-primary shadow-inner"
                      placeholder="e.g. Administrative Officer / Desk Incharge"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Official Contact Phone
                    </label>
                    <input
                      type="text"
                      value={outreachForm.phone}
                      onChange={(e) => setOutreachForm({ ...outreachForm, phone: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold text-primary shadow-inner"
                      placeholder="e.g. 9817681582"
                      required
                    />
                  </div>

                  {/* Representative photo upload */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Portrait Visual Picture
                    </label>
                    <div className="relative border border-dashed border-[#cbcbcb] rounded-2xl p-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-all flex items-center justify-between cursor-pointer text-left h-[50px] overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCmsImageUpload(e, "outreachPhoto")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center gap-3">
                        {outreachForm.img ? (
                          <img 
                            src={outreachForm.img} 
                            className="w-8 h-8 object-cover rounded-lg border border-primary/10" 
                            alt="Outreach Lead Preview" 
                          />
                        ) : (
                          <Camera className="text-[#0c233f]/50" size={16} />
                        )}
                        <span className="text-xs font-extrabold text-[#0c233f]/70 truncate max-w-[150px]">
                          {outreachForm.img ? "Photo Uploaded" : "Upload Picture"}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#0c233f]/40">JPEG/PNG, max 10MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOutreachModalOpen(false);
                      setEditingOutreach(null);
                      setOutreachForm({ name: "", role: "", phone: "", img: "" });
                    }}
                    className="bg-[#f1f5f9] text-[#0c233f] px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#e2e8f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#0c233f]"
                  >
                    {editingOutreach ? "Enforce Changes" : "Register Outreach Lead"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL WINDOW FOR DYNAMIC ARCHIVE GALLERY IMPORT */}
      <AnimatePresence>
        {isGalleryModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsGalleryModalOpen(false);
                setEditingGallery(null);
                setGalleryForm({ title: "", category: "", url: "", desc: "" });
              }}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl bg-white z-[110] rounded-[32px] shadow-3xl border border-black/5"
            >
              <form onSubmit={handleAddOrEditGallery} className="p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-black text-primary italic tracking-tight">
                      {editingGallery ? "Edit School Event Photo Details" : "Upload Event Photo to Gallery"}
                    </h3>
                    <p className="text-[10px] uppercase font-black text-primary/40 tracking-widest mt-1">
                      Choose categories and provide descriptive labels
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsGalleryModalOpen(false);
                      setEditingGallery(null);
                      setGalleryForm({ title: "", category: "", url: "", desc: "" });
                    }}
                    className="p-2.5 bg-[#f1f5f9] rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Event Title / Photo Narrative Label
                    </label>
                    <input
                      type="text"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-bold text-primary shadow-inner"
                      placeholder="e.g. Sports Competition 2083"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Category Tag Type
                    </label>
                    <select
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-black shadow-inner appearance-none text-primary"
                      required
                    >
                      <option value="">Select Category Tag</option>
                      {["Sports", "Computer Lab", "Classroom", "Excursion", "Celebration", "Infrastructure"].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Photo description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Photo Description / Caption Label
                    </label>
                    <textarea
                      value={galleryForm.desc || ""}
                      onChange={(e) => setGalleryForm({ ...galleryForm, desc: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-semibold text-primary shadow-inner min-h-[80px]"
                      placeholder="Enter a descriptive label or caption for this memory..."
                      required
                    />
                  </div>

                  {/* Photo file selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Upload Picture File
                    </label>
                    <div className="relative border border-dashed border-[#cbcbcb] rounded-2xl p-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-all flex items-center justify-between cursor-pointer text-left h-[50px] overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCmsImageUpload(e, "galleryPhoto")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center gap-3">
                        {galleryForm.url ? (
                          <img 
                            src={galleryForm.url} 
                            className="w-8 h-8 object-cover rounded-lg border border-primary/10" 
                            alt="Archive Preview" 
                          />
                        ) : (
                          <Camera className="text-[#0c233f]/50" size={16} />
                        )}
                        <span className="text-xs font-extrabold text-[#0c233f]/70 truncate max-w-[150px]">
                          {galleryForm.url ? "Photo Uploaded" : "Upload Picture"}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#0c233f]/40">JPEG/PNG, max 10MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setIsGalleryModalOpen(false);
                      setEditingGallery(null);
                      setGalleryForm({ title: "", category: "", url: "", desc: "" });
                    }}
                    className="bg-[#f1f5f9] text-[#0c233f] px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#e2e8f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#0c233f]"
                  >
                    {editingGallery ? "Save Changes" : "Publish to Gallery"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL WINDOW FOR ADDING/EDITING CURRICULUM FEAT/PILLARS */}
      <AnimatePresence>
        {isFeatureModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsFeatureModalOpen(false);
                setEditingFeature(null);
                setFeatureForm({ title: "", desc: "", img: "", localName: "" });
              }}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-[110] rounded-[32px] md:rounded-[40px] shadow-3xl border border-black/5"
            >
              <form onSubmit={handleAddOrEditFeature} className="p-6 md:p-10 space-y-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-primary italic tracking-tight">
                      {editingFeature ? "Edit Homepage Feature" : "Add Homepage Feature"}
                    </h3>
                    <p className="text-[10px] uppercase font-black text-primary/40 tracking-widest mt-1">
                      Set feature text and promotional card graphics
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFeatureModalOpen(false);
                      setEditingFeature(null);
                      setFeatureForm({ title: "", desc: "", img: "", localName: "" });
                    }}
                    className="p-2.5 bg-[#f1f5f9] rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Curriculum Feature Title
                    </label>
                    <input
                      type="text"
                      value={featureForm.title}
                      onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-semibold text-primary shadow-inner"
                      placeholder="e.g. Holistic Environment"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Feature Description / Detail
                    </label>
                    <textarea
                      value={featureForm.desc}
                      onChange={(e) => setFeatureForm({ ...featureForm, desc: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-semibold text-primary shadow-inner min-h-[100px]"
                      placeholder="Enter details on what makes this pillar unique..."
                      required
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Promo Graphical Cover
                    </label>
                    <div className="relative border border-dashed border-[#cbcbcb] rounded-2xl p-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-all flex items-center justify-between cursor-pointer text-left h-[50px] overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCmsImageUpload(e, "featurePhoto")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center gap-3">
                        {featureForm.img ? (
                          <img 
                            src={featureForm.img} 
                            className="w-8 h-8 object-cover rounded-lg border border-primary/10" 
                            alt="Feature Preview" 
                          />
                        ) : (
                          <Camera className="text-[#0c233f]/50" size={16} />
                        )}
                        <span className="text-xs font-extrabold text-[#0c233f]/70 truncate max-w-[150px]">
                          {featureForm.img ? "Photo Uploaded" : "Upload Picture"}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#0c233f]/40">JPEG/PNG, max 10MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFeatureModalOpen(false);
                      setEditingFeature(null);
                      setFeatureForm({ title: "", desc: "", img: "", localName: "" });
                    }}
                    className="bg-[#f1f5f9] text-[#0c233f] px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#e2e8f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#0c233f]"
                  >
                    {editingFeature ? "Save Changes" : "Create Feature"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL WINDOW FOR ADDING/EDITING DAILY TIMELINE EVENTS */}
      <AnimatePresence>
        {isTimelineModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsTimelineModalOpen(false);
                setEditingTimeline(null);
                setTimelineForm({ time: "", event: "", img: "", localName: "" });
              }}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-[110] rounded-[32px] md:rounded-[40px] shadow-3xl border border-black/5"
            >
              <form onSubmit={handleAddOrEditTimelineEvent} className="p-6 md:p-10 space-y-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-primary italic tracking-tight font-sans">
                      {editingTimeline ? "Edit Timeline Event" : "Add Timeline Event"}
                    </h3>
                    <p className="text-[10px] uppercase font-black text-primary/40 tracking-widest mt-1">
                      Set activity timing, titles, and graphical backgrounds
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTimelineModalOpen(false);
                      setEditingTimeline(null);
                      setTimelineForm({ time: "", event: "", img: "", localName: "" });
                    }}
                    className="p-2.5 bg-[#f1f5f9] rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Event Time / Duration Title
                    </label>
                    <input
                      type="text"
                      value={timelineForm.time}
                      onChange={(e) => setTimelineForm({ ...timelineForm, time: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-semibold text-primary shadow-inner"
                      placeholder="e.g. 09:30 AM"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Event Activity / Event Name
                    </label>
                    <input
                      type="text"
                      value={timelineForm.event}
                      onChange={(e) => setTimelineForm({ ...timelineForm, event: e.target.value })}
                      className="w-full bg-[#f1f5f9]/85 border border-[#e2e8f0] focus:border-accent ring-0 rounded-2xl px-5 py-3.5 focus:outline-none text-xs font-semibold text-primary shadow-inner"
                      placeholder="e.g. Morning Assembly"
                      required
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0c233f]/50 block ml-2 font-mono">
                      Activity Visual Reference Photo
                    </label>
                    <div className="relative border border-dashed border-[#cbcbcb] rounded-2xl p-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-all flex items-center justify-between cursor-pointer text-left h-[50px] overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCmsImageUpload(e, "timelinePhoto")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center gap-3">
                        {timelineForm.img ? (
                          <img 
                            src={timelineForm.img} 
                            className="w-8 h-8 object-cover rounded-lg border border-primary/10" 
                            alt="Timeline Preview" 
                          />
                        ) : (
                          <Camera className="text-[#0c233f]/50" size={16} />
                        )}
                        <span className="text-xs font-extrabold text-[#0c233f]/70 truncate max-w-[150px]">
                          {timelineForm.img ? "Photo Uploaded" : "Upload Picture"}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#0c233f]/40">JPEG/PNG, max 10MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTimelineModalOpen(false);
                      setEditingTimeline(null);
                      setTimelineForm({ time: "", event: "", img: "", localName: "" });
                    }}
                    className="bg-[#f1f5f9] text-[#0c233f] px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#e2e8f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#0c233f]"
                  >
                    {editingTimeline ? "Save Changes" : "Create Event"}
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
