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
import { FuncionarioFirebaseService } from 'src/app/services/funcionario.firebase.service';


@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.scss']
})

export class CadastroProdutoComponent implements OnInit {
  // Formulários
  FormCadProd: FormGroup = this.formBuilder.group({})
  isSubmitted: boolean = false

  userEmail!: string;
  isAdmin: boolean = false;
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
  private authFireService: AuthFirebaseService,
  private funcionarioFs: FuncionarioFirebaseService) { }

  ngOnInit(): void {
    let user = this.authFireService.userLogged()
    if(user !== null) {
      user.providerData.forEach((profile: any) => {
        this.userEmail = profile.email
      })
    }else {
      this.irParaLogin()
    }

    if(this.userEmail) {
      this.funcionarioFs.produtoQueryByEmail(this.userEmail).then(data => {
        if(data){
        this.isAdmin = data.admin
        }else {
          this.isAdmin = false
          this.irParaHome()
        }
      })
    }

    this.categorias = Object.keys(Categoria).filter((res) => isNaN(Number(res)));
    this.medidas = Object.keys(Medida).filter((res) => isNaN(Number(res)))
    this.formInit()
  }

  formInit() {
    this.FormCadProd = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      tamanho: ['', [Validators.required, Validators.min(0.00)]],
      medida: ['', [Validators.required]],
      adicionais: [null],
      foto: [null, [Validators.required]],
      preco: ['', [Validators.required, Validators.min(0.00)]],
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

  private async cadastrar() {
    this.FormCadProd.controls['adicionais'].setValue(this.adicionais)
    await this.produtoFs.enviarImg(this.imagem, this.FormCadProd.value)

    this.irParaCadastro()
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
    this.router.navigate(['/gerenciar/produtos'])
  }
}
