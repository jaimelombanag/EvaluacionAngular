
import { Injectable, NgZone, signal } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  public isAuthenticated = signal(false);
  public userName = signal('');

  constructor(private ngZone: NgZone) {
    this.loadGisScript();
  }

  private loadGisScript() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      console.log('[AuthService] Google Identity Script cargado.');
      this.initializeGis();
    };
    document.body.appendChild(script);
  }

  private initializeGis() {
    console.log('[AuthService] Inicializando Google Identity Services...');
    google.accounts.id.initialize({
      // ESTE ES EL CAMBIO CRÍTICO: Tu ID de cliente, el correcto.
      client_id: '35315349388-kuja1721osmnlqbje7gneudc3c8kovo9.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      use_fedcm_for_prompt: false
    });
    this.renderButton();
  }

  private handleCredentialResponse(response: any) {
    console.log('[AuthService] handleCredentialResponse FUE ACTIVADO.');
    this.ngZone.run(() => {
      console.log('[AuthService] Ejecutando dentro de NgZone.');
      if (response.credential) {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        console.log(`[AuthService] Usuario detectado: ${payload.name}`);
        this.userName.set(payload.name);
        this.isAuthenticated.set(true);
        console.log(`[AuthService] La señal isAuthenticated ahora es: ${this.isAuthenticated()}`);
      } else {
        console.error("[AuthService] ERROR en la respuesta de credenciales:", response);
      }
    });
  }

  private renderButton() {
    console.log('[AuthService] Mostrando el pop-up de Google One Tap...');
    google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
            console.warn("[AuthService] El pop-up de Google no se mostró. Razón:", notification.getNotDisplayedReason());
        }
    });
  }
  
  signOut() {
      google.accounts.id.disableAutoSelect();
      this.ngZone.run(() => {
          this.isAuthenticated.set(false);
          this.userName.set('');
      });
      location.reload();
  }
}
