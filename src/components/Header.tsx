import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center bg-blue-600 px-6 py-4 text-white shadow-md">
      <Link href="/" className="text-2xl font-bold">PT. XYZ</Link>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Hai, <strong>{user.nama}</strong> ({user.role})
          </span>
          <button
            onClick={logout}
            className="bg-white text-blue-600 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-100 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition"
        >
          Login
        </Link>
      )}
    </header>
  );
}
