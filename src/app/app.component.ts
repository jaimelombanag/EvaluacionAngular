import { Component, signal, computed, ChangeDetectionStrategy, ElementRef, Renderer2, inject, NgZone, ChangeDetectorRef, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewQuestion } from './models/interview-question.model';
import { SavedEvaluation } from './models/interview.model';
import { BACKEND_QUESTIONS } from './questions/backend-questions';
import * as XLSX from 'xlsx';
import { EvaluationHistoryComponent } from './evaluation-history/evaluation-history'; // RUTA CORREGIDA
import { v4 as uuidv4 } from 'uuid';
import { EvaluationDataService } from './evaluation-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EvaluationHistoryComponent, FormsModule],
  styles: [`
    :host {
      --primary-text: #212529;
      --secondary-text: #495057;
      --subtle-text: #6c757d;
      --border-color: #dee2e6;
      --subtle-bg: #f8f9fa;
      --highlight-bg: #e9ecef;
      --white: #ffffff;
      --black: #000000;
      --invalid-border: #dc3545;
      --invalid-bg: #f8d7da;
      background-color: var(--subtle-bg);
    }
    header {
      background-color: var(--primary-text);
      color: var(--white);
      padding: 20px 40px;
      display: flex;
      justify-content: center;
    }
    .title-group {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo { height: 35px; }
    .title-group h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    .evaluation-view-container { padding: 20px 20px 0 20px; }
    main { width: 100%; }
    aside.summary {
      width: auto;
      background-color: var(--white);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
      padding: 30px;
      margin: 20px;
    }
    .candidate-section {
      background-color: var(--white);
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .control-group label {
      display: block;
      margin-bottom: 10px;
      color: var(--primary-text);
      font-weight: 600;
      font-size: 0.95rem;
    }
    .control-group input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      font-size: 1rem;
      transition: all 0.2s ease;
    }
    .control-group input:focus {
      outline: none;
      border-color: var(--primary-text);
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
    }
    .control-group input.invalid { 
      border-color: var(--invalid-border);
      background-color: var(--invalid-bg);
    }
    .evaluation-form h2, .summary h2 { 
      margin-bottom: 20px;
      color: var(--primary-text);
    }
    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .question-card {
      background-color: var(--white);
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border-left: 5px solid transparent;
      transition: border-color 0.3s ease;
    }
    .question-card.invalid { border-left-color: var(--invalid-border); }
    .question-header h3 {
      color: var(--primary-text);
      margin-bottom: 15px;
      font-size: 1.1rem;
    }
    .evaluation-controls {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-bottom: 20px;
    }
    .radio-group input[type="radio"] { display: none; }
    .radio-group label {
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      border: 1px solid var(--border-color);
      background-color: var(--subtle-bg);
      color: var(--secondary-text);
    }
    .radio-group input[type="radio"]:checked + label {
      background-color: var(--secondary-text);
      color: var(--white);
      border-color: var(--secondary-text);
    }
    .ideal-answer {
      background-color: var(--subtle-bg);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 3px solid var(--secondary-text);
    }
    .ideal-answer h4 {
      margin: 0 0 8px 0;
      color: var(--primary-text);
      font-size: 0.9rem;
    }
    .ideal-answer p, .notes textarea {
      margin: 0;
      font-size: 0.95rem;
      color: var(--subtle-text);
    }
    .notes textarea {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      resize: vertical;
    }
    .summary-content p { margin: 0 0 15px 0; font-size: 1rem; }
    .total-score, .final-result {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      background-color: var(--highlight-bg);
    }
    .score-value, .result-value {
      font-weight: 700;
      font-size: 1.2rem;
      color: var(--primary-text);
    }
    .actions-group {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .save-button, .export-button {
      padding: 15px;
      border-radius: 8px;
      border: none;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--white);
    }
    .save-button { background-color: var(--primary-text); }
    .save-button:hover { background-color: var(--black); }
    .export-button { background-color: var(--secondary-text); }
    .export-button:hover { background-color: var(--primary-text); }
    .tab-navigation {
      background-color: var(--primary-text);
      padding: 0 20px;
      display: flex;
    }
    .tab-navigation button {
      background: none;
      border: none;
      color: var(--white);
      padding: 15px 25px;
      cursor: pointer;
      font-size: 1.1rem;
      position: relative;
      opacity: 0.7;
    }
    .tab-navigation button.active {
      opacity: 1;
      font-weight: 600;
    }
    .tab-navigation button.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background-color: var(--white);
      border-radius: 4px 4px 0 0;
    }
    .notification-container, .success-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      background-color: var(--primary-text);
      color: var(--white);
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      font-size: 1.1rem;
      animation: fadeInDown 0.5s ease-out;
    }
    @keyframes fadeInDown {
      from { transform: translateY(-30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    footer {
      background-color: var(--primary-text);
      color: var(--subtle-bg);
      text-align: center;
      padding: 20px;
    }
    .error-message {
      background-color: var(--invalid-bg);
      color: var(--invalid-border);
      border: 1px solid var(--invalid-border);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      text-align: center;
      font-size: 1rem;
      font-weight: 500;
    }
  `]
})
export class AppComponent {
  private evaluationDataService = inject(EvaluationDataService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  activeView = signal('evaluation');

  candidateName = signal('');
  evaluatorName = signal('');
  questions = signal<InterviewQuestion[]>([]);

  candidateNameInvalid = signal(false);
  evaluatorNameInvalid = signal(false);

  showSuccessNotification = signal(false);
  lastSavedCandidateName = signal('');
  saveError = signal<string | null>(null);

  totalScore = computed(() => {
    const evaluatedQuestions = this.questions().filter(q => q.evaluation !== 'No aplica');
    if (evaluatedQuestions.length === 0) return 0;
    const total = evaluatedQuestions.reduce((acc, q) => acc + q.score, 0);
    const maxPossibleScore = evaluatedQuestions.length * 20;
    if (maxPossibleScore === 0) return 0;
    return Math.round((total / maxPossibleScore) * 100);
  });

  finalResult = computed(() => this.totalScore() >= 65 ? 'Aceptado' : 'Rechazado');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadQuestions();
  }

