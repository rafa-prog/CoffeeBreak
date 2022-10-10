import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Produto } from 'src/app/models/produto';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.component.html',
  styleUrls: ['./editar-produto.component.scss']
})
export class DetalhesProdutoComponent implements OnInit {
  produto!: Produto

  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit(): void {

  }

}
