import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { Funcionario } from '../models/funcionario';
import { FuncionarioFirebaseService } from './funcionario.firebase.service';

@Injectable({
  providedIn: 'root'
})

export class AuthFirebaseService {
  private auth: any

  constructor(
  private fireApp: FirebaseApp, // Inicializa o Firebase
  private funcionarioFs: FuncionarioFirebaseService) {}

  authentication() {
    return this.auth = getAuth()
  }

  createUser(conta: Funcionario, senha: string) {
    this.authentication()

    createUserWithEmailAndPassword(this.auth, conta.email, senha)
    .then(() => {
      let funcionario = {id: '', nome: conta.nome, telefone: conta.telefone, email: conta.email, admin: conta.admin}

      this.funcionarioFs.createFuncionario(funcionario)
      .then(() => {alert("funcionário cadastrado com sucesso!")})
      .catch((error) => {
        console.log('testes')
        alert("Ocorreu um erro durante o cadastro, tente novamente!")
        return error
      })
    })
    .catch((error) => {
      console.log('vixi')
      alert("Ocorreu um erro durante o cadastro, tente novamente! " + error)
      return error
    })
  }

  updateUser(email: string) {
    this.authentication()

    return sendPasswordResetEmail(this.auth, email)
    .then(() => {
      alert('Enviando recuperação de senha para: ' + email + ', verifique a caixa de spam/lixo também!')
    })
    .catch(() => {
      alert('Ocorreu um erro durante o envio do email para redefinir a senha')
    });
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

