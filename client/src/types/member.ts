export interface WorkspaceMember {
  id: string;

  role: "OWNER" | "ADMIN" | "MEMBER";

  joinedAt: string;

  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}