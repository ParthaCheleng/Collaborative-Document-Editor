# AJAIA — Collaborative Document Editor

**Live Demo:** [Insert Vercel URL Here]

AJAIA is a lightweight, premium collaborative document editor built to provide a clean, distraction-free writing experience. It supports role-based document sharing (Viewers vs. Editors), client-side file importing/exporting, and real-time presence indicators so you always know who is viewing your work.

## Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS v4
* **Editor:** Tiptap (Headless Rich Text Editor)
* **Database & Real-time:** Supabase (PostgreSQL, WebSockets)
* **Utilities:** `marked` (Markdown importing), `turndown` (Markdown exporting)

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ParthaCheleng/Collaborative-Document-Editor.git
   cd Collaborative-Document-Editor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of the project and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup:**
   - Log into your Supabase dashboard.
   - Navigate to the SQL Editor.
   - Copy the contents of the `supabase-schema.sql` file located in the root of this repository.
   - Run the script to generate the `users`, `documents`, and `document_shares` tables, and to seed the initial mock users.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing Instructions
To run the automated test suite (verifying utility functions and markdown parsing):
```bash
npm run test
```
