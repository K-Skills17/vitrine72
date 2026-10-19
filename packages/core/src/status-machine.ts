/**
 * Project status machine.
 * Pure functions — no side effects, fully testable.
 */

export type ProjectStatus =
  | "paid"
  | "intake_pending"
  | "intake_complete"
  | "in_production"
  | "qa"
  | "preview_sent"
  | "revision_requested"
  | "revision_done"
  | "approved"
  | "live"
  | "maintenance"
  | "paused"
  | "refunded";

export type StatusTransition = {
  from: ProjectStatus;
  to: ProjectStatus;
};

/** All valid forward transitions */
const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  paid: ["intake_pending", "refunded", "paused"],
  intake_pending: ["intake_complete", "paused", "refunded"],
  intake_complete: ["in_production", "paused", "refunded"],
  in_production: ["qa", "paused", "refunded"],
  qa: ["preview_sent", "in_production", "paused", "refunded"],
  preview_sent: ["revision_requested", "approved", "paused", "refunded"],
  revision_requested: ["revision_done", "paused", "refunded"],
  revision_done: ["approved", "paused", "refunded"],
  approved: ["live", "paused", "refunded"],
  live: ["maintenance"],
  maintenance: ["live"],
  paused: ["intake_pending", "intake_complete", "in_production", "refunded"],
  refunded: [],
};

export type TransitionGuardContext = {
  qaReportPassed?: boolean;
  revisionCount?: number;
  goLiveEarliestAt?: Date;
  now?: Date;
  hasPendingBalance?: boolean;
};

export type GuardResult =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Check if a status transition is valid and all guards pass.
 */
export function canTransition(
  from: ProjectStatus,
  to: ProjectStatus,
  ctx: TransitionGuardContext = {}
): GuardResult {
  const allowed = VALID_TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    return {
      ok: false,
      reason: `Transition ${from} → ${to} is not allowed.`,
    };
  }

  if (to === "preview_sent") {
    if (!ctx.qaReportPassed) {
      return {
        ok: false,
        reason:
          "Cannot send preview: QA report has not passed. Run QA first.",
      };
    }
  }

  if (to === "revision_requested") {
    const count = ctx.revisionCount ?? 0;
    if (count >= 1) {
      return {
        ok: false,
        reason:
          "Only 1 revision round is allowed. Additional requests become paid edit tickets.",
      };
    }
  }

  if (to === "live") {
    const now = ctx.now ?? new Date();
    if (ctx.goLiveEarliestAt && now < ctx.goLiveEarliestAt) {
      return {
        ok: false,
        reason: `Site cannot go live before ${ctx.goLiveEarliestAt.toISOString()} (8-day hold after payment).`,
      };
    }
    if (ctx.hasPendingBalance) {
      return {
        ok: false,
        reason:
          "Cannot go live with an unpaid balance. Collect remaining payment first.",
      };
    }
  }

  return { ok: true };
}

/**
 * Attempt a transition, returning the new status or throwing.
 */
export function transition(
  current: ProjectStatus,
  target: ProjectStatus,
  ctx: TransitionGuardContext = {}
): ProjectStatus {
  const result = canTransition(current, target, ctx);
  if (!result.ok) throw new Error(result.reason);
  return target;
}

/** Statuses that represent an active (pre-live) project. */
export const ACTIVE_STATUSES: ProjectStatus[] = [
  "paid",
  "intake_pending",
  "intake_complete",
  "in_production",
  "qa",
  "preview_sent",
  "revision_requested",
  "revision_done",
  "approved",
];

/** Returns true if the project can be refunded from this status. */
export function canRefund(status: ProjectStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

/** Returns true if the project can be paused from this status. */
export function canPause(status: ProjectStatus): boolean {
  return (VALID_TRANSITIONS[status] ?? []).includes("paused");
}
