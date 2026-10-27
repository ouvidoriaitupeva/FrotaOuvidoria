-- Execute este arquivo no SQL Editor do seu projeto Supabase.
-- A aplicação usa Supabase Auth: crie sua conta no primeiro acesso.

create extension if not exists pgcrypto;

create table if not exists public.vehicle_config (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  placa text,
  marca text,
  modelo text,
  ano integer,
  combustivel text,
  hodometro_referencia numeric default 0,
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.diario_bordo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data date not null,
  hora_saida time,
  hora_retorno time,
  origem text,
  destino text not null,
  finalidade text,
  motorista text,
  hodometro_inicial numeric not null default 0,
  hodometro_final numeric not null default 0,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data date not null,
  hodometro numeric not null default 0,
  itens jsonb not null default '[]'::jsonb,
  observacoes text,
  pendencias text,
  created_at timestamptz not null default now()
);

create table if not exists public.abastecimentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data date not null,
  hodometro numeric not null default 0,
  combustivel text not null,
  litros numeric not null default 0,
  valor_total numeric not null default 0,
  posto text,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.pedagios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data date not null,
  local text not null,
  valor numeric not null default 0,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.multas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data_infracao date not null,
  vencimento date,
  descricao text not null,
  valor numeric not null default 0,
  pontuacao integer default 0,
  situacao text not null default 'Pendente',
  observacoes text,
  created_at timestamptz not null default now()
);

alter table public.vehicle_config enable row level security;
alter table public.diario_bordo enable row level security;
alter table public.checklists enable row level security;
alter table public.abastecimentos enable row level security;
alter table public.pedagios enable row level security;
alter table public.multas enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['vehicle_config','diario_bordo','checklists','abastecimentos','pedagios','multas'] loop
    execute format('drop policy if exists "Usuário acessa seus dados em %I" on public.%I', t, t);
    execute format('create policy "Usuário acessa seus dados em %I" on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t, t);
  end loop;
end $$;

insert into storage.buckets (id, name, public)
values ('vehicle-docs', 'vehicle-docs', false)
on conflict (id) do nothing;

drop policy if exists "Usuário lê seus anexos do veículo" on storage.objects;
create policy "Usuário lê seus anexos do veículo" on storage.objects for select to authenticated
using (bucket_id = 'vehicle-docs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Usuário envia seus anexos do veículo" on storage.objects;
create policy "Usuário envia seus anexos do veículo" on storage.objects for insert to authenticated
with check (bucket_id = 'vehicle-docs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Usuário remove seus anexos do veículo" on storage.objects;
create policy "Usuário remove seus anexos do veículo" on storage.objects for delete to authenticated
using (bucket_id = 'vehicle-docs' and (storage.foldername(name))[1] = auth.uid()::text);
