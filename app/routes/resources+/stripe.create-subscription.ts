import type { LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { authenticator } from "@/services/auth.server"
import { PLAN_INTERVALS } from "@/services/stripe/plans.config"
import { createStripeSubscription } from "@/services/stripe/stripe.server"
import { getFreePlan } from "@/models/plan"
import {
  createSubscription,
  getSubscriptionByUserId,
} from "@/models/subscription"
import { getUserById } from "@/models/user"
import { getUserCurrencyFromRequest } from "@/utils/currency"

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const user = await getUserById(session.id)
  if (!user) return redirect("/login")

  const subscription = await getSubscriptionByUserId(user.id)
  if (subscription?.id) return redirect("/dashboard")
  if (!user.customerId)
    throw new Error("User does not have a Stripe Customer ID.")

  // Get client's currency and Free Plan price ID.
  const currency = getUserCurrencyFromRequest(request)
  const planWithPrices = await getFreePlan()
  const freePlanPrice = planWithPrices?.prices.find(
    (price) =>
      price.interval === PLAN_INTERVALS.MONTHLY && price.currency === currency
  )
  if (!freePlanPrice) throw new Error("Unable to find Free Plan Price")

  const stripeSubscription = await createStripeSubscription(
    user.customerId,
    freePlanPrice.stripePriceId
  )
  if (!stripeSubscription)
    throw new Error("Unable to create Stripe Subscription.")

  const storedSubscription = await createSubscription({
    customerId: user.customerId || "",
    userId: user.id,
    isActive: true,
    subscriptionId: String(stripeSubscription.id),
    planId: String(freePlanPrice.planId),
    priceId: String(freePlanPrice.id),
    interval: String(stripeSubscription.items.data[0].plan.interval),
    status: stripeSubscription.status,
    currentPeriodStart: stripeSubscription.current_period_start,
    currentPeriodEnd: stripeSubscription.current_period_end,
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
  })
  if (!storedSubscription) throw new Error("Unable to create Subscription.")

  return redirect("/dashboard")
}
