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

  createComanda(comanda: Comanda) {
    console.log(comanda)
    comanda.id = doc(collection(this.afs, 'id')).id
    return addDoc(collection(this.afs, this.PATH), comanda)
  }

  readComandas(): Observable<Comanda[]> {
    let prodRef = collection(this.afs, this.PATH)
    return collectionData(prodRef, {idField: 'id'}) as Observable<Comanda[]>
  }

  readComanda(id: string): Observable<Comanda> {
    let prodRef = doc(this.afs, this.PATH + '/' + id)
    return docData(prodRef) as Observable<Comanda>
  }

  async comandaQueryByMesa(mesa: number) {
    const q = query(collection(this.afs, this.PATH), where('mesa', '==', mesa))
    let comandas: any[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: any) => {
      comandas.push(doc.data() as Observable<Comanda[]>)
    });

    return comandas[0] as Comanda
  }

  updateComanda(id: string, comanda: Comanda) {
    let docRef = doc(this.afs, this.PATH + '/' + id)
    return updateDoc(docRef,
      {
        mesa: comanda.mesa,
        produtos: comanda.produtos,
        quantidade: comanda.quantidade
      })
  }

  deleteComanda(comanda: Comanda) {
    let docRef = doc(this.afs, this.PATH + '/${comanda.id}')
    return deleteDoc(docRef)
  }
}
