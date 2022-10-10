import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { Medida } from 'src/app/models/medida';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
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
  teste: string = ''
  categorias: (Medida | string)[] = []
  medidas: string[] = []
  image:any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private authFireService: AuthFirebaseService,
    private produtoFs: ProdutoFirebaseService) { }

  ngOnInit(): void {
    let user = this.authFireService.usuarioLogado()
    if(user !== null) {
      user.providerData.forEach((profile: any) => {
        alert(profile.email)
      })
    }else {
      this.irParaLogin()
    }
    this.categorias = Object.values(Categoria)
    this.medidas = Object.keys(Medida).filter((res) => isNaN(Number(res)))
    this.formInit()
  }

  formInit() {
    this.ProdFormCad = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      tamanho: ['', [Validators.required, Validators.min(0.1)]],
      medida: ['', [Validators.required]],
      adicionais: ['', [Validators.required]],
      foto: ['', [Validators.required]],
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
      this.irParaHome()
    })
    .catch((err) => {
      alert("Erro no cadastro!")
      console.log(err)
    })
  }

  uploadFile(image:any){
    this.image = image.files;
  }

  irParaLogin() {
    this.router.navigate(['/'])
  }

  irParaHome() {
    this.router.navigate(['/home'])
  }

}
