import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

function isSuperAdmin(user) {
  return user?.role === "SUPER_ADMIN";
}

function getVisibleUserWhereClause(actor) {
  if (isSuperAdmin(actor)) return {};
  return { NOT: { role: "SUPER_ADMIN" } };
}

async function getTargetUserOrThrow(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found.");
  return user;
}

function assertCanManageRole(actor, targetRole, actionLabel) {
  if (targetRole === "SUPER_ADMIN" && !isSuperAdmin(actor)) {
    throw new Error(`Only super admins can ${actionLabel} super admin accounts.`);
  }
}

function assertCanManageUser(actor, targetUser, actionLabel) {
  if (targetUser.role === "SUPER_ADMIN" && !isSuperAdmin(actor)) {
    throw new Error(`Only super admins can ${actionLabel} super admin accounts.`);
  }
}

/**
 * Fetch all users for administrative purposes.
 */
export async function fetchAllUsers(actor) {
  return prisma.user.findMany({
    where: getVisibleUserWhereClause(actor),
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, documents: true, referralCode: true, referredByCode: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Create a new user (Admin action).
 */
export async function insertUser(data, actor) {
  const { name, email, password, role, phone } = data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User with this email already exists.");
  const normalizedRole = role || "USER";
  assertCanManageRole(actor, normalizedRole, "create");
  
  const hashedPassword = await bcrypt.hash(password, 12);
  return prisma.user.create({
    data: { 
      name, 
      email: email.toLowerCase().trim(), 
      phone,
      passwordHash: hashedPassword, 
      role: normalizedRole,
    },
    select: { id: true, name: true, email: true, role: true }
  });
}

/**
 * Update an existing user.
 */
export async function modifyUser(id, data, actor) {
  const targetUser = await getTargetUserOrThrow(id);
  assertCanManageUser(actor, targetUser, "edit");

  const { name, email, role, phone, password } = data;
  const updateData = { 
    name, 
    email: email?.toLowerCase().trim(), 
    phone
  };

  if (role !== undefined) {
    assertCanManageRole(actor, role, "assign");
    updateData.role = role;
  }
  
  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 12);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, phone: true, role: true }
  });
}

/**
 * Delete a user.
 */
export async function removeUser(id, requestingUser) {
  if (id === requestingUser.id) throw new Error("You cannot delete your own account.");

  // Fetch the user to get their basic info
  const user = await getTargetUserOrThrow(id);
  assertCanManageUser(requestingUser, user, "delete");

  // Fetch all related data before deletion (including records matched by email!)
  const [leads, registrationLeads, documents, paymentRecords, messages, leadNotes, referrals, rewardRedemptions] = await Promise.all([
    prisma.lead.findMany({ where: { OR: [{ userId: id }, { email: user.email }] } }),
    prisma.registrationLead.findMany({ where: { OR: [{ userId: id }, { email: user.email }] } }),
    prisma.userDocument.findMany({ where: { userId: id } }),
    prisma.paymentRecord.findMany({ where: { OR: [{ userId: id }, { customerEmail: user.email }] } }),
    prisma.message.findMany({ where: { OR: [{ senderId: id }, { receiverId: id }] } }),
    prisma.leadNote.findMany({ where: { userId: id } }),
    prisma.referral.findMany({
      where: {
        OR: [
          { referrerUserId: id },
          { friendUserId: id },
          { referrerEmail: user.email },
          { friendEmail: user.email },
          user.phone ? { referrerPhone: user.phone } : undefined,
          user.phone ? { friendPhone: user.phone } : undefined,
        ].filter(Boolean),
      },
    }),
    prisma.referralRewardRedemption.findMany({ where: { userId: id } }),
  ]);

  // Create Archive Record
  await prisma.archivedData.create({
    data: {
      originalUserId: user.id,
      userEmail: user.email,
      userName: user.name,
      dataType: "USER_DELETION",
      deletedByAdminId: requestingUser.id,
      data: {
        user,
        leads,
        registrationLeads,
        documents,
        paymentRecords,
        messages,
        leadNotes,
        referrals,
        rewardRedemptions
      }
    }
  });

  // Execute Cascading Delete
  // Order matters due to foreign keys. Delete children first.
  const leadIds = leads.map(l => l.id);
  const regIds = registrationLeads.map(r => r.id);
  const paymentIds = paymentRecords.map(p => p.id);
  
  await prisma.$transaction([
    prisma.lead.updateMany({ where: { assignedToId: id }, data: { assignedToId: null } }),
    prisma.registrationLead.updateMany({ where: { assignedToId: id }, data: { assignedToId: null } }),
    prisma.leadNote.deleteMany({ where: { OR: [{ userId: id }, { leadId: { in: leadIds } }] } }),
    prisma.userDocument.deleteMany({ where: { OR: [{ userId: id }, { leadId: { in: leadIds } }, { registrationId: { in: regIds } }] } }),
    prisma.message.deleteMany({ where: { OR: [{ senderId: id }, { receiverId: id }, { leadId: { in: leadIds } }, { registrationId: { in: regIds } }] } }),
    prisma.referralRewardRedemption.deleteMany({ where: { OR: [{ userId: id }, { paymentRecordId: { in: paymentIds } }] } }),
    prisma.paymentRecord.deleteMany({ where: { OR: [{ userId: id }, { customerEmail: user.email }, { leadId: { in: leadIds } }, { registrationId: { in: regIds } }] } }),
    prisma.referral.deleteMany({
      where: {
        OR: [
          { referrerUserId: id },
          { friendUserId: id },
          { referrerEmail: user.email },
          { friendEmail: user.email },
          user.phone ? { referrerPhone: user.phone } : undefined,
          user.phone ? { friendPhone: user.phone } : undefined,
        ].filter(Boolean),
      },
    }),
    prisma.referrer.deleteMany({ where: { OR: [{ email: user.email }, user.phone ? { phone: user.phone } : undefined, { phone: user.id }].filter(Boolean) } }),
    prisma.lead.deleteMany({ where: { OR: [{ userId: id }, { email: user.email }] } }),
    prisma.registrationLead.deleteMany({ where: { OR: [{ userId: id }, { email: user.email }] } }),
    prisma.user.delete({ where: { id } })
  ]);

  return { deleted: true, archivedEmail: user.email };
}

/**
 * Search users by name or email.
 */
export async function findUsers(query, actor) {
  return prisma.user.findMany({
    where: {
      ...getVisibleUserWhereClause(actor),
      OR: [
        { name: { contains: query } },
        { email: { contains: query } }
      ]
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    take: 20
  });
}
