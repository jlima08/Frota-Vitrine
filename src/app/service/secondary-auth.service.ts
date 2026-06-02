import { Injectable } from '@angular/core';

import {
  initializeApp
} from 'firebase/app';

import {
  createUserWithEmailAndPassword,
  getAuth
} from 'firebase/auth';

import { environment }
from '../../enviroments/environments';

@Injectable({
  providedIn: 'root'
})

export class SecondaryAuthService {

  private secondaryApp = initializeApp(
    environment.firebase,
    'Secondary'
  );

  private secondaryAuth = getAuth(
    this.secondaryApp
  );

  cadastrar(
    email: string,
    senha: string
  ) {

    return createUserWithEmailAndPassword(
      this.secondaryAuth,
      email,
      senha
    );
  }
}