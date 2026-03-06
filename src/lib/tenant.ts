// Tenant config shape returned by the API
export interface TenantConfig {
  id: string;
  name: string;
  template: 'saas' | 'business' | 'restaurant' | 'gym' | 'portfolio';
  tagline?: string;
  description?: string;
  primaryColor?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  features?: string[];
  pricing?: Array<{ plan: string; price: string; features: string[] }>;
  contactEmail?: string;
  socialLinks?: Record<string, string>;
}

/**
 * Resolves the tenant identifier from the request.
 * - In local/dev: uses ?tenant=X query param
 * - In production: falls back to subdomain extraction from the Host header
 */
export function resolveTenantId(request: Request): string | null {
  const url = new URL(request.url);

  // 1. Query param takes priority (works everywhere including local dev)
  const paramTenant = url.searchParams.get('tenant');
  if (paramTenant) return paramTenant;

  // 2. Subdomain extraction for production (e.g. acme.yourdomain.com)
  const host = request.headers.get('host') ?? url.hostname;
  const parts = host.split('.');
  if (parts.length >= 3) {
    // subdomain is the first segment when there are at least 3 parts
    return parts[0];
  }

  return null;
}

/**
 * Fetches the tenant configuration from the ss-api service.
 * Returns null when the tenant is not found or the API is unreachable.
 */
export async function fetchTenantConfig(tenantId: string): Promise<TenantConfig | null> {
  const apiBase = import.meta.env.API_BASE_URL ?? 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBase}/api/tenant/config?tenant=${encodeURIComponent(tenantId)}`);
    if (!res.ok) return null;
    return (await res.json()) as TenantConfig;
  } catch {
    // API unreachable
    return null;
  }
}
