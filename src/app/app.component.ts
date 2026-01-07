import { Component, signal, computed, ChangeDetectionStrategy, ElementRef, Renderer2, inject, NgZone, ChangeDetectorRef, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewQuestion } from './models/interview-question.model';
import { SavedEvaluation } from './models/interview.model';
import { BACKEND_QUESTIONS } from './questions/backend-questions';
import * as XLSX from 'xlsx';
import { DataService } from './data.service';
import { EvaluationHistoryComponent } from './evaluation-history/evaluation-history.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EvaluationHistoryComponent, FormsModule]
})
export class AppComponent {
  private dataService = inject(DataService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private sessionId: string | null = null;

  // La vista activa se inicializa en 'evaluation' y se actualiza asíncronamente desde Firestore.
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
    this.initializeSessionAndView();

    // Este 'effect' guarda el estado de la vista en Firestore cada vez que cambia.
    effect(() => {
      if (this.sessionId) {
        this.dataService.setViewState(this.sessionId, this.activeView());
      }
    });
  }

  private async initializeSessionAndView(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('sessionId', sessionId);
      }
      this.sessionId = sessionId;

      const storedView = await this.dataService.getViewState(this.sessionId);
      this.activeView.set(storedView);
      this.cdr.detectChanges();
    }
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
      await this.dataService.addEvaluation(currentEvaluation);

      this.zone.run(() => {
        this.lastSavedCandidateName.set(currentEvaluation.candidateName);
        this.showSuccessNotification.set(true);
        setTimeout(() => this.showSuccessNotification.set(false), 3000);
        this.resetForm();
      });

    } catch (error: any) {
      console.error("Error detallado al guardar en Firestore: ", error);
      this.saveError.set(`Error al guardar: ${error.message || 'Error desconocido.'}`);
      this.cdr.detectChanges();
    }
  }

  resetForm() {
    this.candidateName.set('');
    this.evaluatorName.set('');
    this.candidateNameInvalid.set(false);
    this.evaluatorNameInvalid.set(false);
    this.loadQuestions();
  }

  async exportToXlsx() {
    // ... (código de exportación sin cambios)
  }
}
