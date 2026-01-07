export interface InterviewQuestion {
  id: number;
  question: string;
  expectedAnswer: string;
  evaluation: 'Aplica' | 'Parcial' | 'No aplica' | null;
  score: number;
  notes: string;
}
