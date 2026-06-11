import { prisma } from "../config/db.js";
import { normalizePhone, optionalString, requireString } from "../utils/core.js";
import { alertNewReferral } from "./adminAlerts.js";

/**
 * Creates a new referral entry.
 */
export async function insertReferral(data) {
  const referrerName = requireString(data, ["referrerName", "name"], "Referrer name");
  const referrerPhone = normalizePhone(requireString(data, ["referrerPhone", "phone"], "Referrer phone"));
  const referrerEmail = optionalString(data.referrerEmail) || optionalString(data.email);

  const referrer = await prisma.referrer.upsert({
    where: { phone: referrerPhone },
    update: {
      totalReferred: { increment: 1 },
      name: referrerName,
      ...(referrerEmail && { email: referrerEmail }),
    },
    create: {
      name: referrerName,
      phone: referrerPhone,
      email: referrerEmail,
      totalReferred: 1,
    }
  });
  const referrerUser = await prisma.user.findFirst({
    where: {
      OR: [
        referrerEmail ? { email: referrerEmail } : undefined,
        referrerPhone ? { phone: referrerPhone } : undefined,
      ].filter(Boolean),
    },
    select: { id: true },
  });
  const friendEmail = optionalString(data.friendEmail);
  const friendPhone = normalizePhone(requireString(data, ["friendPhone"], "Friend phone"));
  const friendUser = await prisma.user.findFirst({
    where: {
      OR: [
        friendEmail ? { email: friendEmail } : undefined,
        friendPhone ? { phone: friendPhone } : undefined,
      ].filter(Boolean),
    },
    select: { id: true },
  });

  return prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referrerUserId: referrerUser?.id,
      friendUserId: friendUser?.id,
      referrerName: referrerName,
      referrerPhone: referrerPhone,
      referrerEmail: referrerEmail,
      friendName: requireString(data, ["friendName"], "Friend name"),
      friendPhone,
      friendEmail,
      serviceName: optionalString(data.serviceName) || optionalString(data.service),
      message: optionalString(data.message),
    },
  });

  // Send admin notification
  await alertNewReferral(data);

  return referral;
}

/**
 * Fetches all referrals for a given user based on their registered email or phone.
 */
export async function fetchUserReferrals(user) {
  if (!user) return [];
  await ensureReferralLogsForReferrer(user);
  const OR = [];
  if (user.id) OR.push({ referrerUserId: user.id });
  if (user.email) OR.push({ referrerEmail: user.email });
  if (user.phone) OR.push({ referrerPhone: user.phone });
  if (user.id) OR.push({ message: { contains: `referrer user ${user.id}` } });

  if (OR.length === 0) return [];

  return prisma.referral.findMany({
    where: { OR },
    orderBy: { createdAt: "desc" }
  });
}

export async function ensureReferralLogsForReferrer(user) {
  if (!user?.id || !user?.referralCode) return;

  const referredUsers = await prisma.user.findMany({
    where: { referredByCode: user.referralCode },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });
  if (referredUsers.length === 0) return;

  const referrer = await prisma.referrer.upsert({
    where: { phone: user.phone || user.id },
    update: {
      name: user.name,
      ...(user.email && { email: user.email }),
    },
    create: {
      name: user.name,
      phone: user.phone || user.id,
      email: user.email,
      totalReferred: 0,
    },
  });

  let createdCount = 0;
  for (const referredUser of referredUsers) {
    const existing = await prisma.referral.findFirst({
      where: {
        OR: [
          { friendUserId: referredUser.id },
          referredUser.email ? { friendEmail: referredUser.email, referrerUserId: user.id } : undefined,
        ].filter(Boolean),
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.referral.update({
        where: { id: existing.id },
        data: {
          referrerId: referrer.id,
          referrerUserId: user.id,
          friendUserId: referredUser.id,
          referrerName: user.name,
          referrerPhone: user.phone || "",
          referrerEmail: user.email,
        },
      });
      continue;
    }

    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referrerUserId: user.id,
        friendUserId: referredUser.id,
        referrerName: user.name,
        referrerPhone: user.phone || "",
        referrerEmail: user.email,
        friendName: referredUser.name,
        friendPhone: referredUser.phone || "",
        friendEmail: referredUser.email,
        serviceName: "User Sign Up",
        message: `User registered using referral code ${user.referralCode} via direct sharing link for referrer user ${user.id}.`,
        status: "NEW",
        createdAt: referredUser.createdAt,
      },
    });
    createdCount += 1;
  }

  if (createdCount > 0) {
    await prisma.referrer.update({
      where: { id: referrer.id },
      data: { totalReferred: { increment: createdCount } },
    });
  }
}

