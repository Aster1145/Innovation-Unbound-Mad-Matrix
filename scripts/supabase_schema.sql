-- ====================================================================
-- FinancialBridge — Complete Supabase PostgreSQL DDL Schema & Demo Seed
-- Paste and run this entire script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ====================================================================

-- 1. Enable pgcrypto for gen_random_uuid() if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if re-running (clean reset)
DROP TABLE IF EXISTS consents CASCADE;
DROP TABLE IF EXISTS repayments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS income_entries CASCADE;
DROP TABLE IF EXISTS work_history CASCADE;
DROP TABLE IF EXISTS bank_profiles CASCADE;
DROP TABLE IF EXISTS employer_profiles CASCADE;
DROP TABLE IF EXISTS worker_profiles CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- --------------------------------------------------------------------
-- Core Identity
-- --------------------------------------------------------------------

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'worker' | 'employer' | 'bank'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  token TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- --------------------------------------------------------------------
-- Role Profiles
-- --------------------------------------------------------------------

CREATE TABLE worker_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  worker_type TEXT NOT NULL DEFAULT 'gig',
  phone TEXT,
  city TEXT,
  primary_platform TEXT,
  work_start_date DATE,
  current_savings INTEGER NOT NULL DEFAULT 0,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE employer_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT
);

CREATE TABLE bank_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL
);

-- --------------------------------------------------------------------
-- Financial Data
-- --------------------------------------------------------------------

CREATE TABLE work_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer_name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE income_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer_user_id UUID,
  date DATE NOT NULL,
  source TEXT NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  channel TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'unverified', -- 'unverified' | 'verified' | 'rejected'
  verification_method TEXT,
  evidence_note TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'credit' | 'debit'
  institution TEXT NOT NULL
);

CREATE TABLE repayments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lender TEXT NOT NULL,
  loan_type TEXT,
  monthly_emi INTEGER NOT NULL,
  on_time_payments INTEGER NOT NULL,
  total_payments INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

-- --------------------------------------------------------------------
-- Consent Registry
-- --------------------------------------------------------------------

CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  institution_type TEXT NOT NULL, -- 'data_provider' | 'partner_bank'
  scopes TEXT NOT NULL,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'revoked'
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

-- ====================================================================
-- Demo Accounts Seed (Password for all: demo123)
-- Password Hash: Salted scrypt hash for 'demo123'
-- ====================================================================

-- 1. Insert Demo Users
INSERT INTO users (id, email, password_hash, name, role) VALUES
  ('11111111-1111-4111-8111-111111111111', 'ravi@demo.com', 'a3f789b910111213:30a10972cb7fcf39c5b969bbbb77b5f54316d0295eb1eefbc3827ec377660c6ecf6e3c0d8dcdce724d1a3c6131ebc120bbef1c855a8e0cb20e98083818e9a2b8', 'Ravi Kumar', 'worker'),
  ('22222222-2222-4222-8222-222222222222', 'meena@demo.com', 'a3f789b910111213:30a10972cb7fcf39c5b969bbbb77b5f54316d0295eb1eefbc3827ec377660c6ecf6e3c0d8dcdce724d1a3c6131ebc120bbef1c855a8e0cb20e98083818e9a2b8', 'Meena Devi', 'worker'),
  ('33333333-3333-4333-8333-333333333333', 'employer@demo.com', 'a3f789b910111213:30a10972cb7fcf39c5b969bbbb77b5f54316d0295eb1eefbc3827ec377660c6ecf6e3c0d8dcdce724d1a3c6131ebc120bbef1c855a8e0cb20e98083818e9a2b8', 'ABC Construction (Verifying Manager)', 'employer'),
  ('44444444-4444-4444-8444-444444444444', 'bank@demo.com', 'a3f789b910111213:30a10972cb7fcf39c5b969bbbb77b5f54316d0295eb1eefbc3827ec377660c6ecf6e3c0d8dcdce724d1a3c6131ebc120bbef1c855a8e0cb20e98083818e9a2b8', 'Unity Trust Partner Bank', 'bank');

-- 2. Insert Profiles
INSERT INTO worker_profiles (user_id, worker_type, phone, city, primary_platform, work_start_date, current_savings, onboarding_complete) VALUES
  ('11111111-1111-4111-8111-111111111111', 'gig', '+91 98765 43210', 'Bengaluru', 'Urban Company / Porter', '2023-01-15', 38500, true),
  ('22222222-2222-4222-8222-222222222222', 'daily-wage', '+91 91234 56789', 'Pune', 'Construction / Masonry', '2022-06-01', 14200, true);

