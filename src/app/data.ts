
import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Interfaz para los datos de la pregunta tal como vienen de Firestore
export interface Question {
    id: string;
    text: string;
    idealAnswer: string;
}

// Interfaz para una pregunta en la UI, incluyendo el estado de la evaluación
export interface EvaluationQuestion extends Question {
  evaluation: 'No aplica' | 'Parcial' | 'Aplica' | null;
  notes: string;
}

// Interfaz para el documento completo de la evaluación que se guardará en Firestore
export interface Evaluation {
  candidateName: string;
  seniorityLevel: string;
  questions: EvaluationQuestion[];
  totalScore: number;
  evaluationDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private firestore = inject(Firestore);
  private questionsCollection = collection(this.firestore, 'questions');

  /**
   * Obtiene la lista de preguntas base desde Firestore.
   * @returns Un Observable con un array de preguntas.
   */
  getQuestions(): Observable<Question[]> {
    // Usamos collectionData para obtener los datos y 'id' como el campo de ID del documento
    return collectionData(this.questionsCollection, {
      idField: 'id',
    }) as Observable<Question[]>; // <-- Corregido el tipo de retorno
  }

  /**
   * Guarda una evaluación completada en la colección 'evaluations' de Firestore.
   * @param evaluation - El objeto de la evaluación a guardar.
   * @returns Una promesa que se resuelve con la referencia al documento creado.
   */
  saveEvaluation(evaluation: Evaluation) {
    const evaluationsCollection = collection(this.firestore, 'evaluations');
    return addDoc(evaluationsCollection, evaluation);
  }
}
