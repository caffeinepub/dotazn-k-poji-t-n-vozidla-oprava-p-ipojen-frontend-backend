# Specification

## Summary
**Goal:** Restore admin-page form submission by making frontend actor initialization resilient when backend access control is already initialized.

**Planned changes:**
- Update the frontend actor creation flow to catch and ignore the specific error thrown by `initializeAccessControl()` (or `_initializeAccessControlWithSecret(...)` when used) when access control is already initialized, and still return a usable actor.
- Keep all backend code and interfaces unchanged; limit frontend changes strictly to what’s necessary to fix the /admin form submission path.

**User-visible outcome:** After logging in via Internet Identity, submitting the form on `/admin` successfully calls the existing backend `createForm` method and shows the existing success behavior (no “not connected to backend” error).
