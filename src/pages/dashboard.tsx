import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface Statistics {
  totalAssessments: number;
  styleDistribution: { _id: string; count: number }[];
  averageScores: {
    avgTelling: number;
    avgSelling: number;
    avgParticipating: number;
    avgDelegating: number;
  };
  assessmentsByDate: { _id: string; count: number }[];
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const InfoBox = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await fetch('/api/statistics');
        if (!res.ok) throw new Error('Gagal mengambil data statistik');
        const data = await res.json();
        setStatistics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64 text-xl text-gray-600">Memuat data...</div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="flex items-center justify-center h-64 text-xl text-red-500">{error}</div>
    </Layout>
  );

  if (!statistics) return null;

  const { totalAssessments, averageScores, styleDistribution, assessmentsByDate } = statistics;

  const avgScore = Math.round(
    (averageScores.avgTelling + averageScores.avgSelling +
      averageScores.avgParticipating + averageScores.avgDelegating) / 4
  );

  const dominantStyle =
    styleDistribution.length > 0
      ? styleDistribution.reduce((a, b) => (a.count > b.count ? a : b))._id
      : '-';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8 text-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700">📊 Dashboard Assessment</h1>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <InfoBox title="Total Assessment" value={totalAssessments} color="text-indigo-600" />
          <InfoBox title="Rata-rata Skor" value={`${avgScore}%`} color="text-green-600" />
          <InfoBox title="Gaya Dominan" value={dominantStyle} color="text-purple-600" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Distribusi Gaya Kepemimpinan</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={styleDistribution}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {styleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Tren Pengisian Assessment</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assessmentsByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6366F1" name="Jumlah Assessment" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
