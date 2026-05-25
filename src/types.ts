/**
 * Types and interfaces for the school website data structures
 */

export interface Notice {
  id: string;
  date: string;
  title: string;
  cat: string;
  desc: string;
}

export interface ClassFee {
  className: string;
  admissionFee: number;
  monthlyFee: number;
  examFee: number;
  computerFee: number;
  tcFee: number;
  marksheetFee: number;
  miscFee: number;
}

export interface AdmissionRequest {
  id: string;
  studentName: string;
  targetClass: string;
  guardianContact: string;
  address: string;
  previousSchool: string;
  status: "requested" | "confirmed" | "saved";
  createdAt: string;
}

export interface SchoolDataPayload {
  tickerMessage: string;
  notices: Notice[];
  drafts: Notice[];
  fees: ClassFee[];
  admissions: AdmissionRequest[];
}

export interface SchoolDataContextType {
  tickerMessage: string;
  notices: Notice[];
  drafts: Notice[];
  fees: ClassFee[];
  admissions: AdmissionRequest[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateTicker: (message: string) => Promise<boolean>;
  updateFees: (fees: ClassFee[]) => Promise<boolean>;
  addNotice: (notice: Omit<Notice, "id">, isDraft?: boolean) => Promise<boolean>;
  editNotice: (id: string, notice: Omit<Notice, "id">) => Promise<boolean>;
  deleteNotice: (id: string) => Promise<boolean>;
  publishDraft: (id: string) => Promise<boolean>;
  revertToDraft: (id: string) => Promise<boolean>;
  deleteDraftPermanently: (id: string) => Promise<boolean>;
  submitAdmissionRequest: (req: Omit<AdmissionRequest, "id" | "status" | "createdAt">) => Promise<boolean>;
  updateAdmissionStatus: (id: string, status: "requested" | "confirmed" | "saved") => Promise<boolean>;
  deleteAdmissionRequest: (id: string) => Promise<boolean>;
  adminToken: string | null;
  setAdminTokenState: (token: string | null) => void;
  logoutAdmin: () => Promise<void>;
}
