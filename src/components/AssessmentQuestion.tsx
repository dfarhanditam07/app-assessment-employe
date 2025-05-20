import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface AssessmentQuestionProps {
  question: Question;
  onAnswer: (answer: 'A' | 'B' | 'C' | 'D') => void;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
}

const AssessmentQuestion: React.FC<AssessmentQuestionProps> = ({
  question,
  onAnswer,
  selectedAnswer
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-all hover:shadow-xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        {question.id}. {question.text}
      </h3>
      <div className="space-y-3">
        {Object.entries(question.options).map(([key, value]) => {
          const isSelected = selectedAnswer === key;

          return (
            <button
              key={key}
              onClick={() => onAnswer(key as 'A' | 'B' | 'C' | 'D')}
              className={`flex items-center justify-between w-full px-5 py-4 rounded-xl border text-left transition-all
                ${isSelected 
                  ? 'bg-blue-100 border-blue-500 text-blue-800 shadow-sm'
                  : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-blue-300 text-gray-700'
                }`}
            >
              <div className="flex items-start gap-2">
                <span className="font-bold">{key}.</span>
                <span>{value}</span>
              </div>
              {isSelected && (
                <CheckCircle className="text-blue-600" size={20} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentQuestion;
