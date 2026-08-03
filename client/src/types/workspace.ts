export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
}