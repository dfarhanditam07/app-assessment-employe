import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function Login() {
  const router = useRouter();
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
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');

      router.push(data.user.role === 'admin' ? '/dashboard' : '/assessment');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-16 px-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nik" className="block text-sm font-medium text-gray-700">
                NIK
              </label>
              <input
                id="nik"
                name="nik"
                type="text"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="Masukkan NIK"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
