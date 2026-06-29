# AI Workflow & Usage Note

The development of AJAIA was significantly accelerated through the strategic use of AI, though it required strict architectural steering to maintain code quality and infrastructure constraints.

## Tools Used
* Cursor (IDE)
* Claude 3.5 Sonnet / GPT-4o (Reasoning & Code Generation)

## Where AI Sped Me Up
AI was incredibly effective as an execution engine for boilerplate and styling tasks:
* **UI/UX Scaffolding:** Rapidly generating the Next.js and Tailwind CSS layout based on specific aesthetic prompts (e.g., "minimalist dashboard, pastel metric blocks").
* **SQL Generation:** Instantly scaffolding the Supabase PostgreSQL schema, including foreign key relationships and junction tables for the role-based sharing.
* **Regex & Parsing:** Writing the tedious `turndown` and `marked` configuration logic for handling custom Markdown-to-HTML conversions.

## What I Rejected / Changed
AI often defaults to complex, multi-service architectures. I actively had to reject several architectural suggestions:
* **Third-Party Bloat:** The AI repeatedly suggested integrating paid, third-party services like Liveblocks or Pusher to handle real-time collaboration. I rejected these suggestions and forced the AI to utilize native Supabase `channel()` and `presenceState()` APIs to keep our infrastructure tight and unified under one provider.
* **Component Bloat:** The AI attempted to extract every tiny piece of UI into a separate React component, leading to prop-drilling. I stepped in to refactor and consolidate the architecture into a flatter, more maintainable structure.

## Verification & Testing
I did not blindly trust the AI's "compiled successfully" outputs. While AI is great at writing the code, it often hallucinates state lifecycles. I relied on strict, manual integration testing across multiple mock user accounts (using incognito windows) to ensure that the Supabase data fetching, role enforcement, and real-time handshakes worked flawlessly in practice.
