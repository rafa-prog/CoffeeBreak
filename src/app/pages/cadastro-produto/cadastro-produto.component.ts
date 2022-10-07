import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';

//Batata

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.scss']
})
export class CadastroProdutoComponent implements OnInit {
  ProdFormCad: FormGroup = this.formBuilder.group({})
  isSubmitted: boolean = false
  image:any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private produtoFs: ProdutoFirebaseService) { }

  ngOnInit(): void {
    this.ProdFormCad = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      categoria: ['', Validators.required],
      tamanho: ['', [Validators.required, Validators.min(0)]],
      medida: ['', Validators.required],
      adicionais: ['', Validators.required],
      foto: ['', Validators.required],
      preco: ['', [Validators.required, Validators.min(0)]],
    })
  }

  onSubmit(): boolean {
    this.isSubmitted = true
    if(!this.ProdFormCad.valid) {
      alert("Todos os campos são obrigatórios!")
      return false
    }

    this.cadastrar()
    return true
  }

  get errorControl() {
    return this.ProdFormCad.controls
  }

  private cadastrar() {
    this.produtoFs.createProduto(this.ProdFormCad.value)
    .then(() => {
      alert("Produto cadastrado")
      this.router.navigate(['/'])
    })
    .catch((err) => {
      alert("Erro no cadastro!")
      console.log(err)
    })
  }
  uploadFile(image:any){
    this.image = image.files;
  }

}