export async function getActiveRewardSetting() {
  const settings = await prisma.referralRewardSetting.findMany({
    where: { isActive: true },
    orderBy: [{ requiredReferrals: "asc" }, { updatedAt: "desc" }],
  });

  if (settings.length > 0) return settings[0];

  return prisma.referralRewardSetting.create({
    data: {
      title: "Refer 5 friends, get 20% off any one service",
      requiredReferrals: 5,
      discountPercent: 20,
      isActive: true,
    },
  });
}

export async function getActiveRewardSettings() {
  let settings = await prisma.referralRewardSetting.findMany({
    where: { isActive: true },
    orderBy: [{ requiredReferrals: "asc" }, { discountPercent: "asc" }, { updatedAt: "desc" }],
  });

  if (settings.length === 0) {
    const defaultSetting = await prisma.referralRewardSetting.create({
      data: {
        title: "Refer 5 friends, get 20% off any one service",
        requiredReferrals: 5,
        discountPercent: 20,
        isActive: true,
      },
    });
    settings = [defaultSetting];
  }

  return settings;
}

export async function saveRewardSetting(data) {
  const requiredReferrals = Number.parseInt(data.requiredReferrals, 10);
  const discountPercent = Number.parseInt(data.discountPercent, 10);
  const title = optionalString(data.title) || `Refer ${requiredReferrals || 5} friends, get ${discountPercent || 20}% off`;

  if (!Number.isInteger(requiredReferrals) || requiredReferrals < 1) {
    throw new Error("Required referrals must be at least 1.");
  }
  if (!Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 100) {
    throw new Error("Discount percent must be between 1 and 100.");
  }

  const existing = await prisma.referralRewardSetting.findFirst({
    where: { requiredReferrals, isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  if (existing) {
    return prisma.referralRewardSetting.update({
      where: { id: existing.id },
      data: {
        title,
        discountPercent,
        isActive: data.isActive !== false,
      },
    });
  }

  return prisma.referralRewardSetting.create({
    data: {
      title,
      requiredReferrals,
      discountPercent,
      isActive: data.isActive !== false,
    },
  });
}

export async function getRewardSummaryForUser(userId) {
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, referralCode: true },
  });
  if (!user) return null;

  const settings = await getActiveRewardSettings();
  const OR = [];
  OR.push({ referrerUserId: user.id });
  if (user.email) OR.push({ referrerEmail: user.email });
  if (user.phone) OR.push({ referrerPhone: user.phone });
  if (user.id) OR.push({ message: { contains: `referrer user ${user.id}` } });
  await ensureReferralLogsForReferrer(user);

  const [completedReferrals, redemptions] = await Promise.all([
    OR.length
      ? prisma.referral.count({
          where: {
            OR,
            status: { not: "REJECTED" },
          },
        })
      : 0,
    prisma.referralRewardRedemption.findMany({
      where: {
        userId: user.id,
        rewardSettingId: { in: settings.map((setting) => setting.id) },
      },
      select: { rewardSettingId: true },
    }),
  ]);

  const redeemedSettingIds = new Set(redemptions.map((redemption) => redemption.rewardSettingId));
  const tiers = settings.map((setting) => ({
    ...setting,
    unlocked: completedReferrals >= setting.requiredReferrals,
    redeemed: redeemedSettingIds.has(setting.id),
    referralsRemaining: Math.max(setting.requiredReferrals - completedReferrals, 0),
  }));
  const availableTiers = tiers.filter((tier) => tier.unlocked && !tier.redeemed);
  const bestAvailableReward = [...availableTiers].sort((a, b) => {
    if (b.discountPercent !== a.discountPercent) return b.discountPercent - a.discountPercent;
    return b.requiredReferrals - a.requiredReferrals;
  })[0] || null;
  const nextReward = tiers.find((tier) => !tier.unlocked) || null;

  return {
    setting: bestAvailableReward || nextReward || tiers[tiers.length - 1] || null,
    rewardSettings: tiers,
    completedReferrals,
    redeemedCount: redemptions.length,
    availableRewards: availableTiers.length,
    bestAvailableReward,
    nextReward,
    referralsUntilNextReward: bestAvailableReward ? 0 : (nextReward?.referralsRemaining || 0),
  };
}

