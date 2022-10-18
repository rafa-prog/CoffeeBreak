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

import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})

export class ProdutoFirebaseService {
  private PATH: string = 'produtos'

  constructor(private afs: Firestore) {}

  createProduto(produto: Produto) {
    produto.id = doc(collection(this.afs, 'id')).id
    return addDoc(collection(this.afs, this.PATH), produto)
    .then(() =>{alert('Produto cadastrado com sucesso!')})
    .catch(() => {alert('Erro ao cadastrar o produto, tente novamente!')})
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

  updateProduto(produto: Produto) {
    let docRef = doc(this.afs, this.PATH + '/' + produto.id)
    return updateDoc(docRef, {
      nome: produto.nome,
      categoria: produto.categoria,
      medida: produto.medida,
      tamanho: produto.tamanho,
      descricao: produto.descricao,
      preco: produto.preco,
      foto: produto.foto,
      adicionais: produto.adicionais
    })
    .then(() => {alert('Produto editado com sucesso!')})
  }

  deleteProduto(produto: Produto) {
    let docRef = doc(this.afs, this.PATH + '/' + produto.id)
    return deleteDoc(docRef)
  }

  enviarImg(imagem: any, produto: Produto) {

    const storage = getStorage()

    const path = `imagens/${new Date().getTime()}_${imagem.name}`

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, imagem);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            alert("Você não possui permissão para isso!")
            break;
          case 'storage/canceled':
            alert('Download cancelado!')
            break;
          case 'storage/unknown':
            alert('Um erro inesperado aconteceu!')
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          produto.foto = downloadURL;
          this.createProduto(produto)
        });
      })
  }

  updateImg(imagem: any, produto: Produto) {
    // Primeiro excluir a imagem
    const storage = getStorage();

    const firePath = 'https://firebasestorage.googleapis.com/v0/b/appproduto-5be2b.appspot.com/o/';

    const link = produto.foto;

    let imagePath:string = link.replace(firePath,"");

    const indexOfEndPath = imagePath.indexOf("?");

    imagePath = imagePath.substring(0, indexOfEndPath);

    imagePath = imagePath.replace("%2F","/");

    const imageRef = ref(storage, imagePath);

    deleteObject(imageRef).catch((err) => {alert(err);})

    // Envio da imagem
    const path = `imagens/${new Date().getTime()}_${imagem.name}`

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, imagem);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            alert("Você não possui permissão para isso!")
            break;
          case 'storage/canceled':
            alert('Download cancelado!')
            break;
          case 'storage/unknown':
            alert('Um erro inesperado aconteceu!')
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          produto.foto = downloadURL;
          this.updateProduto(produto)
        });
      })
  }
}
