import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from 'src/app/models/produto';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  produtos: Produto[] = [];

  constructor(private router: Router,
    private produtoFs: ProdutoFirebaseService) { }

  ngOnInit(): void {
    this.carregarProdutos()
  }

  carregarProdutos() {
    this.produtoFs.readProdutos().subscribe((data: Produto[]) => {this.produtos = data})
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro-produto'])
  }

  irParaEditar() {
    this.router.navigateByUrl('/editar-produto')
  }
  irParaCadastroFuncionario(){
    this.router.navigateByUrl('/cadastro-funcionario')
  }
}
