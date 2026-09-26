import "server-only";
import { ordersForUser } from "../repositories/orders";
import { deleteUser } from "../repositories/users";
import { getEntitlements } from "./entitlements";

/** Everything the account page shows: the plan and the purchase history. */
export async function accountOverview(userId: string) {
  const [entitlements, orders] = await Promise.all([getEntitlements(userId), ordersForUser(userId)]);
  return { entitlements, orders };
}

/** Deletes the account and everything attached to it (orders, plans, credits, hands). */
export const deleteAccount = (userId: string) => deleteUser(userId);
