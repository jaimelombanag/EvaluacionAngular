import { Component, inject, ChangeDetectionStrategy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { DataService } from '../data.service';
import { SavedEvaluation } from '../models/interview.model';

@Component({
  selector: 'app-evaluation-history',
  // REFACTORIZACIÓN FINAL: Convertir a componente con plantilla y estilos en línea para garantizar la consistencia.
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="history-container">
      <h2 class="history-title">Historial de Evaluaciones</h2>

      <!-- Leemos la señal de evaluaciones -->
      @if (evaluations().length > 0) {
        <div class="history-grid">
          <!-- Usamos @for para iterar sobre la señal -->
          @for (evaluation of evaluations(); track trackById) {
            <div class="evaluation-card">
              <div class="card-header">
                <h3>{{ evaluation.candidateName }}</h3>
                <span class="evaluation-date">{{ evaluation.timestamp | date: 'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="card-body">
                <p><strong>Evaluador:</strong> {{ evaluation.evaluatorName }}</p>
                <!-- CORREGIDO: La clase ahora es 'status-...' para coincidir con el CSS -->
                <p><strong>Resultado:</strong> <span [class]="'status-' + evaluation.finalResult.toLowerCase()">{{ evaluation.finalResult }}</span></p>
                <p><strong>Puntuación:</strong> {{ evaluation.totalScore }} / {{ evaluation.questions.length * 5 }}</p>
              </div>
            </div>
          } 
        </div>
      } @else {
        <p class="empty-state">No hay evaluaciones guardadas para mostrar.</p>
      }
    </div>
  `,
  styles: [`
    .history-container {
      padding: 2rem;
      background-color: #f9f9f9;
    }
    .history-title {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
      font-weight: 600;
    }
    .history-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .evaluation-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: transform 0.2s ease-in-out;
    }
    .evaluation-card:hover {
        transform: translateY(-5px);
    }
    .card-header {
      background-color: #4A90E2;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-header h3 {
        margin: 0;
        font-size: 1.2rem;
    }
    .evaluation-date {
        font-size: 0.8rem;
    }
    .card-body {
      padding: 1rem;
    }
    .card-body p {
        margin: 0.5rem 0;
    }
    .status-accepted {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 15px;
      background-color: #d4edda;
      color: #155724;
      font-weight: 500;
    }
    .status-rejected {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 15px;
      background-color: #f8d7da;
      color: #721c24;
      font-weight: 500;
    }
    .empty-state {
      text-align: center;
      color: #777;
      font-size: 1.1rem;
      padding: 2rem;
    }
  `]
})
export class EvaluationHistoryComponent {
  private dataService = inject(DataService);

  public evaluations: Signal<SavedEvaluation[]> = toSignal(this.dataService.getEvaluations(), { initialValue: [] });

  trackById(index: number, evaluation: SavedEvaluation): string {
    return evaluation.id || index.toString();
  }
}
