import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';

import { FirebaseApp } from '@angular/fire/app';
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

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';


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

  async enviarImg(imagem: any, produto: Produto) {

    const storage = getStorage()

    const path = `imagens/${new Date().getTime()}_${imagem.name}`

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, imagem);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          produto.foto = downloadURL;
          console.log('teste ' + produto.foto)
          //this.createProduto(produto)
        });
      })
  }
}
