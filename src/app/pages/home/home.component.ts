import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore/firebase';
import { Router } from '@angular/router';
import { collection } from '@firebase/firestore';
import { Produto } from 'src/app/models/produto';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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

  irParaDetalhar() {
    this.router.navigateByUrl('/detalhes-produto')
  }

}
