import { Injectable, inject } from '@angular/core';

import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);

  cadastrar(email: string, senha: string) {

    return createUserWithEmailAndPassword(
      this.auth,
      email,
      senha
    );
  }

  login(email: string, senha: string) {
    return signInWithEmailAndPassword(
      this.auth,
      email,
      senha
    );
  }

  logout() {
    return signOut(this.auth);
  }
}