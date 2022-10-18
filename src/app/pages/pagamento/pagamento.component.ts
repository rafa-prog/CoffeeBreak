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
  valorTotal!: number

  comandasFiltradas: Comanda[] = [];
  comandas: Comanda[] = [];

  constructor(
  private router: Router,
  private comandaFs: ComandaFirebaseService,
  private authFireService: AuthFirebaseService) {}

  ngOnInit(): void {
    let user = this.authFireService.userLogged()
    if(user === null) {
      this.irParaLogin()
    }

    this.comandaFs.readComandas().subscribe((data: Comanda[]) => {this.comandas = data; this.comandasFiltradas = this.comandas});
  }

  buscarMesa(mesa: number) {
    this.comandasFiltradas = this.comandas.filter(comanda => comanda.mesa === mesa);

    if(this.comandasFiltradas.length > 0) {

    }

    return ''
  }

  async deletarComanda(comanda: Comanda) {
    return await this.comandaFs.deleteComanda(comanda);
  }

  irParaHome() {
    this.router.navigate(['/home']);
  }

  irParaLogin() {
    this.router.navigate(['/']);
  }
}
