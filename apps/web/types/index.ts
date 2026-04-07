export type AuthUser = {
  id: string;
  email: string;
  tenantId: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  lastLoginAt?: string | null;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  refreshExpiresIn: string;
  user: AuthUser;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type Page = {
  id: string;
  title: string;
  description: string;
  businessType: string;
  whatsapp: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  _count?: { leads: number };
};

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON' | 'LOST';

export type Lead = {
  id: string;
  name: string;
  phone: string;
  message: string;
  source?: string | null;
  status: LeadStatus;
  createdAt: string;
};
