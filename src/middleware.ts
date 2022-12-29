import { NextRequest, NextResponse } from 'next/server';
import tenantsConfig from '../public/config/tenants.json';

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const host = request.headers.get('host');
  const tenantConfig = tenantsConfig.find(
    (tenant) => tenant.host === host),
  );
  response.cookies.set('host', host || 'none');
  if (tenantConfig) {
    Object.entries(tenantConfig?.serverSide).forEach(([key, value]) => {
      response.cookies.set(key, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    });
    Object.entries(tenantConfig?.clientSide).forEach(([key, value]) => {
      response.cookies.set(key, value, {
        secure: process.env.NODE_ENV === 'production',
      });
    });
  }
  return response;
}
