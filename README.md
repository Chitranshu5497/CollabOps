# 🚀 CollabOps

A modern **real-time collaboration and workspace management platform** built with the **MERN Stack**, **TypeScript**, **Socket.IO**, **Redis**, and **BullMQ**. CollabOps enables teams to collaborate seamlessly through workspaces, live updates, notifications, and role-based access control.

---

## ✨ Features

### 🔐 Authentication

* Secure JWT Authentication
* Refresh Token Authentication
* HTTP-Only Cookies
* Role-Based Authorization

### 🏢 Workspace Management

* Create Workspaces
* Update Workspace Details
* Delete Workspaces
* Join & Leave Workspaces
* Workspace Roles

  * Owner
  * Admin
  * Member

### 👥 Member Management

* View Workspace Members
* Remove Members
* Change Member Roles
* Role-Based Permissions

### 🔔 Notifications

* Real-time Notifications
* Mark Notifications as Read
* Notification History

### ⚡ Real-Time Features

* Socket.IO Integration
* Live Workspace Updates
* Instant Notifications

### 📊 Dashboard

* Workspace Overview
* Beautiful Responsive UI
* Modern Card-based Layout

---

# 🛠 Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Zustand
* Socket.IO Client
* Lucide React

## Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* bcrypt
* Zod
* Socket.IO

## Infrastructure

* Redis
* BullMQ

---

# 📂 Project Structure

```text
CollabOps
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── store
│   │   ├── hooks
│   │   └── utils
│
├── server
│   ├── src
│   │   ├── modules
│   │   ├── middleware
│   │   ├── routes
│   │   ├── lib
│   │   ├── utils
│   │   └── prisma
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Chitranshu5497/CollabOps.git
```

```bash
cd collabops
```

---

## Backend

```bash
cd server
```

Install dependencies

```bash
npm install
```

Create environment file

```env
DATABASE_URL=
ACCESS_SECRET=
REFRESH_SECRET=
CLIENT_URL=
PORT=
REDIS_URL=
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Start Backend

```bash
npm run dev
```

---

## Frontend

```bash
cd client
```

Install dependencies

```bash
npm install
```

Create

```env
VITE_API_URL=http://localhost:5000/api
```

Start

```bash
npm run dev
```

---

# 🔐 User Roles

| Role   | Permissions                  |
| ------ | ---------------------------- |
| Owner  | Full Workspace Control       |
| Admin  | Manage Members & Workspace   |
| Member | Collaborate Inside Workspace |

---

# 📸 Screenshots

> Will add screenshots here after deployment.

* Dashboard
* Login
* Register
* Workspace
* Notifications
* Member Management

---

# 🚧 Upcoming Features

* Shared Task Board
* Collaborative Rich Text Editor
* File Uploads
* Background Jobs using BullMQ
* Search with Redis Cache
* Analytics Dashboard
* Activity Timeline
* Workspace Invitations
* Email Notifications
* AI Assistant Integration

---

# 📌 API Highlights

Authentication

* Register
* Login
* Refresh Token
* Logout
* Get Current User

Workspace

* Create Workspace
* Update Workspace
* Delete Workspace
* List User Workspaces

Members

* View Members
* Remove Member
* Change Member Role
* Leave Workspace

Notifications

* Get Notifications
* Mark Notification Read

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Chitranshu**

If you found this project helpful, consider giving it a ⭐ on GitHub.
