import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario';

import {
  doc,
  addDoc,
  docData,
  updateDoc,
  deleteDoc,
  Firestore,
  collection,
  collectionData
} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})

export class FuncionarioFirebaseService {
  private PATH: string = 'funcionarios'

  constructor(private afs: Firestore) {}

  createFuncionario(funcionario: Funcionario) {
    funcionario.id = doc(collection(this.afs, 'id')).id
    return addDoc(collection(this.afs, this.PATH), funcionario)
  }

  readFuncionarios(): Observable<Funcionario[]> {
    let prodRef = collection(this.afs, this.PATH)
    return collectionData(prodRef, {idField: 'id'}) as Observable<Funcionario[]>
  }

  readFuncionario(id: string): Observable<Funcionario> {
    let prodRef = doc(this.afs, this.PATH + '/' + id)
    return docData(prodRef) as Observable<Funcionario>
  }

  updateFuncionario(funcionario: Funcionario, funcionarios: any) {
    let docRef = doc(this.afs, this.PATH + '/${funcionario.id}')
    return updateDoc(docRef, funcionarios)
  }

  deleteFuncionario(funcionario: Funcionario) {
    let docRef = doc(this.afs, this.PATH + '/${funcionario.id}')
    return deleteDoc(docRef)
  }
}
