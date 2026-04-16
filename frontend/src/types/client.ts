export type Client = {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  status: string;
  manager_id?: number | null;
  created_at?: string;
};