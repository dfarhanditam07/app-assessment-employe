import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import AssessmentQuestion from '@/components/AssessmentQuestion';
import { questions } from '@/data/questions';

interface Answer {
  questionId: number;
  answer: 'A' | 'B' | 'C' | 'D';
}

export default function AssessmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalQuestions = questions.length;
  const progress = (answers.length / totalQuestions) * 100;

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user]);

  const handleAnswer = (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev =>
      prev.some(a => a.questionId === questionId)
        ? prev.map(a => a.questionId === questionId ? { ...a, answer } : a)
        : [...prev, { questionId, answer }]
    );
  };

  const calculateResult = () => {
    const count = { telling: 0, selling: 0, participating: 0, delegating: 0 };
    answers.forEach(({ answer }) => {
      if (answer === 'A') count.telling++;
      if (answer === 'B') count.selling++;
      if (answer === 'C') count.participating++;
      if (answer === 'D') count.delegating++;
    });

    const dominantStyle = Object.entries(count).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    return { ...count, dominantStyle };
  };

  const handleSubmit = async () => {
    if (answers.length < totalQuestions) {
      return alert('Harap jawab semua pertanyaan.');
    }

    setLoading(true);
    try {
      const result = calculateResult();
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nik: user?.nik,
          nama: user?.nama,
          unit_kerja: user?.unit_kerja,
          jawaban: answers,
          result,
          leadership_style: result.dominantStyle,
          created_at: new Date().toISOString()
        }),
      });

      if (!res.ok) throw new Error();
      router.push('/result');
    } catch (err) {
      alert('Gagal menyimpan data. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 text-gray-800">
        <h1 className="text-2xl font-bold text-center mb-6">
          Asesmen Gaya Kepemimpinan Situasional
        </h1>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-300 h-3 rounded-full">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 text-right">
            {answers.length}/{totalQuestions} Terjawab
          </p>
        </div>

        {/* Soal */}
        <div className="bg-white shadow rounded-lg p-5 mb-6">
          <AssessmentQuestion
            question={currentQuestion}
            selectedAnswer={answers.find(a => a.questionId === currentQuestion.id)?.answer}
            onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
          />
        </div>

        {/* Navigasi */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
          >
            Sebelumnya
          </button>

          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              {loading ? 'Menyimpan...' : 'Selesai'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(prev + 1, totalQuestions - 1))}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              Selanjutnya
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
