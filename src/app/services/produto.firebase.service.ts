import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';

import {
  doc,
  query,
  where,
  addDoc,
  docData,
  getDocs,
  updateDoc,
  deleteDoc,
  Firestore,
  collection,
  collectionData
} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})

export class ProdutoFirebaseService {
  private PATH: string = 'produtos'

  constructor(private afs: Firestore) {}

  createProduto(produto: Produto) {
    produto.id = doc(collection(this.afs, 'id')).id
    return addDoc(collection(this.afs, this.PATH), produto)
  }

  readProdutos(): Observable<Produto[]> {
    let prodRef = collection(this.afs, this.PATH)
    return collectionData(prodRef, {idField: 'id'}) as Observable<Produto[]>
  }

  async produtoQueryByCategoria(categoria: string) {
    const q = query(collection(this.afs, this.PATH), where('categoria', '==', categoria))
    let produtos: any[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: any) => {
      produtos.push(doc.data() as Observable<Produto[]>)
    });

    return produtos as Produto[]
  }

  readProduto(id: string): Observable<Produto> {
    let prodRef = doc(this.afs, this.PATH + '/' + id)
    return docData(prodRef) as Observable<Produto>
  }

  updateProduto(produto: Produto, produtos: any) {
    let docRef = doc(this.afs, this.PATH + '/${produto.id}')
    return updateDoc(docRef, produtos)
  }

  deleteProduto(produto: Produto) {
    let docRef = doc(this.afs, this.PATH + '/${produto.id}')
    return deleteDoc(docRef)
  }
}
