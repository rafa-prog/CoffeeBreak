import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  Firestore
} from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario';

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

  updateFuncionario(funcionario: Funcionario, funcionarios: any) {
    let docRef = doc(this.afs, this.PATH + '/${funcionario.id}')
    return updateDoc(docRef, funcionarios)
  }

  deleteFuncionario(funcionario: Funcionario) {
    let docRef = doc(this.afs, this.PATH + '/${funcionario.id}')
    return deleteDoc(docRef)
  }
}
