-- ============================================
-- Ajaia Doc — Supabase Schema Setup
-- ============================================
-- Run this script in the Supabase SQL Editor dashboard.
-- It creates all tables, disables RLS, and seeds two users.
-- ============================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

-- Disable RLS on users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled Document',
  content TEXT DEFAULT '',
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Disable RLS on documents
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- 3. Document shares table (composite primary key)
CREATE TABLE IF NOT EXISTS document_shares (
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, user_id)
);

-- Disable RLS on document_shares
ALTER TABLE document_shares DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Seed Data: Alice and Bob
-- ============================================
-- Using deterministic UUIDs so the app can reference them directly.

INSERT INTO users (id, name) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Alice'),
  ('b2222222-2222-2222-2222-222222222222', 'Bob')
ON CONFLICT (id) DO NOTHING;
