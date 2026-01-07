import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, orderBy } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SavedEvaluation } from './models/interview.model'; // RUTA CORREGIDA

@Injectable({
  providedIn: 'root'
})
export class EvaluationDataService {
  private firestore: Firestore = inject(Firestore);
  private evaluationsCollection = collection(this.firestore, 'evaluations');

  getEvaluations(): Observable<SavedEvaluation[]> {
    const q = query(this.evaluationsCollection, orderBy('timestamp', 'desc'));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          const timestamp = data['timestamp'] ? data['timestamp'].toDate() : new Date();
          return { id, ...data, timestamp } as SavedEvaluation;
        });
      })
    );
  }

  saveEvaluation(evaluation: SavedEvaluation) {
    return addDoc(this.evaluationsCollection, evaluation);
  }
}
