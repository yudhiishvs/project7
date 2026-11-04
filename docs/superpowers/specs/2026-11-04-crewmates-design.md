# Crewmates design

## Intent

Build the Unit 7 Crewmates assignment as a space crew roster. A visitor can create a crewmate, browse the newest first, open a unique detail URL, edit attributes, and delete the crewmate. A Supabase project stores each visitor's crew when configured.

## Goals

- Meet every required CRUD and routing feature in the pasted brief.
- Use `@supabase/supabase-js` for database operations.
- Make the app usable for review before Supabase credentials are supplied through a clearly labeled browser-local demo mode.
- Include setup instructions, the database schema, a feature checklist, and a GIF walkthrough in the README.
- Add stretch features: role-specific specialties, crew statistics, and a readiness score.

## Constraints and calls

- The workspace contains no Crewmates project or Supabase credentials. Create a separate project under `crewmates/`.
- Use React, Vite, React Router, and Supabase JavaScript. The direct request to build the pasted assignment supplies the execution direction; the theme and stack are implementation choices.
- Use anonymous Supabase Auth and row-level security so crews are private to the browser's anonymous user. Clearing that browser's data loses access to its anonymous account.
- When environment values are absent, use localStorage and label the experience as demo mode. If configured Supabase fails, show the error and a retry action; never silently switch storage.
- Do not commit credentials. Use a publishable key in a Vite environment variable and a checked-in example file.
- A private GitHub repository and collaborator invitation depend on external account access. Keep the local Git history ready and complete those steps if available.

## Experience

- Home: mission-themed introduction and clear actions to assemble a crew or view the roster.
- Create: name, role, role-specific specialty, suit color, and a short personal note. Options are chosen by buttons/radio controls.
- Gallery: cards sorted by `created_at` descending, edit control on each card, empty state, role distribution, and readiness metric.
- Detail: direct `/crew/:id` URL with all attributes, joined date, note, and edit action.
- Edit: existing values prefilled. Save stays on the form and shows the updated values; delete removes the record and returns to the gallery.
- Missing record and request failure states have explicit copy and navigation.

## Approaches considered

1. **React/Vite + Supabase with labeled local demo (chosen):** meets the database requirement once configured and allows immediate local review; adds a small storage adapter.
2. **Supabase only:** less code, but no usable app or walkthrough without project credentials.
3. **Browser storage only:** works immediately but misses the central assignment goal.

## Data and behavior

`crewmates`: `id` UUID, `user_id` UUID, `name`, `role`, `specialty`, `color`, `note`, `created_at`, `updated_at`. Supabase assigns IDs and timestamps. The client validates names and category-specific specialties. The database enforces basic lengths and allowed values. RLS permits the authenticated anonymous user to read and change only owned rows. The list queries newest first, with `id` as a stable tie-breaker.

The demo adapter exposes the same `list`, `get`, `create`, `update`, and `remove` methods and stores records in localStorage. It generates UUIDs and timestamps. UI state updates after successful writes, and errors remain visible without losing form input.
