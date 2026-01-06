import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewService } from '../../services/interview.service';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  // CORRECCIÓN: Se elimina styleUrls y se añaden estilos inline
  styles: [`
    .interview-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      font-family: sans-serif;
    }
    .card {
      width: 100%;
      max-width: 600px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 2rem;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InterviewComponent {
  interviewService = inject(InterviewService);

  currentQuestion = this.interviewService.currentQuestion;
  userAnswer = '';
  isSaving = false;
  saveStatusMessage = '';

  submitAnswer() {
    if (!this.userAnswer.trim()) return;
    
    this.interviewService.submitAnswer(this.userAnswer);
    this.userAnswer = '';
    this.saveStatusMessage = '';

    if(this.interviewService.interviewFinished()) {
        this.saveStatusMessage = "Entrevista completada. ¡Puedes guardar ahora!";
    }
  }

  async saveInterview() {
    this.isSaving = true;
    this.saveStatusMessage = 'Guardando y Sincronizando...';
    const result = await this.interviewService.saveHistoryToSheet();
    this.isSaving = false;

    this.saveStatusMessage = result.message;
  }
}
