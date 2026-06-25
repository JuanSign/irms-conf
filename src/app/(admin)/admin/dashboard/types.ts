export type BaseAbstract = { id: string; title: string; status: string };

export type UserDetail = {
  id: string; name: string; email: string; affiliation: string | null;
  abstracts: BaseAbstract[];
  coauthoredAbstracts: { abstract: BaseAbstract }[]
};

export type AdminDetail = {
  id: string; name: string; username: string; role: string;
  assignments: { isReviewed: boolean; abstract: BaseAbstract }[]
};

export type AbstractDetail = BaseAbstract & {
  path: string;
  fileName: string;
  author: { name: string; email: string };
  assignments: {
    isReviewed: boolean;
    admin: { name: string };
    scoreClarity: number | null;
    scoreQuality: number | null;
    scoreCompleteness: number | null;
    scoreInteresting: number | null;
  }[];
};

export type EventRegistrationDetail = {
  id: string;
  category: string;
  amount: number;
  paymentProofUrl: string | null;
  status: string;
  isIrmsMember: boolean;
  irmsMemberId: string | null;
  user: { name: string; email: string; affiliation: string | null };
  createdAt: Date;
};

export type IopDetail = {
  id: string;
  paymentProofUrl: string | null;
  status: string;
  fullPaperUrl: string | null;
  paperStatus: string;
  abstract: { id: string; title: string; author: { name: string; email: string } };
  createdAt: Date;
};

export type SlideDetail = {
  id: string;
  fileUrl: string;
  status: string;
  abstract: { id: string; title: string; author: { name: string; email: string } };
  createdAt: Date;
};

export type DashboardStats = {
  totalUsers: number;
  totalAbstracts: number;
  totalRegistrations: number;
  verifiedRevenue: number;
  statusBreakdown: Record<string, number>;
  reviews: { completed: number; total: number };
};