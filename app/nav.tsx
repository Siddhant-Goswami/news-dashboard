import Navbar from './navbar';
// import { getServerSession } from 'next-auth/next';

export default function Nav() {
  const session = { user: {} };
  return <Navbar user={session?.user} />;
}