INSERT INTO employer_profiles (user_id, company_name, industry) VALUES
  ('33333333-3333-4333-8333-333333333333', 'ABC Construction Private Limited', 'Real Estate & Infrastructure');

INSERT INTO bank_profiles (user_id, bank_name) VALUES
  ('44444444-4444-4444-8444-444444444444', 'Unity Trust Partner Bank');

-- 3. Insert Work History
INSERT INTO work_history (worker_id, employer_name, role, start_date, is_current) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Urban Company', 'Home Services Partner', '2023-01-15', true),
  ('11111111-1111-4111-8111-111111111111', 'Porter Logistics', 'Driver Partner', '2023-06-01', true),
  ('22222222-2222-4222-8222-222222222222', 'ABC Construction', 'Senior Mason', '2022-06-01', true);

-- 4. Insert Consents
INSERT INTO consents (worker_id, institution_name, institution_type, scopes, purpose, status) VALUES
  ('11111111-1111-4111-8111-111111111111', 'SwiftPay Demo Bank', 'data_provider', 'transactions,income,expenses', 'Import transaction history to calculate Income Confidence and Financial Resilience scores.', 'active'),
  ('11111111-1111-4111-8111-111111111111', 'Unity Trust Partner Bank', 'partner_bank', 'transactions,income,expenses,profile,score,savings', 'Evaluate worker for micro-credit suitability via alternative financial identity.', 'active');

-- 5. Insert Repayments
INSERT INTO repayments (worker_id, lender, loan_type, monthly_emi, on_time_payments, total_payments, status) VALUES
  ('11111111-1111-4111-8111-111111111111', 'FINO Microfinance', 'Two-wheeler Loan', 1850, 11, 12, 'active'),
  ('22222222-2222-4222-8222-222222222222', 'Grameen Credit Cooperative', 'Equipment Purchase', 1200, 6, 6, 'active');

-- 6. Insert Verified & Cash Income Entries
INSERT INTO income_entries (worker_id, employer_user_id, date, source, description, amount, channel, status, verification_method) VALUES
  ('11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333', CURRENT_DATE - INTERVAL '2 days', 'ABC Construction', 'Masonry & tile work', 1400, 'cash', 'verified', 'employer_confirmation'),
  ('11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333', CURRENT_DATE - INTERVAL '10 days', 'ABC Construction', 'Wall finishing shift', 1200, 'cash', 'unverified', NULL),
  ('22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333', CURRENT_DATE - INTERVAL '5 days', 'ABC Construction', 'Daily site masonry', 850, 'cash', 'verified', 'employer_confirmation');

-- 7. Insert Synthetic Transactions for Worker 1
INSERT INTO transactions (worker_id, date, description, category, amount, type, institution) VALUES
  ('11111111-1111-4111-8111-111111111111', CURRENT_DATE - INTERVAL '3 days', 'Urban Company Payout', 'Gig Income', 4850, 'credit', 'SwiftPay Demo Bank'),
  ('11111111-1111-4111-8111-111111111111', CURRENT_DATE - INTERVAL '7 days', 'Porter Payout', 'Gig Income', 3200, 'credit', 'SwiftPay Demo Bank'),
  ('11111111-1111-4111-8111-111111111111', CURRENT_DATE - INTERVAL '12 days', 'Urban Company Payout', 'Gig Income', 5100, 'credit', 'SwiftPay Demo Bank'),
  ('11111111-1111-4111-8111-111111111111', CURRENT_DATE - INTERVAL '4 days', 'Avenue Supermarts Groceries', 'Groceries', 2150, 'debit', 'SwiftPay Demo Bank'),
  ('11111111-1111-4111-8111-111111111111', CURRENT_DATE - INTERVAL '6 days', 'HP Petrol Pump Fuel', 'Fuel', 450, 'debit', 'SwiftPay Demo Bank'),
  ('11111111-1111-4111-8111-111111111111', CURRENT_DATE - INTERVAL '14 days', 'FINO Loan EMI', 'EMI', 1850, 'debit', 'SwiftPay Demo Bank'),
  ('11111111-1111-4111-8111-111111111111', CURRENT_DATE - INTERVAL '8 days', 'Emergency Fund Deposit', 'Savings Transfer', 2500, 'debit', 'SwiftPay Demo Bank');
