import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(300).optional(),
});

export type CreateWorkspaceInput = z.infer<
  typeof createWorkspaceSchema
>;

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type UpdateWorkspaceInput =
  z.infer<typeof updateWorkspaceSchema>;

  export const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});
 