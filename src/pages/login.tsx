import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ nik: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');

      login(data.user);
      router.push(data.user.role === 'admin' ? '/dashboard' : '/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login Asesmen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div
          className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-12"
          style={{ backgroundImage: "url('/images/bg-login.jpg')" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-10"
          >
            <div className="flex flex-col items-center mb-6">
              <img src="/images/logo.png" alt="Logo" className="w-16 h-16 mb-2" />
              <h2 className="text-2xl font-bold text-blue-800 text-center">Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nik" className="block text-sm font-medium text-gray-700">
                  NIK
                </label>
                <input
                  id="nik"
                  name="nik"
                  type="text"
                  required
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Masukkan NIK"
                  value={formData.nik}
                  onChange={e => setFormData({ ...formData, nik: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {error && <div className="text-sm text-red-600 text-center">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
