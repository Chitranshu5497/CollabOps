import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import DashboardPage from "../pages/dashboard/DashboardPage";

import NotFoundPage from "../pages/error/NotFoundPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import WorkspacePage from "../pages/workspace/WorkspacePage";
import TasksPage from "../pages/tasks/TasksPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import SettingsPage from "../pages/settings/SettingsPage";
import WorkspacesPage from "../pages/workspace/WorkspacesPage";
import MembersPage from "../pages/workspace/MembersPage";
import ChangeRolePage from "../pages/workspace/ChangeRolePage";

export const router = createBrowserRouter([
  {
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/workspace/:id",
        element: <WorkspacePage />,
      },
      {
        path: "/workspaces",
        element: <WorkspacesPage />,
      },
      {
        path: "/tasks",
        element: <TasksPage />,
      },
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/workspace/:workspaceId/change-role",
        element: <ChangeRolePage />,
      },
      {
        path: "/workspace/:workspaceId/members",
        element: <MembersPage />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
