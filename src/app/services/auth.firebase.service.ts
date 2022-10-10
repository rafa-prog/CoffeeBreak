import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

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
    return createUserWithEmailAndPassword(this.auth, conta.email, conta.senha)
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
