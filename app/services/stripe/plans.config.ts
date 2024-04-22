import type { Plan, PlanLimit } from "@prisma/client"

export const enum PLAN_TYPES {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  // ENTERPRISE = 'enterprise',
}

export const enum PLAN_INTERVALS {
  MONTHLY = "month",
  YEARLY = "year",
}

export const enum CURRENCIES {
  USD = "usd",
  EUR = "eur",
}

export const DEFAULT_PLANS: {
  [key in PLAN_TYPES]: Plan & {
    limits: {
      [key in Exclude<keyof PlanLimit, "id" | "planId">]: number
    }
    prices: {
      [key in PLAN_INTERVALS]: {
        [key in CURRENCIES]: number
      }
    }
  }
} = {
  [PLAN_TYPES.FREE]: {
    id: "free",
    name: "Free",
    description: "Free plan",
    isActive: true,
    stripePlanId: "free",
    listOfFeatures: [
      {
        name: "1 user",
        isAvailable: true,
        inProgress: false,
      },
      {
        name: "1 project",
        isAvailable: true,
        inProgress: false,
      },
      {
        name: "1GB storage",
        isAvailable: true,
        inProgress: false,
      },
    ],
    limits: {
      allowedUsersCount: 1,
      allowedProjectsCount: 1,
      allowedStorageSize: 1,
    },
    prices: {
      [PLAN_INTERVALS.MONTHLY]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0,
      },
      [PLAN_INTERVALS.YEARLY]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [PLAN_TYPES.BASIC]: {
    id: "basic",
    name: "Basic",
    description: "Basic plan",
    isActive: true,
    stripePlanId: "basic",
    listOfFeatures: [
      {
        name: "5 users",
        isAvailable: true,
        inProgress: false,
      },
      {
        name: "5 projects",
        isAvailable: true,
        inProgress: false,
      },
      {
        name: "5GB storage",
        isAvailable: true,
        inProgress: false,
      },
    ],
    limits: {
      allowedUsersCount: 5,
      allowedProjectsCount: 5,
      allowedStorageSize: 5,
    },
    prices: {
      [PLAN_INTERVALS.MONTHLY]: {
        [CURRENCIES.USD]: 10,
        [CURRENCIES.EUR]: 10,
      },
      [PLAN_INTERVALS.YEARLY]: {
        [CURRENCIES.USD]: 100,
        [CURRENCIES.EUR]: 100,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [PLAN_TYPES.PRO]: {
    id: "pro",
    name: "Pro",
    description: "Pro plan",
    isActive: true,
    stripePlanId: "pro",
    listOfFeatures: [
      {
        name: "10 users",
        isAvailable: true,
        inProgress: false,
      },
      {
        name: "10 projects",
        isAvailable: true,
        inProgress: false,
      },
      {
        name: "10GB storage",
        isAvailable: true,
        inProgress: false,
      },
    ],
    limits: {
      allowedUsersCount: 10,
      allowedProjectsCount: 10,
      allowedStorageSize: 10,
    },
    prices: {
      [PLAN_INTERVALS.MONTHLY]: {
        [CURRENCIES.USD]: 20,
        [CURRENCIES.EUR]: 20,
      },
      [PLAN_INTERVALS.YEARLY]: {
        [CURRENCIES.USD]: 200,
        [CURRENCIES.EUR]: 200,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // [PLAN_TYPES.ENTERPRISE]: {
  //     id: 'enterprise',
  //     name: 'Enterprise',
  //     description: 'Enterprise plan',
  //     isActive: true,
  //     listOfFeatures: [
  //         'Unlimited users',
  //         'Unlimited projects',
  //         'Unlimited storage',
  //     ],
  //     limits: {
  //         allowedUsersCount: 0,
  //         allowedProjectsCount: 0,
  //         allowedStorageSize: 0,
  //     },
  //     prices: {
  //         [PLAN_INTERVALS.MONTHLY]: {
  //             [CURRENCIES.USD]: 50,
  //             [CURRENCIES.EUR]: 50,
  //         },
  //         [PLAN_INTERVALS.YEARLY]: {
  //             [CURRENCIES.USD]: 500,
  //             [CURRENCIES.EUR]: 500,
  //         },
  //     },
  //     createdAt: new Date(),
  //     updatedAt: new Date()
  // },
}
