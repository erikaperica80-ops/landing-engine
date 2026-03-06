import type { MiddlewareHandler } from 'astro';
import { resolveTenantId, fetchTenantConfig } from './lib/tenant';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const tenantId = resolveTenantId(context.request);

  if (tenantId) {
    const config = await fetchTenantConfig(tenantId);
    context.locals.tenantId = tenantId;
    context.locals.tenantConfig = config;
  } else {
    context.locals.tenantId = null;
    context.locals.tenantConfig = null;
  }

  return next();
};
