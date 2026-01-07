import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { InterviewQuestion } from './models/interview-question.model';
import { BACKEND_QUESTIONS } from './questions/backend-questions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  candidateName = signal('');
  questions = signal<InterviewQuestion[]>([]);

  totalScore = computed(() => {
    const total = this.questions().reduce((acc, q) => acc + q.score, 0);
    const maxScore = this.questions().length * 20;
    return Math.round((total / maxScore) * 100);
  });

  finalResult = computed(() => {
    return this.totalScore() >= 65 ? 'Aceptado' : 'Rechazado';
  });

  constructor() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questions.set(BACKEND_QUESTIONS.map(q => ({ ...q })));
  }

  onCandidateNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.candidateName.set(target.value);
  }

  updateEvaluation(questionId: number, evaluation: '✅ Aplica' | '⚠️ Parcial' | '❌ No aplica') {
    this.questions.update(qs =>
      qs.map(q => {
        if (q.id === questionId) {
          let score = 0;
          if (evaluation === '✅ Aplica') score = 20;
          if (evaluation === '⚠️ Parcial') score = 10;
          return { ...q, evaluation, score };
        }
        return q;
      })
    );
  }

  updateNotes(questionId: number, event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.questions.update(qs =>
      qs.map(q => q.id === questionId ? { ...q, notes: target.value } : q)
    );
  }
}
