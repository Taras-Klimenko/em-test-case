export interface Request {
  id: string;
  createdAt: string;
  updatedAt: string;
  topic: string;
  message: string;
  status: string;
  resolution: string | null;
  cancelNote: string | null;
}
