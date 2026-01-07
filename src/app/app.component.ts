import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { InterviewQuestion } from './models/interview-question.model';
import { BACKEND_QUESTIONS } from './questions/backend-questions';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  candidateName = signal('');
  evaluatorName = signal('');
  questions = signal<InterviewQuestion[]>([]);

  totalScore = computed(() => {
    const total = this.questions().reduce((acc, q) => acc + q.score, 0);
    const maxScore = this.questions().length * 20;
    if (maxScore === 0) return 0; // Avoid division by zero
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

  onEvaluatorNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.evaluatorName.set(target.value);
  }

  updateEvaluation(questionId: number, evaluation: 'Aplica' | 'Parcial' | 'No aplica') {
    this.questions.update(qs =>
      qs.map(q => {
        if (q.id === questionId) {
          let score = 0;
          if (evaluation === 'Aplica') score = 20;
          if (evaluation === 'Parcial') score = 10;
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

  exportToXlsx() {
    const evaluationData = [
      ['Nombre del Candidato', this.candidateName()],
      ['Fecha', new Date().toLocaleDateString()],
      ['Evaluador', this.evaluatorName()],
      [],
      ['Pregunta', 'Evaluación', 'Notas'],
      ...this.questions().map(q => [q.question, q.evaluation, q.notes]),
      [],
      ['Puntaje Final', this.totalScore()],
      ['Resultado', this.finalResult()]
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(evaluationData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluacion');

    // Sanitize candidate name for the filename
    const safeName = this.candidateName().replace(/[^a-z0-9]/gi, '_').toLowerCase();
    XLSX.writeFile(wb, `evaluacion_${safeName || 'sin_nombre'}.xlsx`);
  }
}
