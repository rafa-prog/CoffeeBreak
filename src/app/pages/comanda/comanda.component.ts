import { Component, OnInit } from '@angular/core';
import { Produto } from 'src/app/models/produto';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.scss']
})
export class ComandaComponent implements OnInit {
  produtos!: Produto[]
  quantidade!: number[]

  quantidadeProduto: number = 1

  constructor() { }

  ngOnInit(): void {
  }

  add(quantidade: number) {
    quantidade += 1
  }

  sub(quantidade: number) {
    quantidade -= 1
  }

}
