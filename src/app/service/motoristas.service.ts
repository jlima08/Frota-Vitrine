import { computed, inject, Injectable, signal } from '@angular/core';
import { Motorista } from '../interfaces/motorista.interface';
import { Observable } from 'rxjs';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import {
  doc,
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MotoristasService {
  private firestore = inject(Firestore);

  cadastrar(motorista: Motorista) {

    const motoristaRef = collection(
      this.firestore,
      'usuarios'
    );

    return addDoc(motoristaRef, motorista);
  }

  listar(): Observable<Motorista[]> {

    const motoristaRef = collection(
      this.firestore,
      'usuarios'
    );

    return collectionData(motoristaRef, {
      idField: 'id'
    }) as Observable<Motorista[]>;
  }

  atualizar(id: string, motorista: Partial<Motorista>) {

  const motoristaDoc = doc(
    this.firestore,
    `usuarios/${id}`
  );

  return updateDoc(motoristaDoc, motorista);
}

   
}
