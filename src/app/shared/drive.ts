
import { Injectable, inject, effect } from '@angular/core';
import { GoogleAuthService } from '../services/google-auth.service';
import { from, Observable, of, throwError, EMPTY } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

declare var gapi: any;

const FILE_NAME = 'evaluaciones.json';

@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private readonly authService = inject(GoogleAuthService);

  constructor() {
    // Usamos un effect para reaccionar a los cambios de autenticación
    effect(() => {
      if (this.authService.isAuthenticated()) {
        // Si el usuario está autenticado, cargamos la API de Drive
        gapi.load('client', () => {
          gapi.client.load('drive', 'v3');
        });
      } 
    });
  }

  // Carga el historial de evaluaciones desde Google Drive
  public loadHistory(): Observable<any[]> {
    if (!this.authService.isAuthenticated()) {
      return throwError(() => new Error('User not authenticated.'));
    }

    return this.findFileId().pipe(
      switchMap(fileId => {
        if (fileId) {
          // Si el archivo existe, obtiene su contenido
          return from(gapi.client.drive.files.get({ fileId, alt: 'media' })).pipe(
            switchMap((response: any) => {
              try {
                // Aseguramos que el body no esté vacío antes de parsear
                if (!response.body) return of([]);
                const data = JSON.parse(response.body);
                return of(Array.isArray(data) ? data : []);
              } catch (e) {
                console.error('Error parsing JSON from Drive file', e);
                return of([]); // Retorna array vacío si hay error de parseo
              }
            })
          );
        } else {
          // Si el archivo no existe, retorna un array vacío
          return of([]);
        }
      }),
      catchError(err => {
        console.error('Error loading history from Drive', err);
        return of([]); // Retorna array vacío en caso de error
      })
    );
  }

  // Guarda el historial de evaluaciones en Google Drive
  public saveHistory(history: string): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      return throwError(() => new Error('User not authenticated.'));
    }

    const fileMetadata = {
      name: FILE_NAME,
      mimeType: 'application/json',
    };

    const media = {
      mimeType: 'application/json',
      body: history,
    };

    return this.findFileId().pipe(
      switchMap(fileId => {
        if (fileId) {
          // Si el archivo existe, lo actualiza
          return from(gapi.client.drive.files.update({
            fileId: fileId,
            media: media,
          }));
        } else {
          // Si el archivo no existe, lo crea
          return from(gapi.client.drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
          }));
        }
      })
    );
  }

  // Busca el ID del archivo de evaluaciones en Google Drive
  private findFileId(): Observable<string | null> {
    // Esperamos a que el cliente de la API esté listo
    if (!gapi.client?.drive) {
      // Si no está listo, devolvemos un observable que no emite nada
      // y esperamos a que el `effect` haga su trabajo la próxima vez
      return of(null);
    }

    return from(gapi.client.drive.files.list({
      q: `name='${FILE_NAME}' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    })).pipe(
      switchMap((response: any) => {
        const files = response.result.files;
        if (files && files.length > 0) {
          return of(files[0].id);
        } else {
          return of(null);
        }
      })
    );
  }
}
