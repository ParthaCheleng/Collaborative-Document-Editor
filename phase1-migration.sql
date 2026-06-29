-- ============================================
-- Ajaia Doc — Phase 1 Migration
-- ============================================
-- Run this script in the Supabase SQL Editor dashboard.

ALTER TABLE document_shares 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'viewer' 
CHECK (role IN ('viewer', 'editor'));
