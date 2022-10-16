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
import { Produto } from 'src/app/models/produto';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.component.html',
  styleUrls: ['./editar-produto.component.scss']
})

export class EditarProdutoComponent implements OnInit {
  // Formulários
  FormEditProd: FormGroup = this.formBuilder.group({})
  isSubmitted: boolean = false

  // Produto
  produto: Produto;

  // Adicionais
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  adicionais: Adicional[] = [];
  addOnBlur = true;

  // Enums + imagens
  categorias!: string[]

  medida: string = '';
  medidas!: string[]

  imagem: any;

  constructor(
  private router: Router,
  private formBuilder: FormBuilder,
  private produtoFs: ProdutoFirebaseService,
  private authFireService: AuthFirebaseService) {
    this.produto = this.router.getCurrentNavigation()!.extras.state as Produto;

    console.log(this.produto)
    if(this.produto === undefined) {
      this.irParaHome()
    }
  }

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

    this.categorias = Object.keys(Categoria).filter((res) => isNaN(Number(res)));
    this.medidas = Object.keys(Medida).filter((res) => isNaN(Number(res)))
    this.formInit()
  }

  formInit() {
    this.FormEditProd = this.formBuilder.group({
      nome: [this.produto.nome, [Validators.required, Validators.minLength(3)]],
      descricao: [this.produto.nome, [Validators.required]],
      categoria: [this.produto.categoria, [Validators.required]],
      tamanho: [this.produto.tamanho, [Validators.required, Validators.min(0.1)]],
      medida: [this.produto.medida, [Validators.required]],
      adicionais: [null, []],
      foto: [null, [Validators.required]],
      preco: [this.produto.preco, [Validators.required, Validators.min(0)]],
    })
  }

  getErrorControl(control: string, error: string): boolean {
    return (this.FormEditProd.controls[control].touched && this.FormEditProd.controls[control].hasError(error))
  }

  onSubmit(): boolean {
    this.isSubmitted = true
    if(!this.FormEditProd.valid) {
      alert("Todos os campos são obrigatórios!")
      return false
    }

    this.editar()
    return true
  }

  private async editar() {
    this.FormEditProd.controls['adicionais'].setValue(this.adicionais)
    this.produtoFs.updateImg(this.imagem, this.FormEditProd.value)
  }

  salvaMedida(medida: string) {
    this.medida = medida
  }

  add(evento: MatChipInputEvent): void {
    const value = (evento.value || '').trim();

    // Add our fruit
    if (value) {
      this.adicionais.push({nome: value, preco: 2});
    }

    // Clear the input value
    evento.chipInput!.clear();
  }

  remove(adicional: Adicional): void {
    const index = this.adicionais.indexOf(adicional);

    if (index >= 0) {
      this.adicionais.splice(index, 1);
    }
  }

  uploadFile(evento: any){
    this.imagem = evento.target.files[0];
  }

  irParaLogin() {
    this.router.navigate(['/'])
  }

  irParaHome() {
    this.router.navigate(['/home'])
  }

  irParaCadastro(){
    this.router.navigate(['/cadastro'])
  }
}


