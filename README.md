# Smart Bookmark App

📍 Live Demo: https://smart-bookmark-app-chi.vercel.app

A full-stack bookmark manager built with **Next.js (App Router)** and **Supabase** featuring:

✔ Google OAuth authentication  
✔ Row-level security (RLS)  
✔ Real-time updates  
✔ User-specific bookmark isolation  
✔ Deployment on Vercel  

---

## 🧱 Tech Stack

- **Next.js** (App Router) – frontend + server routing  
- **Supabase** – database, authentication, and realtime  
- **PostgreSQL** (via Supabase)  
- **Tailwind CSS** – UI styling  
- **Vercel** – deployment

---

## 🚀 Features

### 🔐 Authentication

- Login with Google OAuth  
- Session persistence  
- Protected routes

### 🏷 Bookmark CRUD

- Add bookmark with title + URL  
- List only your own bookmarks  
- Delete bookmarks

### 🔄 Realtime

- Sync bookmark list instantly across open tabs  
  using Supabase Realtime

### 🔒 Security

- Row-Level Security (RLS) ensures each user can:
  - Only view their own bookmarks  
  - Only insert and delete their own data

---

## 🧠 Architecture

