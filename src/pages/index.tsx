import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-2xl rounded-2xl p-10"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-blue-700">
                Selamat Datang 👋
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Sistem Asesmen <span className="text-blue-600 font-semibold">Situational Leadership</span> PT. XYZ
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <Info className="text-blue-600 mt-1" size={22} />
                <h2 className="text-xl font-semibold text-blue-700">
                  Instruksi Pengisian Kuisioner
                </h2>
              </div>

              <ol className="list-decimal list-inside text-gray-700 space-y-1 pl-1 text-sm md:text-base">
                <li>Bacalah setiap situasi dengan seksama.</li>
                <li>Pilih satu dari empat opsi tindakan (A, B, C, D).</li>
                <li>Tentukan yang paling mencerminkan tindakan Anda.</li>
                <li>Isi jawaban di kolom yang tersedia.</li>
                <li>Hanya satu jawaban untuk setiap situasi.</li>
                <li>Tidak ada jawaban benar atau salah.</li>
              </ol>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
