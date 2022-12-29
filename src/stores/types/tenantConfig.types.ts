export interface TenantThemeConfig {
  primaryColor?: string;
}

export interface TenantConfig {
  tenantThemeConfig: TenantThemeConfig;
  apiUrl?: string;
}
