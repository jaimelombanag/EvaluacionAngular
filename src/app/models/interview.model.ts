import { InterviewQuestion } from "./interview-question.model";

export interface SavedEvaluation {
  id?: string; // Campo opcional para el ID de Firestore
  timestamp: any; // CORREGIDO: El tipo se cambia a 'any' para aceptar el Timestamp de Firestore
  candidateName: string;
  evaluatorName: string;
  questions: InterviewQuestion[];
  totalScore: number;
  finalResult: string;
}
