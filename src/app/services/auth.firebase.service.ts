import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Funcionario } from '../models/funcionario';
import { FuncionarioFirebaseService } from './funcionario.firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {
  private auth: any

  constructor(
  private fireApp: FirebaseApp,
  private funcionarioFs: FuncionarioFirebaseService) {} // Inicializa o Firebase

  authentication() {
    this.auth = getAuth()
  }

  createUser(conta: Funcionario, senha: string) {
    this.authentication()
    console.log(conta, '/n', senha)
    createUserWithEmailAndPassword(this.auth, conta.email, senha)
    .then(() => {
      let funcionario = {id: '', nome: conta.nome, telefone: conta.telefone, email: conta.email, admin: conta.admin}
      this.funcionarioFs.createFuncionario(funcionario)
      .catch((error) => {
        console.log('testes')
        alert("Ocorreu um erro durante o cadastro, tente novamente!")
        return error
      })

      return updateProfile(this.userLogged(), {displayName: conta.email})
      .then(() => {alert("funcionário cadastrado com sucesso!")})
    })
    .catch((error) => {
      console.log('vixi')
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

  userLogged() {
    this.authentication()
    return this.auth.currentUser
  }
}
