import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";

import {
  createTask,
  getWorkspaceTasks,
  updateTaskStatus,
  assignTask,
  getMyTasks,
} from "./task.service";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await createTask(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  },
);

export const getWorkspaceTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    const tasks = await getWorkspaceTasks(
      workspaceId as string
    );

    res.status(200).json({
      success: true,
      data: tasks,
    });
  },
);

export const updateTaskStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await updateTaskStatus(
      taskId as string,
      status,
      req.user.id
    );

    res.json({
      success: true,
      data: task,
    });
  },
);

export const assignTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { assigneeId } = req.body;

    const task = await assignTask(
      taskId as string,
      assigneeId || null,
      req.user.id
    );

    res.json({
      success: true,
      data: task,
    });
  },
);

export const getMyTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const tasks = await getMyTasks(req.user.id);

    res.json({
      success: true,
      data: tasks,
    });
  },
);