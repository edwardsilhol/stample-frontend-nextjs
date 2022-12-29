import { NextRequest, NextResponse } from 'next/server';
import tenantsConfig from '../public/config/tenants.json';
import domainsConfig from '../public/config/domains.json';

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const requestHostCookie = request.cookies.get('host');

  // checking if cookies already exists
  // if not, redirect after setting cookies
  const response = !!requestHostCookie
    ? NextResponse.next()
    : NextResponse.redirect(url);
  const currentHost = request.headers.get('host') || '';

  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL
  // (in the case of "test.vercel.app", "vercel.app" is the root URL)
  process.env.NODE_ENV === 'production'
    ? domainsConfig.prod.forEach((domain) => {
        currentHost.replace(domain, '');
      })
    : domainsConfig.local.forEach((domain) => {
        currentHost.replace(domain, '');
      });

  // Finding and assigning the tenant config based on the current host
  const tenantConfig = tenantsConfig.find(
    (tenant) => tenant.host === currentHost,
  );
  response.cookies.set('host', currentHost);
  if (tenantConfig) {
    console.log('tenantConfig', tenantConfig);
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
