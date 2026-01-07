export interface InterviewQuestion {
  id: number;
  text: string;
  idealAnswer: string;
}

export interface Interview {
  id: string;
  date: Date;
  questions: InterviewQuestion[];
  userAnswers: string[];
  scores: number[];
  totalScore: number;
}
