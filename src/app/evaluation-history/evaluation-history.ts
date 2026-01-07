import { ChangeDetectionStrategy, Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EvaluationDataService } from '../evaluation-data.service';
import { SavedEvaluation } from '../models/interview.model';

@Component({
  selector: 'app-evaluation-history',
  templateUrl: './evaluation-history.html',
  styleUrls: ['./evaluation-history.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DatePipe],
})
export class EvaluationHistoryComponent implements OnInit {
  private evaluationDataService = inject(EvaluationDataService);
  public evaluations = signal<SavedEvaluation[]>([]);

  ngOnInit() {
    this.evaluationDataService.getEvaluations().subscribe(data => {
      this.evaluations.set(data);
    });
  }

  // FUNCIÓN trackById CORREGIDA PARA MANEJAR UN ID INDEFINIDO
  trackById(index: number, evaluation: SavedEvaluation): string {
    return evaluation.id ?? `${index}`; // Usa el ID si existe, si no, el índice
  }
}
