import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


//components
import { ClientsListComponent } from './components/clients-crud/clients-list.component';


const routes: Routes = [
  {path: '', redirectTo: 'ClientsList', pathMatch:'full'},
  {path:'ClientsList', component: ClientsListComponent},
  {path: '**', redirectTo: 'ClientsList', pathMatch:'full'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
