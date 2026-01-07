import { Component, signal, computed, ChangeDetectionStrategy, ElementRef, Renderer2 } from '@angular/core';
import { InterviewQuestion } from './models/interview-question.model';
import { BACKEND_QUESTIONS } from './questions/backend-questions';
import * as XLSX from 'xlsx';

// Interface for a completed evaluation record
interface SavedEvaluation {
  timestamp: Date;
  candidateName: string;
  evaluatorName: string;
  questions: InterviewQuestion[];
  totalScore: number;
  finalResult: string;
}

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

  // Signals for input validation state
  candidateNameInvalid = signal(false);
  evaluatorNameInvalid = signal(false);

  // Signal to store all saved evaluations
  savedEvaluations = signal<SavedEvaluation[]>([]);

  totalScore = computed(() => {
    const evaluatedQuestions = this.questions().filter(q => q.evaluation !== 'No aplica');
    if (evaluatedQuestions.length === 0) return 0; // Avoid division by zero

    const total = evaluatedQuestions.reduce((acc, q) => acc + q.score, 0);
    const maxPossibleScore = evaluatedQuestions.length * 20;
    if (maxPossibleScore === 0) return 0;

    return Math.round((total / maxPossibleScore) * 100);
  });

  finalResult = computed(() => {
    return this.totalScore() >= 65 ? 'Aceptado' : 'Rechazado';
  });

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.loadQuestions();
  }

  loadQuestions() {
    const initialQuestions = JSON.parse(JSON.stringify(BACKEND_QUESTIONS));
    this.questions.set(initialQuestions.map((q: InterviewQuestion) => ({ ...q, isInvalid: false })));
  }

  onCandidateNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.candidateName.set(target.value);
    if (target.value) this.candidateNameInvalid.set(false); // Reset validation on input
  }

  onEvaluatorNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.evaluatorName.set(target.value);
    if (target.value) this.evaluatorNameInvalid.set(false); // Reset validation on input
  }

  updateEvaluation(questionId: number, evaluation: 'Aplica' | 'Parcial' | 'No aplica') {
    this.questions.update(qs =>
      qs.map(q => {
        if (q.id === questionId) {
          let score = 0;
          if (evaluation === 'Aplica') score = 20;
          if (evaluation === 'Parcial') score = 10;
          return { ...q, evaluation, score, isInvalid: false };
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

  saveEvaluation() {
    const isCandidateNameMissing = !this.candidateName().trim();
    const isEvaluatorNameMissing = !this.evaluatorName().trim();

    this.candidateNameInvalid.set(isCandidateNameMissing);
    this.evaluatorNameInvalid.set(isEvaluatorNameMissing);

    if (isCandidateNameMissing || isEvaluatorNameMissing) {
      const firstInvalidInputId = isCandidateNameMissing ? 'candidate-name' : 'evaluator-name';
      const element = this.elementRef.nativeElement.querySelector(`#${firstInvalidInputId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return; // Stop if names are missing
    }

    const unansweredQuestions = this.questions().filter(q => q.evaluation === null);
    if (unansweredQuestions.length > 0) {
      this.questions.update(currentQuestions =>
        currentQuestions.map(q => ({
          ...q,
          isInvalid: unansweredQuestions.some(uq => uq.id === q.id)
        }))
      );

      const firstInvalidId = unansweredQuestions[0].id;
      const element = this.elementRef.nativeElement.querySelector(`#question-${firstInvalidId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const currentEvaluation: SavedEvaluation = {
      timestamp: new Date(),
      candidateName: this.candidateName(),
      evaluatorName: this.evaluatorName(),
      questions: this.questions(),
      totalScore: this.totalScore(),
      finalResult: this.finalResult()
    };

    this.savedEvaluations.update(evals => [...evals, currentEvaluation]);
    this.resetForm();
    alert(`¡Evaluación de ${currentEvaluation.candidateName} guardada!`);
  }

  resetForm() {
    this.candidateName.set('');
    this.evaluatorName.set('');
    this.candidateNameInvalid.set(false);
    this.evaluatorNameInvalid.set(false);
    this.loadQuestions();
  }

  exportToXlsx() {
    const evaluationsToExport = this.savedEvaluations();
    if (evaluationsToExport.length === 0) {
      alert('No hay evaluaciones guardadas para exportar.');
      return;
    }

    const exportData = evaluationsToExport.map(ev => {
      const row: {[key: string]: any} = {
        'Fecha y Hora': ev.timestamp.toLocaleString('es-ES'),
        'Candidato': ev.candidateName,
        'Evaluador': ev.evaluatorName,
        'Puntaje Total': ev.totalScore,
        'Resultado Final': ev.finalResult,
      };

      ev.questions.forEach(q => {
        const questionKey = `Notas - ${q.question.substring(0, 30)}...`;
        row[questionKey] = q.notes;
      });

      return row;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resumen de Evaluaciones');
    XLSX.writeFile(wb, `resumen_evaluaciones_gft.xlsx`);
  }
}
