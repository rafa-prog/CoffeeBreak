import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comanda } from 'src/app/models/comanda';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { ComandaFirebaseService } from 'src/app/services/comanda.firebase.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {
  quantidade!: number[]
  valorTotal!: number
  comanda!: Comanda

  constructor(
  private router: Router,
  private comandaFs: ComandaFirebaseService,
  private authFireService: AuthFirebaseService) {}

  ngOnInit(): void {
    let user = this.authFireService.userLogged()
    if(user === null) {
      this.irParaLogin()
    }
  }

  buscarMesa(mesa: number) {
    this.comandaFs.comandaQueryByMesa(mesa).then((data: Comanda) => {this.comanda = data})
    console.log(this.comanda)
    this.quantidade = this.comanda.quantidade
    return ''
  }

  irParaHome() {
    this.router.navigate(['/home'])
  }

  irParaLogin() {
    this.router.navigate(['/'])
  }
}
