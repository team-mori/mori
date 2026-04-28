-- MORI demo schema
create extension if not exists "pgcrypto";

create type notice_category as enum ('scholarship', 'extracurricular', 'career');
create type application_status_enum as enum ('planning', 'completed');

create table notices (
  id uuid primary key default gen_random_uuid(),
  category notice_category not null,
  title text not null,
  summary text,
  target text,
  start_date date,
  end_date date,
  documents text[] default '{}',
  source_url text not null unique,
  source_board text,
  raw_html text,
  llm_processed boolean not null default false,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table application_status (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  notice_id uuid not null references notices(id) on delete cascade,
  status application_status_enum not null,
  updated_at timestamptz not null default now(),
  unique (user_id, notice_id)
);

create table prelaunch_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  referrer text,
  created_at timestamptz not null default now()
);

create index notices_end_date_idx on notices(end_date);
create index notices_category_idx on notices(category);

-- Demo user (학생용 데모에서 사용)
insert into users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'demo@mori.app')
on conflict (email) do nothing;
