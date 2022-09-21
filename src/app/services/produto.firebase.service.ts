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
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoFirebaseService {
  private PATH: string = 'produtos'

  constructor(private afs: Firestore) {

  }

  createProduto(produto: Produto) {
    produto.id = doc(collection(this.afs, 'id')).id
    return addDoc(collection(this.afs, this.PATH), produto)
  }

  readProdutos(): Observable<Produto[]> {
    let prodRef = collection(this.afs, this.PATH)
    return collectionData(prodRef, {idField: 'id'}) as Observable<Produto[]>
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