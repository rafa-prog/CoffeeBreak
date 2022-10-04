import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Produto } from 'src/app/models/produto';

@Component({
  selector: 'app-detalhes-produto',
  templateUrl: './detalhes-produto.component.html',
  styleUrls: ['./detalhes-produto.component.scss']
})
export class DetalhesProdutoComponent implements OnInit {
  produto!: Produto

  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit(): void {

  }

}
