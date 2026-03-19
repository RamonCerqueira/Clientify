export type AuthResponse = {
  accessToken: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    tenantId: string;
    name: string;
  };
};

export type Page = {
  id: string;
  title: string;
  description: string;
  businessType: string;
  whatsapp: string;
  slug: string;
  createdAt: string;
  _count?: { leads: number };
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
};
