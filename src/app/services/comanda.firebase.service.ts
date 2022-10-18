import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comanda } from '../models/comanda';

import {
  doc,
  query,
  where,
  addDoc,
  getDocs,
  docData,
  updateDoc,
  deleteDoc,
  Firestore,
  collection,
  collectionData,
} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})

export class ComandaFirebaseService {
  private PATH: string = 'comandas'

  constructor(private afs: Firestore) {}

  async createComanda(comanda: Comanda) {
    comanda.id = doc(collection(this.afs, 'id')).id
    return await addDoc(collection(this.afs, this.PATH), comanda)
    .then(() => alert('Comanda criada com sucesso!'))
    .catch((err) => alert('Falha ao criar comanda!'))
  }

  readComandas(): Observable<Comanda[]> {
    let prodRef = collection(this.afs, this.PATH)
    return collectionData(prodRef, {idField: 'id'}) as Observable<Comanda[]>
  }

  readComanda(id: string): Observable<Comanda> {
    let prodRef = doc(this.afs, this.PATH + '/' + id)
    return docData(prodRef) as Observable<Comanda>
  }

  async updateComanda(comanda: Comanda) {
    let docRef = doc(this.afs, this.PATH + '/' + comanda.id)
    return await updateDoc(docRef, {
        mesa: comanda.mesa,
        produtos: comanda.produtos,
        quantidade: comanda.quantidade,
        pago: comanda.pago,
        dataRegistro: comanda.dataRegistro
    })
    .catch(err => alert('Erro ao atualizar comanda!'));
  }

  async deleteComanda(comanda: Comanda) {
    let docRef = doc(this.afs, this.PATH + "/" + comanda.id)
    return await deleteDoc(docRef)
  }
}
