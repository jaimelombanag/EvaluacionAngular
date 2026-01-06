
import { Component, computed, signal } from '@angular/core';
import { BACKEND_QUESTIONS, InterviewQuestion } from './questions/backend-questions';

// Definimos los posibles estados de la evaluación para una pregunta
type EvaluationStatus = 'No aplica' | 'Parcial' | 'Aplica';

// Interfaz extendida para manejar el estado de la evaluación
interface EvaluationQuestion extends InterviewQuestion {
  evaluation: EvaluationStatus;
  notes: string;
}

@Component({
  selector: 'app-root',
  standalone: false, // <-- AÑADIDO PARA ANULAR EL COMPORTAMIENTO STANDALONE
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // --- Estado de la Aplicación de Evaluación ---
  public candidateName = signal('Candidato Anónimo');
  public seniorityLevel = signal('Semi-senior');

  // Mapeo de estado a puntaje
  private scoreMap: Record<EvaluationStatus, number> = {
    'No aplica': 0,
    'Parcial': 5,
    'Aplica': 10
  };

  public questions = signal<EvaluationQuestion[]>(
    BACKEND_QUESTIONS.map(question => ({
      ...question,
      evaluation: 'No aplica',
      notes: ''
    }))
  );

  public totalScore = computed(() => {
    return this.questions().reduce((total, question) => {
      return total + this.scoreMap[question.evaluation];
    }, 0);
  });

  // --- Métodos manejadores de eventos ---

  onSeniorityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.seniorityLevel.set(target.value);
  }

  onCandidateNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.candidateName.set(target.value);
  }

  updateEvaluation(questionId: string, status: EvaluationStatus) {
    this.questions.update(currentQuestions => {
      return currentQuestions.map(q =>
        q.id === questionId ? { ...q, evaluation: status } : q
      );
    });
  }

  updateNotes(questionId: string, event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const newNotes = textarea.value;
    this.questions.update(currentQuestions => {
      return currentQuestions.map(q =>
        q.id === questionId ? { ...q, notes: newNotes } : q
      );
    });
  }
}
