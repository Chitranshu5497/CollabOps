export interface Activity {
  id: string;

  action: string;

  entityType?: string;

  entityId?: string;

  metadata?: Record<string, unknown>;

  createdAt: string;

  user: {
    id: string;
    name: string;
  };
}