import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  console.log('host', req.headers.get('host'));
  const res = NextResponse.rewrite(url);
  res.headers.set('Set-Cookie', 'theme=#fff000');
  return res;

  // You can also set additional options by appending them to the header value

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  // const hostname = req.headers.get('host');

  // Only for demo purposes - remove this if you want to use your root domain as the landing page
  // if (hostname === 'demo.localhost:3000') {
  //   return NextResponse.redirect('http://demo1.localhost:3000/signIn');
  // }
}
