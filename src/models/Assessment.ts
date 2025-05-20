export interface Assessment {
  nik: string;
  nama: string;
  unit_kerja: string;
  jawaban: string[];
  result: {
    telling: number;
    selling: number;
    participating: number;
    delegating: number;
  };
  leadership_style: 'Telling' | 'Selling' | 'Participating' | 'Delegating';
  created_at: Date;
}

export interface AssessmentResult {
  total: number;
  telling: number;
  selling: number;
  participating: number;
  delegating: number;
  dominant_style: string;
}
