import { stringify } from 'qs';

interface SsrFetchConfig {
  endpoint: string;
  params?: Record<string, string>;
  nextConfig?: RequestInit;
}

export async function ssrFetch<T>(ssrFetchConfig: SsrFetchConfig) {
  const { endpoint, params, nextConfig } = ssrFetchConfig;

  const API_URL = process.env.APP_API_URL as string;
  let query = API_URL + endpoint;

  if (params) {
    query += '?' + stringify(params);
  }

  console.log('ssrFetch', query);

  const fetchConfig: any = {
    headers: {
      Accept: 'application/json',
    },
    ...nextConfig,
  };

  const response = await fetch(query, fetchConfig);

  const bodyResult = await response.json();

  if (!response.ok) {
    throw new Error(bodyResult?.error);
  }
  return bodyResult as T;
}
