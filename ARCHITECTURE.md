# Architecture & Engineering Decisions

As a Staff-Level Product Engineer, building a product within a strict timebox requires aggressive prioritization. This document outlines the core tradeoffs made during the development of AJAIA.

## What I Prioritized
1. **Core Stability over Feature Bloat:** My primary objective was to ensure a rock-solid, bug-free editing experience. By utilizing Tiptap, we achieved a highly customizable headless editor that doesn't suffer from the contenteditable quirks found in older rich-text libraries.
2. **Relational Data Integrity:** Instead of relying on a single JSON blob for permissions, I prioritized a strict relational model in Supabase. Document permissions are managed via a `document_shares` junction table, allowing scalable 'Viewer' and 'Editor' roles.
3. **Real-Time Presence:** I prioritized real-time "who is online" indicators (using Supabase WebSockets) over complex CRDT (Conflict-free Replicated Data Type) text syncing. True real-time typing is notoriously complex and prone to race conditions; presence indicators provide 80% of the collaborative feel with 20% of the engineering risk.

## What I Deprioritized & Why
1. **Full Authentication:** I intentionally deprioritized a real OAuth/Email auth system in favor of a "Mock Auth" Context switcher (Alice, Bob, You, etc.). Authentic authentication takes significant time to configure properly (email confirmations, routing middleware) which would have eaten into the timebox dedicated to the core editor features.
2. **Backend File Storage:** I chose to handle `.md` and `.txt` file imports/exports strictly via browser APIs on the client-side (`FileReader`, `marked`, `turndown`). Building backend file storage mechanisms (like AWS S3 or Supabase Storage) introduces unnecessary latency and security complexities for what is essentially just text parsing.

## Validation & Error Handling
Permissions are strictly validated on the frontend to prevent UI mismatch. For example, when a document is fetched, the user's role is checked against the `document_shares` table. If the role resolves to `viewer`, the Tiptap editor is explicitly mounted in locked mode (`editable={false}`) and the Save/Toolbar components are completely hidden from the DOM, ensuring a secure and clean read-only experience.
