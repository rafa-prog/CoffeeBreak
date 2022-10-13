import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Adicional } from 'src/app/models/adicional';
import { Categoria } from 'src/app/models/categoria';
import { Medida } from 'src/app/models/medida';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';


@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.scss']
})

export class CadastroProdutoComponent implements OnInit {
  FormCadProd: FormGroup = this.formBuilder.group({})
  isSubmitted: boolean = false

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  adicionais: Adicional[] = [];
  addOnBlur = true;

  categorias!: string[]

  medida: string = '';
  medidas!: string[]

  image:any;

  constructor(
  private router: Router,
  private formBuilder: FormBuilder,
  private produtoFs: ProdutoFirebaseService,
  private authFireService: AuthFirebaseService) { }

  ngOnInit(): void {
    /*
    let user = this.authFireService.userLogged()
    if(user !== null) {
      user.providerData.forEach((profile: any) => {
        alert(profile.email)
      })
    }else {
      this.irParaLogin()
    }
    */

    this.categorias = Object.values(Categoria)
    this.medidas = Object.keys(Medida).filter((res) => isNaN(Number(res)))
    this.formInit()
  }

  formInit() {
    this.FormCadProd = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      tamanho: ['', [Validators.required, Validators.min(0.1)]],
      medida: ['', [Validators.required]],
      adicionais: ['', []],
      foto: [null, [Validators.required]],
      preco: ['', [Validators.required, Validators.min(0)]],
    })
  }

  getErrorControl(control: string, error: string): boolean {
    return (this.FormCadProd.controls[control].touched && this.FormCadProd.controls[control].hasError(error))
  }

  onSubmit(): boolean {
    this.isSubmitted = true
    if(!this.FormCadProd.valid) {
      alert("Todos os campos são obrigatórios!")
      return false
    }

    this.cadastrar()
    return true
  }

  private cadastrar() {
    this.produtoFs.createProduto(this.FormCadProd.value)
    .then(() => {
      alert("Produto cadastrado")
      this.irParaHome()
    })
    .catch((err) => {
      alert("Erro no cadastro!")
      console.log(err)
    })
  }

  salvaMedida(medida: string) {
    this.medida = medida
    console.log(medida)
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.adicionais.push({nome: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(adicional: Adicional): void {
    const index = this.adicionais.indexOf(adicional);

    if (index >= 0) {
      this.adicionais.splice(index, 1);
    }
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
