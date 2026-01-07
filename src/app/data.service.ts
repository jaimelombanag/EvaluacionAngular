import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, Timestamp, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SavedEvaluation } from './models/interview.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore: Firestore = inject(Firestore);
  private evaluationsCollection = collection(this.firestore, 'evaluations');
  private sessionsCollection = collection(this.firestore, 'sessions');

  constructor() { }

  addEvaluation(evaluation: SavedEvaluation): Promise<any> {
    const jsDate = evaluation.timestamp instanceof Date ? evaluation.timestamp : new Date(evaluation.timestamp);
    const evaluationForFirestore = {
      ...evaluation,
      timestamp: Timestamp.fromDate(jsDate)
    };
    return addDoc(this.evaluationsCollection, evaluationForFirestore);
  }

  getEvaluations(): Observable<SavedEvaluation[]> {
    return (collectionData(this.evaluationsCollection, { idField: 'id' }) as Observable<SavedEvaluation[]>).pipe(
      map(evaluations => {
        if (!evaluations) {
          return [];
        }
        return evaluations.map(ev => {
          const timestamp = ev.timestamp as any;
          const date = timestamp?.toDate ? timestamp.toDate() : new Date();
          return { ...ev, timestamp: date };
        });
      }),
      catchError(error => {
        console.error('Error al obtener las evaluaciones:', error);
        return of([]);
      })
    );
  }

  // NUEVO: Obtiene el estado de la vista desde Firestore
  async getViewState(sessionId: string): Promise<string> {
    if (!sessionId) return 'evaluation';
    try {
      const sessionDocRef = doc(this.sessionsCollection, sessionId);
      const docSnap = await getDoc(sessionDocRef);
      if (docSnap.exists()) {
        return docSnap.data()['activeView'] || 'evaluation';
      } else {
        await setDoc(sessionDocRef, { activeView: 'evaluation' });
        return 'evaluation';
      }
    } catch (error) {
      console.error("Error al obtener el estado de la vista desde Firestore:", error);
      return 'evaluation'; // Valor por defecto en caso de error
    }
  }

  // NUEVO: Guarda el estado de la vista en Firestore
  async setViewState(sessionId: string, view: string): Promise<void> {
    if (!sessionId) return;
    const sessionDocRef = doc(this.sessionsCollection, sessionId);
    try {
      await setDoc(sessionDocRef, { activeView: view }, { merge: true });
    } catch (error) {
      console.error("Error al guardar el estado de la vista en Firestore:", error);
    }
  }
}
