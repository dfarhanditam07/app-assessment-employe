import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Assessment } from '../models/Assessment';

const leadershipStyles = [
  { value: '', label: 'Semua' },
  { value: 'Telling', label: 'Telling' },
  { value: 'Selling', label: 'Selling' },
  { value: 'Participating', label: 'Participating' },
  { value: 'Delegating', label: 'Delegating' },
];

const getStyleDescription = (style: string) => {
  switch (style) {
    case 'Delegating':
      return `Pengikut: Kompetensi tinggi, komitmen tinggi / mampu dan mau atau termotivasi.\nPemimpin: Fokus tugas rendah, fokus hubungan rendah.\nKetika pengikut mampu dan termotivasi, pemimpin dapat menyerahkan tugas sepenuhnya kepada mereka, dan hanya perlu memantau dari jauh untuk memastikan semuanya berjalan sesuai rencana. Pengikut pada tingkat ini hampir tidak memerlukan dukungan atau pujian yang sering, meskipun pengakuan tetap akan dihargai.`;
    case 'Telling':
      return 'Pengikut: Kompetensi rendah, komitmen tinggi / belum mampu tapi termotivasi.\nPemimpin: Fokus tugas tinggi, fokus hubungan rendah.\nKarakteristik: Pemimpin memberi instruksi yang sangat jelas, mengarahkan langkah demi langkah, dan mengawasi secara ketat karena pengikut belum punya kemampuan atau pengalaman yang cukup. Pemimpin harus tegas dan mengontrol agar tugas dapat diselesaikan dengan benar.';
    case 'Selling':
      return 'Pengikut: Kompetensi rendah, komitmen rendah / belum mampu dan belum termotivasi.\nPemimpin: Fokus tugas tinggi, fokus hubungan tinggi.\nKarakteristik: Pemimpin masih harus mengarahkan secara jelas, tapi juga memberikan dukungan emosional dan motivasi untuk meningkatkan semangat dan keterampilan pengikut. Pemimpin menjelaskan mengapa tugas itu penting dan mengajak berdiskusi untuk meningkatkan komitmen.';
    case 'Participating':
      return 'Pengikut: Kompetensi tinggi, komitmen rendah / mampu tapi kurang termotivasi.\nPemimpin: Fokus tugas rendah, fokus hubungan tinggi.\nKarakteristik: Pemimpin mengurangi arahan teknis tapi lebih banyak mendukung secara emosional dan berkolaborasi dengan pengikut. Pemimpin membantu mengatasi hambatan motivasi dan mendengarkan masukan pengikut agar mereka lebih bersemangat.';
    default:
      return '-';
  }
};

const Result: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    nik: '',
    style: '',
    startDate: '',
    endDate: '',
  });

  // Fungsi ambil data dari API dengan filter
  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.nik.trim() !== '') params.append('nik', filters.nik.trim());
      if (filters.style !== '') params.append('style', filters.style);
      if (filters.startDate !== '') params.append('startDate', filters.startDate);
      if (filters.endDate !== '') params.append('endDate', filters.endDate);

      const res = await fetch(`/api/assessments?${params.toString()}`);

      if (!res.ok) throw new Error('Gagal mengambil data assessment');
      const data = await res.json();
      setAssessments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  // Panggil fetch saat filters berubah
  useEffect(() => {
    fetchAssessments();
  }, [filters]);

  // Fungsi export data ke CSV
  const handleExportCSV = () => {
    if (assessments.length === 0) return;

    const headers = ['NIK', 'Nama', 'Unit Kerja', 'Tanggal', 'Gaya Kepemimpinan', 'Skor'];
    const rows = assessments.map(a => [
      a.nik,
      a.nama,
      a.unit_kerja,
      new Date(a.created_at).toLocaleDateString(),
      a.leadership_style,
      `T:${a.result.telling} S:${a.result.selling} P:${a.result.participating} D:${a.result.delegating}`,
    ]);

    const csvContent = [headers, ...rows].map(e => e.map(v => `"${v}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hasil_assessment_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Hasil Assessment</h1>
          <button
            onClick={handleExportCSV}
            disabled={loading || assessments.length === 0}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              loading || assessments.length === 0
                ? 'bg-green-300 cursor-not-allowed text-green-700'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Export CSV
          </button>
        </div>

        {/* Filter Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            fetchAssessments();
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div>
            <label htmlFor="nik" className="block text-sm font-medium text-gray-700">
              NIK
            </label>
            <input
              id="nik"
              type="text"
              value={filters.nik}
              onChange={e => setFilters({ ...filters, nik: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700">
              Gaya Kepemimpinan
            </label>
            <select
              id="style"
              value={filters.style}
              onChange={e => setFilters({ ...filters, style: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {leadershipStyles.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Tanggal Mulai
            </label>
            <input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={e => setFilters({ ...filters, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Tanggal Akhir
            </label>
            <input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={e => setFilters({ ...filters, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-600">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : assessments.length === 0 ? (
          <p className="text-center text-gray-500 italic">Tidak ada data yang sesuai filter.</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {[
                    'NIK',
                    'Nama',
                    'Unit Kerja',
                    'Tanggal',
                    'Gaya Kepemimpinan',
                    'Skor',
                    'Deskripsi',
                  ].map(header => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessments.map(a => (
                  <tr key={`${a.nik}-${a.created_at}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {a.nik}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {a.unit_kerja}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(a.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          {
                            Telling: 'bg-red-100 text-red-800',
                            Selling: 'bg-yellow-100 text-yellow-800',
                            Participating: 'bg-blue-100 text-blue-800',
                            Delegating: 'bg-green-100 text-green-800',
                          }[a.leadership_style] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {a.leadership_style}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      Telling: {a.result.telling} | Selling: {a.result.selling} | Participating:{' '}
                      {a.result.participating} | Delegating: {a.result.delegating}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-pre-line">
                      {getStyleDescription(a.leadership_style)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Result;
