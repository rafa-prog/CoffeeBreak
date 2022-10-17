import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroFuncionarioComponent } from './pages/cadastro-funcionario/cadastro-funcionario.component';
import { CadastroProdutoComponent } from './pages/cadastro-produto/cadastro-produto.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ComandaComponent } from './pages/comanda/comanda.component';
import { MaisDetalhesComponent } from './pages/mais-detalhes/mais-detalhes.component';
import { PagamentoComponent } from './pages/pagamento/pagamento.component';
import { EditarProdutoComponent } from './pages/editar-produto/editar-produto.component';
import { EditarFuncionarioComponent } from './pages/editar-funcionario/editar-funcionario.component';



const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'gerenciar/:tipo',
    component: CadastroComponent,
  },
  {
    path: 'cadastro-produto',
    component: CadastroProdutoComponent,
  },
  {
    path: 'editar-produto',
    component: EditarProdutoComponent,
  },
  {
    path:'mais-detalhes',
    component: MaisDetalhesComponent
  },
  {
    path: 'comanda',
    component: ComandaComponent,
  },
  {
    path: 'pagamento',
    component: PagamentoComponent,
  },
  {
    path: 'cadastro-funcionario',
    component: CadastroFuncionarioComponent,
  },
  {
    path: 'editar-funcionario',
    component: EditarFuncionarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
