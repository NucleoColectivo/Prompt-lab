/**
 * Phase 0 Payload-First Security TDD Suite for Firestore Rules
 * Verifies all 12 "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 *
 * Run against the Firebase Emulator Suite with @firebase/rules-unit-testing
 * when validating rules locally.
 */

export interface AdversarialTestCase {
  id: number;
  name: string;
  pillar: string;
  actor: {
    uid: string | null;
    email?: string;
    email_verified?: boolean;
  };
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  payload?: Record<string, unknown>;
  batchedSibling?: boolean;
  expected: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: AdversarialTestCase[] = [
  {
    id: 1,
    name: 'Identity Spoofing on Create (mismatched authorUid)',
    pillar: 'Pillar 2 - Identity Integrity',
    actor: { uid: 'alice_uid', email: 'alice@example.com', email_verified: true },
    operation: 'create',
    path: '/workshop_posts/post-spoof-1',
    batchedSibling: true,
    payload: {
      authorUid: 'bob_uid',
      authorName: 'Alice',
      title: 'Spoofed authorship post',
      category: 'Imagen IA',
      contentType: 'link',
      externalUrl: 'https://example.com/work',
      status: 'published',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Email Write Attempt',
    pillar: 'Verified Users Mandate',
    actor: { uid: 'unverified_uid', email: 'unverified@example.com', email_verified: false },
    operation: 'create',
    path: '/workshop_posts/post-unverified-2',
    batchedSibling: true,
    payload: {
      authorUid: 'unverified_uid',
      authorName: 'Unverified User',
      title: 'Unverified Post',
      category: 'Imagen IA',
      contentType: 'link',
      externalUrl: 'https://example.com',
      status: 'published',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow / Ghost Field Injection (isFeatured + raw authorEmail)',
    pillar: 'Pillar 2 & 6 - Strict Keys & PII Isolation',
    actor: { uid: 'alice_uid', email: 'alice@example.com', email_verified: true },
    operation: 'create',
    path: '/workshop_posts/post-shadow-3',
    batchedSibling: true,
    payload: {
      authorUid: 'alice_uid',
      authorName: 'Alice',
      authorEmail: 'alice@example.com',
      isFeatured: true,
      title: 'Ghost field injection',
      category: 'Imagen IA',
      contentType: 'link',
      externalUrl: 'https://example.com',
      status: 'published',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Forged Client Timestamp on Create',
    pillar: 'Temporal Integrity (request.time)',
    actor: { uid: 'alice_uid', email: 'alice@example.com', email_verified: true },
    operation: 'create',
    path: '/workshop_posts/post-time-4',
    batchedSibling: true,
    payload: {
      authorUid: 'alice_uid',
      authorName: 'Alice',
      title: 'Backdated Post',
      category: 'Imagen IA',
      contentType: 'link',
      externalUrl: 'https://example.com',
      status: 'published',
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Orphaned Post Without Atomic WorkshopContact Batch',
    pillar: 'Pillar 7 - Atomicity Guarantee (existsAfter)',
    actor: { uid: 'alice_uid', email: 'alice@example.com', email_verified: true },
    operation: 'create',
    path: '/workshop_posts/post-orphan-5',
    batchedSibling: false,
    payload: {
      authorUid: 'alice_uid',
      authorName: 'Alice',
      title: 'Orphaned Post',
      category: 'Imagen IA',
      contentType: 'link',
      externalUrl: 'https://example.com',
      status: 'published',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'PII Blanket Read Attack on WorkshopContact by Non-Owner',
    pillar: 'Pillar 6 - PII Isolation',
    actor: { uid: 'bob_uid', email: 'bob@example.com', email_verified: true },
    operation: 'get',
    path: '/workshop_contacts/alice-existing-post',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Admin Email Spoofing With email_verified: false',
    pillar: 'Email Spoofing Guard',
    actor: {
      uid: 'attacker_uid',
      email: 'nucleo.colectivo.art@gmail.com',
      email_verified: false,
    },
    operation: 'list',
    path: '/workshop_contacts',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Document ID Poisoning (Oversized / Invalid Chars)',
    pillar: 'Pillar 3 - Path Variable Hardening',
    actor: { uid: 'alice_uid', email: 'alice@example.com', email_verified: true },
    operation: 'create',
    path: `/workshop_posts/${'a'.repeat(150)}!invalid$id`,
    batchedSibling: true,
    payload: {
      authorUid: 'alice_uid',
      authorName: 'Alice',
      title: 'Poisoned ID',
      category: 'Imagen IA',
      contentType: 'link',
      externalUrl: 'https://example.com',
      status: 'published',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Denial-of-Wallet Overflow & XSS Protocol in externalUrl',
    pillar: 'Pillar 2 & 3 - Mandatory Size & Protocol Bounds',
    actor: { uid: 'alice_uid', email: 'alice@example.com', email_verified: true },
    operation: 'create',
    path: '/workshop_posts/post-xss-9',
    batchedSibling: true,
    payload: {
      authorUid: 'alice_uid',
      authorName: 'Alice',
      title: 'T'.repeat(250),
      category: 'Proyecto Web',
      contentType: 'link',
      externalUrl: 'javascript:alert(1)',
      status: 'published',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Immutable Field Tampering on Update (authorUid / createdAt)',
    pillar: 'Immortal Field Rule & Action-Based Update',
    actor: { uid: 'alice_uid', email: 'alice@example.com', email_verified: true },
    operation: 'update',
    path: '/workshop_posts/alice-existing-post',
    payload: {
      authorUid: 'bob_uid',
      title: 'Hijacked Post',
      updatedAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Terminal State Resurrection (archived -> published by non-admin)',
    pillar: 'Terminal State Locking',
    actor: { uid: 'alice_uid', email: 'alice@example.com', email_verified: true },
    operation: 'update',
    path: '/workshop_posts/alice-archived-post',
    payload: {
      status: 'published',
      updatedAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Self-Assigned Admin Role Escalation',
    pillar: 'Anti-Self-Assigned Roles',
    actor: { uid: 'alice_uid', email: 'alice@example.com', email_verified: true },
    operation: 'create',
    path: '/admins/alice_uid',
    payload: {
      uid: 'alice_uid',
      role: 'admin',
      createdAt: 'SERVER_TIMESTAMP',
    },
    expected: 'PERMISSION_DENIED',
  },
];
