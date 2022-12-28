import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  console.log('host', req.headers.get('host'));

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  // const hostname = req.headers.get('host');
  req.cookies;

  // Only for demo purposes - remove this if you want to use your root domain as the landing page
  // if (hostname === 'demo.localhost:3000') {
  //   return NextResponse.redirect('http://demo1.localhost:3000/signIn');
  // }
}
