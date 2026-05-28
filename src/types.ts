/**
 * Types and interfaces for the school website data structures
 */

export interface Notice {
  id: string;
  date: string;
  title: string;
  cat: string;
  desc: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentBase64?: string;
}

export interface ClassFee {
  className: string;
  admissionFee: number;
  monthlyFee: number;
  examFee: number;
  computerFee: number;
  transportationFee: number;
  miscFee: number;
  [key: string]: string | number; // Support infinite dynamic fee types/categories
}

export interface AdmissionRequest {
  id: string;
  studentName: string;
  targetClass: string;
  guardianContact: string;
  address: string;
  previousSchool: string;
  birthCertificate?: string; // Stored file path
  studentPhoto?: string;     // Stored file path
  status: "requested" | "confirmed" | "saved";
  createdAt: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  qual: string;
  desc: string;
  img: string;
}

export interface OutreachMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  img: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  url?: string;
  title: string;
  desc: string;
  category?: string;
}

export interface CourseProgram {
  id: string;
  name: string;
  img: string;
  desc: string;
  focus: string;
}

export interface WebsiteContent {
  schoolName: string;
  principalName: string;
  principalRole: string;
  principalQuote: string;
  principalBio: string;
  principalStat: string;
  principalPhoto: string;
  campusPhoto1: string;
  campusPhoto2: string;
  campusPhoto3: string;
  faculty: FacultyMember[];
  schoolLogo?: string;
  
  // Extra dynamic content fields
  heroPhoto?: string;
  heroTagline?: string;
  heroSubheader?: string;
  heroDesc?: string;
  
  spotlightPhoto?: string;
  spotlightTag?: string;
  spotlightTitle?: string;
  
  admissionsBgPhoto?: string;
  
  schoolPhone?: string;
  schoolEmail?: string;
  schoolAddress?: string;
  schoolGoogleMaps?: string;

  outreachTeam?: OutreachMember[];
  galleryPhotos?: GalleryPhoto[];
  coursePrograms?: CourseProgram[];
  [key: string]: any; // Permissive index signature
}

export interface SchoolNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SchoolDataPayload {
  tickerMessage: string;
  notices: Notice[];
  drafts: Notice[];
  fees: ClassFee[];
  monthlyFeeCategories?: string[];
  yearlyFeeCategories?: string[];
  admissions: AdmissionRequest[];
  websiteContent?: WebsiteContent;
  adminNotifications?: SchoolNotification[];
  publicNotifications?: SchoolNotification[];
}

export interface SchoolDataContextType {
  tickerMessage: string;
  notices: Notice[];
  drafts: Notice[];
  fees: ClassFee[];
  monthlyFeeCategories: string[];
  yearlyFeeCategories: string[];
  admissions: AdmissionRequest[];
  websiteContent: WebsiteContent | null;
  adminNotifications: SchoolNotification[];
  publicNotifications: SchoolNotification[];
  markAdminNotificationsRead: () => Promise<boolean>;
  clearAdminNotifications: () => Promise<boolean>;
  loading: boolean;
  refreshData: () => Promise<void>;
  updateTicker: (message: string) => Promise<boolean>;
  updateFees: (fees: ClassFee[], monthlyFeeCategories?: string[], yearlyFeeCategories?: string[]) => Promise<boolean>;
  updateWebsiteContent: (content: WebsiteContent) => Promise<boolean>;
  addNotice: (notice: Omit<Notice, "id">, isDraft?: boolean) => Promise<boolean>;
  editNotice: (id: string, notice: Omit<Notice, "id">) => Promise<boolean>;
  deleteNotice: (id: string) => Promise<boolean>;
  publishDraft: (id: string) => Promise<boolean>;
  revertToDraft: (id: string) => Promise<boolean>;
  deleteDraftPermanently: (id: string) => Promise<boolean>;
  submitAdmissionRequest: (req: Omit<AdmissionRequest, "id" | "status" | "createdAt" | "birthCertificate" | "studentPhoto"> & { birthCertificate?: string; studentPhoto?: string }) => Promise<boolean>;
  updateAdmissionStatus: (id: string, status: "requested" | "confirmed" | "saved") => Promise<boolean>;
  deleteAdmissionRequest: (id: string) => Promise<boolean>;
  adminToken: string | null;
  setAdminTokenState: (token: string | null) => void;
  logoutAdmin: () => Promise<void>;
}
