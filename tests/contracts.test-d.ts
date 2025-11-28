import { expectAssignable, expectType } from 'tsd';

import type { APIResponse, FileUploadId, IsoDateTimeString, RequestId, ResponseMetadata, ValidatorTypes, UserId } from '../src/index';
import type { FeatureFlag } from '../src/api/contracts';
import { VALIDATORS as RuntimeValidators } from '../src/validators';
import type { PricingPlan } from '../src/billing/pricing';
import { BillingCycle } from '../src/billing';
import { brand } from '../src/primitives';

const timestamp = '2024-01-01T00:00:00.000Z' as IsoDateTimeString;
const requestId = brand('b3f2b9b1-7f26-4d4c-9f6f-9ed3a2f4c3a1', 'id:request');

const response: APIResponse<{ ok: true }> = {
  success: true,
  status: 200,
  data: { ok: true },
  timestamp,
  metadata: {
    requestId,
    version: '2024.12.0',
    timestamp,
    duration: 42,
  },
};

expectType<IsoDateTimeString>(response.timestamp);
expectType<RequestId>((response.metadata as ResponseMetadata).requestId);

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

const fileId: FileUploadId = brand('cf191a2d-4e8a-4639-94a1-0e7ac322f1d9', 'id:file-upload');
const fileUploadPayload: ValidatorTypes['fileUpload'] = {
  id: fileId,
  name: 'invoice.pdf',
  mimeType: 'application/pdf',
  size: 1024,
  url: 'https://files.example.com/invoice.pdf',
  uploadedAt: timestamp,
  uploadedBy: userId,
};

expectType<FileUploadId>(fileUploadPayload.id);
