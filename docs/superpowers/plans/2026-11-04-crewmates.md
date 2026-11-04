# Crewmates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the Unit 7 Crewmates app with Supabase CRUD, direct detail URLs, and a local demo mode.

**Architecture:** React Router renders the five views. A repository interface isolates Supabase and demo storage. Shared form validation and roster calculations live in a small domain module. Supabase Auth and RLS separate each browser's crew.

**Tech Stack:** React, Vite, React Router, Supabase JavaScript, Vitest, Testing Library, CSS.

**Spec:** `docs/superpowers/specs/2026-11-04-crewmates-design.md`

## Global Constraints

- Keep secrets out of Git; use only the project URL and publishable key in the client.
- Supabase errors must remain visible and must not silently fall back to demo storage.
- Gallery order is `created_at` descending, then `id` descending.
- Edit keeps the user on the form with the saved values visible.

## Review Focus

- Blank or whitespace-only names: reject them and keep input intact.
- Role change: reset incompatible specialties and offer only valid choices.
- Corrupt demo storage: recover to an empty crew without crashing.
- Unknown detail ID: show a missing-record page, not a blank screen.
- Failed save/delete: show an error and do not claim success.

---

### Task 1: Domain and demo storage

**Files:** `src/domain/crew.js`, `src/domain/crew.test.js`, `src/data/demoCrewRepository.js`, `src/data/demoCrewRepository.test.js`.

**Interfaces:** `validateCrew(input)`, `specialtiesFor(role)`, `sortCrew(rows)`, `crewStats(rows)`, and `createDemoCrewRepository(storage)` returning async `list/get/create/update/remove` methods.

- [x] Write domain and demo storage tests for validation, newest-first order, role change, persistence, missing records, and corrupt storage.
- [x] Run tests and confirm expected failures.
- [x] Implement the domain and demo repository.
- [x] Run tests and confirm they pass.
- [x] Commit the milestone.

### Task 2: Supabase data path

**Files:** `src/data/supabaseCrewRepository.js`, `src/data/supabaseCrewRepository.test.js`, `supabase/migrations/20261104000000_create_crewmates.sql`, `.env.example`.

**Interfaces:** `createSupabaseCrewRepository(client)` exposes the same async methods as Task 1; `ensureSession()` restores or creates an anonymous session.

- [x] Write tests for auth bootstrap, filtered CRUD requests, and surfaced request errors.
- [x] Run tests and confirm expected failures.
- [x] Implement the adapter, SQL table, grants, and four RLS policies.
- [x] Run tests and confirm they pass.
- [x] Commit the milestone.

### Task 3: Screens and interactions

**Files:** `src/App.jsx`, `src/components/*`, `src/pages/*`, `src/styles.css`, `src/main.jsx`, `index.html`, `src/App.test.jsx`.

**Interfaces:** Routes `/`, `/create`, `/crew`, `/crew/:id`, `/crew/:id/edit`; create/edit/delete call the selected repository and refresh shared crew state.

- [x] Write UI tests for empty gallery, create, direct detail, edit, delete, and errors.
- [x] Run tests and confirm expected failures.
- [x] Implement accessible pages, state handling, responsive visuals, and title/metadata.
- [x] Run tests and confirm they pass.
- [x] Commit the milestone.

### Task 4: Delivery

**Files:** `README.md`, `public/walkthrough.gif`, package/config files.

- [x] Document Supabase setup, local demo, tests, feature checklist, and anonymous account limitation.
- [x] Run the full test suite and production build.
- [x] Exercise the main flows in a browser and capture a GIF walkthrough.
- [x] Commit the final milestone and create/invite to a private remote if account access permits.
