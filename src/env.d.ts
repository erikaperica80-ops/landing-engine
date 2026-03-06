/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    tenantId: string | null;
    tenantConfig: import('./lib/tenant').TenantConfig | null;
  }
}
