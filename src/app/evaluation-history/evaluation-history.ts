import { ChangeDetectionStrategy, Component, signal, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { EvaluationDataService } from '../evaluation-data.service';
import { SavedEvaluation } from '../models/interview.model';
import * as XLSX from 'xlsx';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.evaluationDataService.getEvaluations().subscribe(data => {
      this.evaluations.set(data);
    });
  }

  trackById(index: number, evaluation: SavedEvaluation): string {
    return evaluation.id ?? `${index}`;
  }

  exportToXlsx(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const evals = this.evaluations();

    if (!evals || evals.length === 0) {
        console.warn('No hay evaluaciones para exportar.');
        return;
    }

    const exportData = evals.map(evaluation => {
        const rowData: { [key: string]: any } = {
            'Candidato': evaluation.candidateName,
            'Evaluador': evaluation.evaluatorName,
            'Fecha': evaluation.timestamp,
            'Puntuación Total': evaluation.totalScore,
            'Resultado Final': evaluation.finalResult,
        };

        evaluation.questions.forEach(question => {
            rowData[question.question] = question.evaluation;
            rowData[`Comentarios - ${question.question}`] = question.notes;
        });

        return rowData;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Evaluaciones': worksheet }, SheetNames: ['Evaluaciones'] };

    const fileName = `Historial_Evaluaciones_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }
}
