import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ClipboardList, BarChart2 } from 'lucide-react';

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const { user } = useAuth();

  const menuItems =
    user?.role === 'admin'
      ? [
          { href: '/dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
          { href: '/result', label: 'Hasil Assessment', icon: <ClipboardList size={18} /> },
        ]
      : [{ href: '/', label: 'Information', icon: <ClipboardList size={18} /> }];

  return (
    <aside
      className={`transition-all duration-300 bg-white shadow-lg border-r ${
        isOpen ? 'w-64' : 'w-0 md:w-16'
      } overflow-hidden md:block`}
    >
      <nav className="p-6 space-y-4">
        {menuItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium transition 
              ${
                router.pathname === item.href
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
          >
            {item.icon}
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
