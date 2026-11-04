create table public.crewmates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 32),
  role text not null check (role in ('pilot', 'engineer', 'medic', 'scout')),
  specialty text not null check (
    (role = 'pilot' and specialty in ('Navigation', 'Evasive Flying', 'Star Mapping')) or
    (role = 'engineer' and specialty in ('Reactor Systems', 'Robotics', 'Repairs')) or
    (role = 'medic' and specialty in ('Field Care', 'Xenobiology', 'Diagnostics')) or
    (role = 'scout' and specialty in ('Recon', 'Linguistics', 'Survival'))
  ),
  color text not null check (color in ('cyan', 'coral', 'violet', 'gold')),
  note text not null default '' check (char_length(note) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index crewmates_user_created_idx
  on public.crewmates (user_id, created_at desc, id desc);

create function public.set_crewmates_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger crewmates_updated_at
before update on public.crewmates
for each row execute function public.set_crewmates_updated_at();

alter table public.crewmates enable row level security;
revoke all on table public.crewmates from anon, authenticated;
grant select, insert, update, delete on table public.crewmates to authenticated;

create policy "Crew owners can read their crewmates"
on public.crewmates for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Crew owners can create crewmates"
on public.crewmates for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Crew owners can update their crewmates"
on public.crewmates for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Crew owners can delete their crewmates"
on public.crewmates for delete to authenticated
using ((select auth.uid()) = user_id);
