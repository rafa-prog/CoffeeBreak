import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroFuncionarioComponent } from './pages/cadastro-funcionario/cadastro-funcionario.component';
import { CadastroProdutoComponent } from './pages/cadastro-produto/cadastro-produto.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { DetalhesProdutoComponent } from './pages/detalhes-produto/detalhes-produto.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '#',
    component: HomeComponent,
  },
  {
    path: 'cadastro-produto',
    component: CadastroProdutoComponent,
  },
  {
    path: 'detalhes-produto',
    component: DetalhesProdutoComponent,
  },
  {

    path: 'cadastro',
    component: CadastroComponent,
  },
  {
     path: 'cadastro-funcionario',
    component: CadastroFuncionarioComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
