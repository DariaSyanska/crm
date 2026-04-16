export type Task = {
  id: number;
  title: string;
  description?: string | null;
  due_date?: string | null;
  status: string;
  user_id?: number | null;
  client_id?: number | null;
};