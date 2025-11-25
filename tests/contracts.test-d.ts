import { expectAssignable, expectType } from 'tsd';

import type { APIResponse, IsoDateTimeString, ValidatorTypes, UserId } from '../src/index';
import type { FeatureFlag } from '../src/api/contracts';
import { VALIDATORS as RuntimeValidators } from '../src/validators';
import type { PricingPlan } from '../src/billing/pricing';
import { BillingCycle } from '../src/billing';
import { brand } from '../src/primitives';

const timestamp = '2024-01-01T00:00:00.000Z' as IsoDateTimeString;

const response: APIResponse<{ ok: true }> = {
  success: true,
  status: 200,
  data: { ok: true },
  timestamp,
};

expectType<IsoDateTimeString>(response.timestamp);

const loginParse = RuntimeValidators.loginCredentials.safeParse({
  email: 'founder@example.com',
  password: 'Password123!',
});

if (loginParse.success) {
  expectType<ValidatorTypes['loginCredentials']>(loginParse.data);
}

const plan: PricingPlan = {
  id: 'plan_ent' as PricingPlan['id'],
  name: 'Enterprise',
  slug: 'enterprise',
  description: 'All the bells and whistles',
  features: ['priority-support'],
  price: {
    amount: 1000,
    currency: 'USD',
    interval: BillingCycle.MONTHLY,
  },
  tier: 'enterprise',
  supportLevel: 'premium',
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

expectAssignable<PricingPlan>(plan);

const userId: UserId = brand('user-1', 'id:user');
const featureFlag: FeatureFlag = {
  name: 'beta-dashboard',
  enabled: true,
  targetAudience: {
    userIds: [userId],
  },
};

expectType<FeatureFlag>(featureFlag);
