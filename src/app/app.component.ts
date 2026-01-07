import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
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

  constructor() {
    this.loadQuestions();
  }

  loadQuestions() {
    // Create a deep copy to avoid modifying the original constant
    this.questions.set(JSON.parse(JSON.stringify(BACKEND_QUESTIONS)));
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

  saveEvaluation() {
    if (!this.candidateName().trim()) {
      alert('Por favor, ingrese el nombre del candidato antes de guardar.');
      return;
    }

    // Find all questions that have not been evaluated yet
    const unansweredQuestions = this.questions().filter(q => q.evaluation === null);

    if (unansweredQuestions.length > 0) {
      const questionTitles = unansweredQuestions.map(q => `- ${q.question}`).join('\n');
      const alertMessage = `Por favor, responda las siguientes preguntas antes de guardar:\n\n${questionTitles}`;
      alert(alertMessage);
      return;
    }

    // Create a record of the current evaluation
    const currentEvaluation: SavedEvaluation = {
      timestamp: new Date(), // Capture the current date and time
      candidateName: this.candidateName(),
      evaluatorName: this.evaluatorName(),
      questions: this.questions(),
      totalScore: this.totalScore(),
      finalResult: this.finalResult()
    };

    // Add the current evaluation to the saved list
    this.savedEvaluations.update(evals => [...evals, currentEvaluation]);

    // Reset the form for the next evaluation
    this.resetForm();

    alert(`¡Evaluación de ${currentEvaluation.candidateName} guardada!`);
  }

  resetForm() {
    this.candidateName.set('');
    this.evaluatorName.set(''); // Optionally reset evaluator too
    this.loadQuestions(); // Reset questions to their initial state
  }

  exportToXlsx() {
    const evaluationsToExport = this.savedEvaluations();
    if (evaluationsToExport.length === 0) {
      alert('No hay evaluaciones guardadas para exportar. Por favor, guarde al menos una evaluación.');
      return;
    }

    // Create a flat structure for the Excel sheet
    const exportData = evaluationsToExport.map(ev => {
      const row: {[key: string]: any} = {
        'Fecha y Hora': ev.timestamp.toLocaleString('es-ES'), // Format timestamp
        'Candidato': ev.candidateName,
        'Evaluador': ev.evaluatorName,
        'Puntaje Total': ev.totalScore,
        'Resultado Final': ev.finalResult,
      };

      // Add each question's notes as a separate column
      ev.questions.forEach(q => {
        const questionKey = `Notas - ${q.question.substring(0, 30)}...`;
        row[questionKey] = q.notes;
      });

      return row;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resumen de Evaluaciones');

    // Export the file
    XLSX.writeFile(wb, `resumen_evaluaciones_gft.xlsx`);
  }
}
