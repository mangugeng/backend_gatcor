export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  type?: 'reset_password' | 'email_verification';
} 