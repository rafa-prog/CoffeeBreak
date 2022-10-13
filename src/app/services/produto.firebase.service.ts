import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  query,
  where,
  getDocs,
  docData,
  updateDoc,
  deleteDoc,
  Firestore
} from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';

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

  async produtoQuery() {
    const q = query(collection(this.afs, this.PATH), where('adicionais', '==', 'Nenhum'), where('nome', '==', 'Brownie'))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: any) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
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
