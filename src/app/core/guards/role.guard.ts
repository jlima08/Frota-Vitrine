import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  Auth,
  onAuthStateChanged
} from '@angular/fire/auth';

import {
  doc,
  Firestore,
  getDoc
} from '@angular/fire/firestore';

export const roleGuard: CanActivateFn = () => {

  const auth = inject(Auth);

  const firestore = inject(Firestore);

  const router = inject(Router);

  return new Promise<boolean>((resolve) => {

    onAuthStateChanged(auth, async (motorista) => {

      // não logado
      if (!motorista) {

        router.navigate(['/login']);

        resolve(false);

        return;
      }

      // busca motorista no firestore
      const motoristaDoc = doc(

        firestore,

        `usuarios/${motorista.uid}`
      );

      const motoristaSnap =
        await getDoc(motoristaDoc);

      const motoristaData =
        motoristaSnap.data();

      // admin pode acessar
      if (
        motoristaData?.['role']
        === 'Administrador'
      ) {

        resolve(true);

        return;
      }

      // bloqueia motorista comum
      router.navigate([
        '/restrito/veiculos'
      ]);

      resolve(false);
    });
  });
};