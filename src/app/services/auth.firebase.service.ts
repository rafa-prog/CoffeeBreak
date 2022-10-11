import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {
  private auth: any
  constructor(private FirebaseApp: FirebaseApp) {} // Inicializa o Firebase

  authentication() {
    this.auth = getAuth()
  }

  createUser(conta: any) {
    this.authentication()
    createUserWithEmailAndPassword(this.auth, conta.email, conta.senha)
    .then(() => {
      return updateProfile(this.usuarioLogado(), {displayName: conta.email})
      .then(() => {alert("funcionário cadastrado com sucesso!")})
    })
    .catch((error) => {
      alert("Ocorreu um erro durante o cadastro, tente novamente!")
      return error
    })

    return conta
  }

  signIn(conta: any) {
    this.authentication()
    return signInWithEmailAndPassword(this.auth, conta.email, conta.senha)
  }

  signOut() {
    this.authentication()
    return signOut(this.auth)
  }

  usuarioLogado() {
    this.authentication()
    return this.auth.currentUser
  }
}
