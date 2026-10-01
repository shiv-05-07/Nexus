import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const profileRouter = Router();

export type UserRole = 'lead_analyst' | 'analyst' | 'viewer';

export interface UserRolePermissions {
  canConfirmSignal: boolean;
  canVerifyRecord: boolean;
  canExportData: boolean;
  canViewIntelligence: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  callsign: string;
  clearance: string;
  avatarInitials: string;
  permissions: UserRolePermissions;
}

const ROLE_CONFIGS: Record<UserRole, {
  label: string;
  callsign: string;
  clearance: string;
  avatar: string;
  permissions: UserRolePermissions;
}> = {
  lead_analyst: {
    label: 'Lead Analyst',
    callsign: 'AN-9042',
    clearance: 'SEC-04',
    avatar: 'LA',
    permissions: {
      canConfirmSignal: true,
      canVerifyRecord: true,
      canExportData: true,
      canViewIntelligence: true,
    },
  },
  analyst: {
    label: 'Analyst',
    callsign: 'AN-5120',
    clearance: 'SEC-02',
    avatar: 'AN',
    permissions: {
      canConfirmSignal: true,
      canVerifyRecord: true,
      canExportData: true,
      canViewIntelligence: true,
    },
  },
  viewer: {
    label: 'Viewer (Read-Only)',
    callsign: 'RO-0104',
    clearance: 'READ-ONLY',
    avatar: 'VR',
    permissions: {
      canConfirmSignal: false,
      canVerifyRecord: false,
      canExportData: false,
      canViewIntelligence: true,
    },
  },
};

// In-memory active session profile default
let activeRole: UserRole = 'lead_analyst';

export function getEffectiveRole(req: Request): UserRole {
  // 1. Explicit request header
  const headerRole = req.headers['x-user-role'] as string | undefined;
  if (headerRole) {
    const normalized = headerRole.toLowerCase().trim().replace('-', '_');
    if (normalized === 'viewer') return 'viewer';
    if (normalized === 'analyst') return 'analyst';
    if (normalized === 'lead_analyst' || normalized === 'leadanalyst') return 'lead_analyst';
  }

  // 2. Request body parameter
  if (req.body && req.body.role) {
    const bodyRole = String(req.body.role).toLowerCase().trim().replace('-', '_');
    if (bodyRole === 'viewer') return 'viewer';
    if (bodyRole === 'analyst') return 'analyst';
    if (bodyRole === 'lead_analyst') return 'lead_analyst';
  }

  // 3. Fallback to active server role
  return activeRole;
}

export function buildProfile(role: UserRole): UserProfile {
  const config = ROLE_CONFIGS[role];
  return {
    id: `usr-${role}`,
    name: role === 'viewer' ? 'Guest Observer' : role === 'analyst' ? 'J. Mercer' : 'E. Vance',
    role,
    roleLabel: config.label,
    callsign: config.callsign,
    clearance: config.clearance,
    avatarInitials: config.avatar,
    permissions: config.permissions,
  };
}

/**
 * GET /api/profile
 * Returns active user profile with role permissions
 */
profileRouter.get('/', (req: Request, res: Response) => {
  const role = getEffectiveRole(req);
  res.json(buildProfile(role));
});

/**
 * POST /api/profile/role
 * Allows switching the active operational role
 */
profileRouter.post('/role', (req: Request, res: Response) => {
  const { role } = req.body;
  const normalized = String(role || '').toLowerCase().trim().replace('-', '_') as UserRole;
  if (normalized === 'viewer' || normalized === 'analyst' || normalized === 'lead_analyst') {
    activeRole = normalized;
    return res.json(buildProfile(activeRole));
  }

  return res.status(400).json({
    error: 'Invalid role specified. Supported: lead_analyst, analyst, viewer',
  });
});

/**
 * Confirmed Signals In-Memory / DB Audit Registry
 */
const confirmedSignals = new Map<string, { confirmedAt: string; confirmedBy: string }>();

/**
 * POST /api/signals/confirm (also mapped to /api/overview/confirm-signal)
 * Enforces server-side authorization: VIEWER ROLE IS FORBIDDEN
 */
export async function handleConfirmSignal(req: Request, res: Response) {
  const role = getEffectiveRole(req);

  // SERVER-SIDE AUTHORIZATION ENFORCEMENT
  if (role === 'viewer') {
    return res.status(403).json({
      error: 'Forbidden: Viewer role is not authorized to confirm signals',
      code: 'ROLE_UNAUTHORIZED',
      action: 'confirm_signal',
      role,
      allowed: false,
    });
  }

  const { signalId, id } = req.body;
  const targetId = signalId || id;

  if (!targetId) {
    return res.status(400).json({ error: 'signalId is required' });
  }

  const confirmedAt = new Date().toISOString();
  confirmedSignals.set(targetId, { confirmedAt, confirmedBy: role });

  // If topic exists in DB, update or record confirmation
  try {
    const topic = await prisma.topic.findFirst({
      where: {
        OR: [{ id: targetId }, { slug: targetId }],
      },
    });

    if (topic) {
      await prisma.topic.update({
        where: { id: topic.id },
        data: {
          metadata: {
            ...((topic.metadata as object) || {}),
            confirmed: true,
            confirmedAt,
            confirmedBy: role,
          },
        },
      });
    }
  } catch {
    // Non-fatal if schema metadata update encounters transient issue
  }

  return res.json({
    success: true,
    signalId: targetId,
    status: 'confirmed',
    confirmedAt,
    confirmedBy: role,
  });
}

/**
 * POST /api/records/verify (also mapped to /api/timeline/verify-record)
 * Enforces server-side authorization: VIEWER ROLE IS FORBIDDEN
 */
export async function handleVerifyRecord(req: Request, res: Response) {
  const role = getEffectiveRole(req);

  // SERVER-SIDE AUTHORIZATION ENFORCEMENT
  if (role === 'viewer') {
    return res.status(403).json({
      error: 'Forbidden: Viewer role is not authorized to verify records',
      code: 'ROLE_UNAUTHORIZED',
      action: 'verify_record',
      role,
      allowed: false,
    });
  }

  const { recordId, id } = req.body;
  const targetId = recordId || id;

  if (!targetId) {
    return res.status(400).json({ error: 'recordId is required' });
  }

  const verifiedAt = new Date().toISOString();

  // Update in database where post exists
  let updatedRecord = false;
  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id: targetId }, { platformPostId: targetId }],
      },
      include: { author: true },
    });

    if (post) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          rawMetadata: {
            ...((post.rawMetadata as object) || {}),
            verifiedRecord: true,
            verifiedAt,
            verifiedBy: role,
          },
        },
      });

      // Also ensure author verified status reflects verified record
      if (!post.author.verified) {
        await prisma.user.update({
          where: { id: post.authorId },
          data: { verified: true },
        });
      }
      updatedRecord = true;
    }
  } catch (err) {
    console.error('Error updating verified record in DB:', err);
  }

  return res.json({
    success: true,
    recordId: targetId,
    status: 'verified',
    updatedRecord,
    verifiedAt,
    verifiedBy: role,
  });
}

profileRouter.post('/confirm-signal', handleConfirmSignal);
profileRouter.post('/verify-record', handleVerifyRecord);
