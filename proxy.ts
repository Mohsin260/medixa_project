import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in',
  publicRoutes: [],
});

export const config = {
  matcher: ['/admin/:path*'],
};
