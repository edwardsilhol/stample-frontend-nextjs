import { NextRequest, NextResponse } from 'next/server';
import tenantsConfig from '../public/config/tenants.json';

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const tenantConfig = tenantsConfig.find(
    (tenant) => tenant.host === request.headers.get('host'),
  );
  if (tenantConfig) {
    Object.entries(tenantConfig.config).forEach(([key, value]) => {
      response.cookies.set(key, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    });
  }
  return response;
}
