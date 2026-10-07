# 💬 Aptisure Real-Time Chat Application (MERN Stack)

An academic, production-ready Real-Time Chat Application crafted with clean **MERN architecture** (MongoDB, Express.js, React, Node.js), powered by **Socket.IO** for live bidirectional communication, and styled according to the **Google Stitch** modern design principles.

---

## 🌟 Key Features

1. **User Registration & Login**: Form validation, dynamic DiceBear avatar generation & randomizer.
2. **Secure Authentication**: Password hashing with `bcryptjs` (salt rounds: 10) and stateless token validation with `jsonwebtoken` (JWT).
3. **Private 1-on-1 Messaging**: Instant direct messaging with contact search and chat creation.
4. **Group Chat Rooms**: Create multi-user channels, assign group admins, dynamic member addition/removal, and room renaming.
5. **Real-Time Messaging**: Low-latency message transmission via Socket.IO rooms.
6. **Online / Offline Presence Tracking**: Real-time connection presence map with green/gray status indicators.
7. **Typing Indicators**: Animated live typing pulse (`Alex is typing...`).
8. **Instant Notifications & Unread Badges**: In-app toast popups and pill count badges for inactive conversations.
11. **Sample Data Pre-Loaded**: Pre-configured sample users, 1-on-1 private conversations, group rooms, and message history out-of-the-box.

---

## 👥 Pre-Loaded Sample Accounts

All sample accounts share the default password: `password123`

| User | Email | Role / Bio |
| :--- | :--- | :--- |
| **Alex Rivers** | `alex@aptisure.edu` | Full-stack developer & CS Senior |
| **Bella Chen** | `bella@aptisure.edu` | UI/UX Designer (Stitch Design Specialist) |
| **Carlos Mendoza** | `carlos@aptisure.edu` | Cloud & DevOps Architect |
| **Diana Prince** | `diana@aptisure.edu` | Data Science Researcher |
| **Ethan Taylor** | `ethan@aptisure.edu` | Mobile & React Specialist |

> [!TIP]
> On the `/login` page, you can click any of the **Quick Demo Login** buttons to instantly sign in without typing!

---

## 🛠 Tech Stack

### Frontend (`/client`)
- **React 18** + **Vite**
- **JavaScript (ESM)**
- **Tailwind CSS** (Custom Stitch theme palette)
- **Socket.IO Client**
- **Axios** (With automatic JWT Authorization interceptor)
- **React Router DOM v7** (Protected & Public Route Guards)
- **Lucide Icons**

### Backend (`/server`)
- **Node.js** + **Express.js**
- **Socket.IO** (Real-time engine with room management)
- **MongoDB** + **Mongoose** (With resilient in-memory fallback for local academic grading without a running daemon)
- **JWT** (`jsonwebtoken`) + **bcryptjs**
- **CORS** + **dotenv**

---

## 📂 Project Architecture & Folder Structure

```
Aptisure/
├── package.json                 # Root script runner
├── README.md
│
├── server/                      # Express & Socket.IO Backend
│   ├── package.json
│   ├── .env                     # Server environment variables
│   ├── server.js                # Server entry point
│   ├── test-api.js              # Automated E2E verification test suite
│   ├── config/
│   │   └── db.js                # Resilient MongoDB Mongoose connection
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt methods
│   │   ├── Chat.js              # 1-on-1 & Group Chat schema
│   │   └── Message.js           # Message schema with sender & chat references
│   ├── controllers/
│   │   ├── authController.js    # Register, login, getMe
│   │   ├── userController.js    # User discovery & profile updates
│   │   ├── chatController.js    # Chat CRUD & Group administration
│   │   └── messageController.js # Message sending & retrieval
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── chatRoutes.js
│   │   └── messageRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   └── errorMiddleware.js   # 404 & Global error handlers
│   └── socket/
│       └── socketHandler.js     # Decoupled Socket.IO event listeners
│
└── client/                      # Vite + React Frontend
    ├── package.json
    ├── .env                     # Client environment variables
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx              # Route definitions & Context providers
        ├── index.css
        ├── api/                 # Axios instance & Service APIs
        ├── context/             # AuthContext, SocketContext, ChatContext
        ├── hooks/               # useAuth, useSocket, useChat
        ├── components/
        │   ├── common/          # Button, Input, Avatar, Badge, Modal, Loader
        │   ├── layout/          # Navbar, Sidebar
        │   ├── chat/            # ConversationItem, MessageStream, MessageBubble, MessageInput, Modals
        │   └── notification/    # ToastNotification
        ├── pages/               # LoginPage, RegisterPage, ChatPage, NotFoundPage
        └── utils/               # Time/Date formatters & helpers
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Running the Backend Server
```bash
cd server
npm run dev
# Server will run on http://localhost:5001
```

### 3. Running the Frontend Client
```bash
cd client
npm run dev
# Client will run on http://localhost:5173
```

### 4. Running Backend Integration Verification Tests
```bash
cd server
node test-api.js
```

---

## 🔑 Environment Variables

### Server (`server/.env`)
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/aptisure_chat
JWT_SECRET=aptisure_super_secret_jwt_key_2026_academic_chat
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```
