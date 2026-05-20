import { inject, Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Movimentacao } from '../interfaces/movimentacao.interface';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {

  private firestore = inject(Firestore);

  cadastrar(movimentacao: Movimentacao) {

    const movimentacaoRef = collection(
      this.firestore,
      'movimentacoes'
    );

    return addDoc(
      movimentacaoRef,
      movimentacao
    );
  }

  listar(): Observable<Movimentacao[]> {

    const movimentacaoRef = collection(
      this.firestore,
      'movimentacoes'
    );

    return collectionData(
      movimentacaoRef,
      {
        idField: 'id'
      }
    ) as Observable<Movimentacao[]>;
  }

  finalizarMovimentacao(id: string) {

  const movimentacaoDoc = doc(
    this.firestore,
    `movimentacoes/${id}`
  );

  return updateDoc(
    movimentacaoDoc,
    {

      status: 'Finalizado',

      dataDevolucao:
        new Date().toISOString()
    }
  );
}
}