  loadQuestions() {
    const initialQuestions = JSON.parse(JSON.stringify(BACKEND_QUESTIONS));
    this.questions.set(initialQuestions.map((q: InterviewQuestion) => ({ ...q, isInvalid: false })));
  }

  onCandidateNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.candidateName.set(target.value);
    if (target.value) this.candidateNameInvalid.set(false);
  }

  onEvaluatorNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.evaluatorName.set(target.value);
    if (target.value) this.evaluatorNameInvalid.set(false);
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
    this.questions.update(qs => qs.map(q => q.id === questionId ? { ...q, notes: target.value } : q));
  }

  async saveEvaluation() {
    this.saveError.set(null);
    const isCandidateNameMissing = !this.candidateName().trim();
    const isEvaluatorNameMissing = !this.evaluatorName().trim();

    this.candidateNameInvalid.set(isCandidateNameMissing);
    this.evaluatorNameInvalid.set(isEvaluatorNameMissing);

    if (isCandidateNameMissing || isEvaluatorNameMissing) {
        return;
    }

    const unansweredQuestions = this.questions().filter(q => q.evaluation === null);
    if (unansweredQuestions.length > 0) {
        this.saveError.set('Por favor, evalúe todas las preguntas antes de guardar.');
        this.cdr.detectChanges();
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

    try {
      await this.evaluationDataService.saveEvaluation(currentEvaluation);

      this.lastSavedCandidateName.set(currentEvaluation.candidateName);
      this.showSuccessNotification.set(true);
      this.cdr.detectChanges();

      setTimeout(() => {
        this.showSuccessNotification.set(false);
        this.cdr.detectChanges();
      }, 3000);

      this.resetForm();
    } catch (error) {
      console.error('Error al guardar la evaluación:', error);
      this.saveError.set('Hubo un error al guardar la evaluación. Por favor, intente de nuevo.');
      this.cdr.detectChanges();
    }
  }

  resetForm() {
    this.candidateName.set('');
    this.evaluatorName.set('');
    this.candidateNameInvalid.set(false);
    this.evaluatorNameInvalid.set(false);
    this.loadQuestions();
    this.saveError.set(null);
  }

  async exportToXlsx() {
    // ... (código de exportación sin cambios)
  }
}
