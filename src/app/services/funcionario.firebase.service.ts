import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario';

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

  async produtoQueryByEmail(email: string) {
    const q = query(collection(this.afs, this.PATH), where('email', '==', email))
    let produtos: any[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: any) => {
      produtos.push(doc.data() as Observable<Funcionario[]>)
    });

    return produtos[0] as Funcionario
  }

  updateFuncionario(funcionario: Funcionario) {
    let docRef = doc(this.afs, this.PATH + '/' + funcionario.id);
    return updateDoc(docRef, {
      nome: funcionario.nome,
      telefone: funcionario.telefone,
      email: funcionario.email,
      admin: funcionario.admin
    })
    .then(() => {alert('Funcionário atualizado com sucesso!')})
    .catch(() => {alert('Erro ao atualizar funcionário!')})
  }

  deleteFuncionario(funcionario: Funcionario) {
    let docRef = doc(this.afs, this.PATH + '/' + funcionario.id)
    return deleteDoc(docRef)
  }
}