export function parseCurrencyAmount(value) {
  const number = Number.parseFloat(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : null;
}

export function calculateRewardDiscount(amount, discountPercent) {
  const numericAmount = parseCurrencyAmount(amount);
  if (numericAmount === null) return null;
  const discountAmount = Number(((numericAmount * discountPercent) / 100).toFixed(2));
  const finalAmount = Number(Math.max(numericAmount - discountAmount, 0).toFixed(2));
  return { originalAmount: numericAmount, discountAmount, finalAmount };
}

export async function buildPaymentRewardPreview({ userId, amount }) {
  const numericAmount = parseCurrencyAmount(amount);
  if (!userId || numericAmount === null) {
    return { eligible: false, reason: "Reward discounts apply only to fixed-price service plans." };
  }

  const summary = await getRewardSummaryForUser(userId);
  if (!summary?.setting) return { eligible: false };

  const selectedSetting = summary.bestAvailableReward || null;
  const discount = selectedSetting ? calculateRewardDiscount(numericAmount, selectedSetting.discountPercent) : null;
  const eligible = !!selectedSetting && !!discount;

  return {
    eligible,
    reason: eligible ? null : "No unused referral reward is available yet.",
    setting: selectedSetting || summary.setting,
    rewardSettings: summary.rewardSettings,
    completedReferrals: summary.completedReferrals,
    requiredReferrals: (selectedSetting || summary.setting).requiredReferrals,
    availableRewards: summary.availableRewards,
    referralsUntilNextReward: summary.referralsUntilNextReward,
    discountPercent: (selectedSetting || summary.setting).discountPercent,
    originalAmount: numericAmount,
    discountAmount: discount?.discountAmount || 0,
    finalAmount: discount?.finalAmount ?? numericAmount,
  };
}

export async function markCompletedForPayingReferredUser(user) {
  if (!user?.referredByCode) return;

  const referrer = await prisma.user.findUnique({
    where: { referralCode: user.referredByCode },
    select: { id: true, name: true, email: true, phone: true },
  });
  if (!referrer) return;

  const friendOr = [
    user.email ? { friendEmail: user.email } : undefined,
    user.phone ? { friendPhone: user.phone } : undefined,
  ].filter(Boolean);
  if (friendOr.length === 0) return;

  await prisma.referral.updateMany({
    where: {
      status: { in: ["NEW", "CONTACTED", "CONVERTED"] },
      AND: [
        { OR: friendOr },
        {
          OR: [
            { referrerUserId: referrer.id },
            { referrerEmail: referrer.email },
          ],
        },
      ],
    },
    data: { status: "COMPLETED" },
  });
}

/**
 * Updates a referral's reward qualification status.
 */
export async function updateStatus(id, status) {
  if (!id) throw new Error("Referral ID is required.");
  if (!status) throw new Error("Status is required.");

  return prisma.referral.update({
    where: { id },
    data: { status },
  });
}
