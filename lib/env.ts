import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  JAZZCASH_MERCHANT_ID: z.string().optional(),
  JAZZCASH_SECURITY_CODE: z.string().optional(),
  JAZZCASH_BASE_URL: z.string().url().optional(),
  JAZZCASH_RETURN_URL: z.string().url().optional(),
  JAZZCASH_IPN_URL: z.string().url().optional(),
  EASYPAISA_MERCHANT_ID: z.string().optional(),
  EASYPAISA_SECURED_PAY_PAGE: z.string().optional(),
  EASYPAISA_RETURN_URL: z.string().optional(),
  EASYPAISA_IPN_URL: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv === null) {
    cachedEnv = envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      JAZZCASH_MERCHANT_ID: process.env.JAZZCASH_MERCHANT_ID,
      JAZZCASH_SECURITY_CODE: process.env.JAZZCASH_SECURITY_CODE,
      JAZZCASH_BASE_URL: process.env.JAZZCASH_BASE_URL,
      JAZZCASH_RETURN_URL: process.env.JAZZCASH_RETURN_URL,
      JAZZCASH_IPN_URL: process.env.JAZZCASH_IPN_URL,
      EASYPAISA_MERCHANT_ID: process.env.EASYPAISA_MERCHANT_ID,
      EASYPAISA_SECURED_PAY_PAGE: process.env.EASYPAISA_SECURED_PAY_PAGE,
      EASYPAISA_RETURN_URL: process.env.EASYPAISA_RETURN_URL,
      EASYPAISA_IPN_URL: process.env.EASYPAISA_IPN_URL,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
    });
  }
  return cachedEnv;
}
