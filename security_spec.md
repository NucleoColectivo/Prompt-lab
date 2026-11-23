# Security Specification — Núcleo Colectivo Workshop Blog (Phase 0 TDD)

## 1. Data Invariants

1. **Default-Deny Catch-All**: Any path outside `/workshop_posts/{postId}`, `/workshop_contacts/{postId}`, and `/admins/{userId}` is strictly denied (`allow read, write: if false`).
2. **PII Isolation (Split Collection)**: Raw attendee emails are NEVER stored in `/workshop_posts/{postId}`. Emails exist exclusively in `/workshop_contacts/{postId}`, which is readable ONLY by the document owner (`authorUid == request.auth.uid`) or verified admin (`nucleo.colectivo.art@gmail.com` with `email_verified == true`).
3. **Atomic Pairing (`existsAfter`)**: Creating a `WorkshopPost` requires atomically creating its matching `WorkshopContact` in the same batch (and vice versa), preventing orphaned contact records or unattributed posts.
4. **Verified Identity Integrity**: All writes require `request.auth != null && request.auth.token.email_verified == true`. On creation, `authorUid` MUST equal `request.auth.uid`.
5. **Immutable Audit Fields & Server Timestamps**: `authorUid` and `createdAt` are immutable on update. `createdAt == request.time` on create; `updatedAt == request.time` on create and update.
6. **Terminal State Locking**: Once a `WorkshopPost` transitions to `status == 'archived'`, non-admin users cannot reactivate or edit it.
7. **Strict Schema & Size Guards**: Every string field has explicit `.size()` bounds; every single-doc operation validates `isValidId(id)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars); `mediaDataUrl` is restricted to `data:image/(jpeg|png|webp);base64,` and capped at 380,000 chars.
8. **Query Enforcer (Zero Client Trust)**: `allow list` never uses blanket `isSignedIn()` and never executes `get()`/`exists()`. Public listing requires `existing().status == 'published'`.

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Attack Vector | Collection | Expected Result |
|---|---|---|---|
| 1 | **Identity Spoofing on Create**: Signed-in user `alice` creates post with `authorUid: "bob"` | `workshop_posts/post-1` | `PERMISSION_DENIED` |
| 2 | **Unverified Email Write**: User with `email_verified: false` attempts to publish a post | `workshop_posts/post-2` | `PERMISSION_DENIED` |
| 3 | **Shadow / Ghost Field Injection**: Valid post payload plus `isFeatured: true` or `authorEmail: "leak@x.com"` | `workshop_posts/post-3` | `PERMISSION_DENIED` |
| 4 | **Forged Client Timestamp**: Create post with `createdAt: Timestamp(2020-01-01)` instead of `request.time` | `workshop_posts/post-4` | `PERMISSION_DENIED` |
| 5 | **Orphaned Post (Atomicity Bypass)**: Create `workshop_posts/post-5` without batched `workshop_contacts/post-5` | `workshop_posts/post-5` | `PERMISSION_DENIED` |
| 6 | **PII Blanket Read Attack**: Authenticated user `bob` attempts `get` on `workshop_contacts/alice-post` | `workshop_contacts/alice-post` | `PERMISSION_DENIED` |
| 7 | **Admin Email Spoofing**: User with `email: "nucleo.colectivo.art@gmail.com"` and `email_verified: false` tries to list `workshop_contacts` | `workshop_contacts` | `PERMISSION_DENIED` |
| 8 | **ID Poisoning Attack**: Document ID containing 200+ junk characters or `/` / `$` symbols | `workshop_posts/bad$id...` | `PERMISSION_DENIED` |
| 9 | **Denial-of-Wallet String Overflow**: `title` > 140 chars or `mediaDataUrl` > 380,000 chars or `javascript:` URL | `workshop_posts/post-9` | `PERMISSION_DENIED` |
| 10 | **Immutable Field Tampering**: Owner updates `authorUid` or `createdAt` on an existing post | `workshop_posts/alice-post` | `PERMISSION_DENIED` |
| 11 | **Terminal State Resurrection**: Owner tries to change `status` from `'archived'` back to `'published'` | `workshop_posts/archived-post` | `PERMISSION_DENIED` |
| 12 | **Self-Assigned Admin Escalation**: Regular user writes `/admins/{theirUid}` with `{ role: "admin" }` | `admins/alice` | `PERMISSION_DENIED` |
