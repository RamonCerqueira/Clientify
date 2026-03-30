export interface RequestUser {
  userId: string;
  email: string;
  tenantId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}
