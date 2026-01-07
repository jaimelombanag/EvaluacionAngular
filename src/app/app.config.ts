import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

const firebaseConfig = environment.firebase;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    // ELIMINADO: La persistencia sin conexión se elimina para evitar el error fatal.
    // La aplicación funcionará ahora solo en modo online.
    provideFirestore(() => getFirestore()),
  ],
};
