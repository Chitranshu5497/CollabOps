export interface Message {
  id: string;

  content: string;

  fileUrl?: string;

  fileName?: string;

  fileType?: string;

  createdAt: string;

  sender: {
    id: string;
    name: string;
  };
}