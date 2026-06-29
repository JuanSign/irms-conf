export interface CategoryBreakdown {
  total: number;
  member: number;
  nonMember: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalAbstracts: number;
  totalRegistrations: number;
  verifiedRevenue: number;
  verifiedRegistrationsCount: number;
  verifiedIopCount: number;
  registrationBreakdown: {
    industry: CategoryBreakdown;
    academic: CategoryBreakdown;
    student: CategoryBreakdown;
  };
  statusBreakdown: {
    accepted: number;
    rejected: number;
  };
  reviews: { completed: number; total: number };
}

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  affiliation: string | null;
  abstracts: any[]; 
  coauthoredAbstracts: any[];
}

export interface AdminDetail {
  id: string;
  name: string;
  username: string;
  role: string;
  createdAt: Date;
  assignments: any[];
}

export interface AbstractDetail {
  id: string;
  title: string;
  status: string;
  path: string;
  fileName: string;
  author: { name: string; email: string };
  assignments: any[];
}

export interface EventRegistrationDetail {
  id: string;
  category: string;
  amount: number;
  paymentProofUrl: string | null;
  status: string;
  isIrmsMember: boolean;
  irmsMemberId: string | null;
  user: { name: string; email: string; affiliation: string | null };
  createdAt: Date;
}

export interface IopDetail {
  id: string;
  paymentProofUrl: string | null;
  status: string;
  fullPaperUrl: string | null;
  paperStatus: string;
  abstract: { id: string; title: string; author: { name: string; email: string } };
}

export interface SlideDetail {
  id: string;
  fileUrl: string;
  status: string;
  abstract: { id: string; title: string; author: { name: string; email: string } };
}