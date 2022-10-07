import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {
  private auth: any
  constructor(
  private FirebaseApp: FirebaseApp,
  private router: Router) {}

  authentication() {
    this.auth = getAuth()
  }

  createUser(conta: any) {
    return createUserWithEmailAndPassword(this.auth, conta.email, conta.senha)
  }

  signIn(conta: any) {
    return signInWithEmailAndPassword(this.auth, conta.email, conta.senha)
  }

  signOut() {
    return signOut(this.auth)
  }

  usuarioLogado() {
    return this.auth.currentUser
  }

  irParaHome() {
    this.router.navigate(['/#'])
  }

  voltaParaLogin() {
    this.router.navigate(['/'])
  }
}
