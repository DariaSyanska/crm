export type Note = {
  id: number;
  client_id: number;
  user_id?: number | null;
  text: string;
  created_at: string;
};