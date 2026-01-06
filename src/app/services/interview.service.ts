import { Injectable, signal, computed } from '@angular/core';
import { BACKEND_QUESTIONS } from '../questions/backend-questions';

export interface InterviewQuestion {
  id: number | string;
  text: string;
  idealAnswer: string;
}

export interface HistoryItem {
  question: InterviewQuestion;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private questions = signal<InterviewQuestion[]>(BACKEND_QUESTIONS);
  private history = signal<HistoryItem[]>([]);
  private currentIndex = signal(0);

  public currentQuestion = computed(() => this.questions()[this.currentIndex()]);
  public isLastQuestion = computed(() => this.currentIndex() === this.questions().length - 1);
  public interviewFinished = computed(() => this.history().length === this.questions().length);

  private googleScriptUrl = 'https://script.google.com/macros/s/AKfycbzsL9qNnuHyqOPSqoQzpRifJ510IR3xt6hPmX9DqMrVB4xCNxNJdkEi2UKoT7rmJob91w/exec';

  constructor() {}

  submitAnswer(answer: string) {
    const currentQ = this.currentQuestion();
    if (currentQ) {
      this.history.update(h => [...h, { question: currentQ, answer }]);
      if (!this.isLastQuestion()) {
        this.currentIndex.update(i => i + 1);
      }
    }
  }

  async saveHistoryToSheet(): Promise<{ success: boolean; message: string }> {
    const historyItems = this.history();
    if (historyItems.length === 0) {
      return { success: false, message: "No hay historial para guardar." };
    }

    const formattedHistory = historyItems
      .map(item => `Pregunta: ${item.question.text}\nRespuesta: ${item.answer}\nRespuesta Ideal: ${item.question.idealAnswer}\n`)
      .join('----------------------------------\n');

    try {
      const response = await fetch(this.googleScriptUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history: formattedHistory }),
        // CAMBIO CRÍTICO: Eliminado 'redirect: follow'
      });

      if (!response.ok) {
         const errorText = await response.text();
         console.error("Respuesta de red no fue OK:", errorText);
         throw new Error(`Error del servidor (status ${response.status}): ${errorText}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        console.log("Historial guardado en Google Sheets");
        return { success: true, message: "¡El historial se ha guardado correctamente en la hoja de cálculo!" };
      } else {
        console.error("Error devuelto por el script de Google:", result.message);
        return { success: false, message: `Error del script: ${result.message}` };
      }
    } catch (error) {
      console.error("Error en la llamada a Google Apps Script:", error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, message: `No se pudo contactar al servicio. Revisa la consola para más detalles. ${errorMessage}` };
    }
  }
}
