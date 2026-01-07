import { InterviewQuestion } from "./interview-question.model";

export interface SavedEvaluation {
  id?: string; // Campo opcional para el ID de Firestore
  timestamp: Date;
  candidateName: string;
  evaluatorName: string;
  questions: InterviewQuestion[];
  totalScore: number;
  finalResult: string;
}
