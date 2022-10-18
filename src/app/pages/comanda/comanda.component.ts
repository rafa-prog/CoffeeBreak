import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comanda } from 'src/app/models/comanda';
import { Produto } from 'src/app/models/produto';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.scss']
})
export class ComandaComponent implements OnInit {
  produtos!: Produto[]
  quantidade!: number[]

  comanda: Comanda;

  quantidadeProduto: number = 1

  constructor(
  private router: Router,
  private authFireService: AuthFirebaseService) {
    
  }

  ngOnInit(): void {/*    let user = this.authFireService.userLogged()
    if(user === null) {
      this.irParaLogin()
    }
    */
  }

  add(quantidade: number) {
    quantidade += 1
  }

  sub(quantidade: number) {
    quantidade -= 1
  }

  irParaLogin() {
    this.router.navigate(['/'])
  }
}
