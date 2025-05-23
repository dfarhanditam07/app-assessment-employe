import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  const [sidebarOpen, setSidebarOpen] = useState(true); // toggle state

  if (isLoginPage) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white text-gray-800">
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6 bg-white shadow-inner rounded-l-3xl transition-all duration-300">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
