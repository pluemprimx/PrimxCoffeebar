import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowproductComponent } from './showproduct/showproduct.component';


const routes: Routes = [
  { path: '', redirectTo: 'showproduct', pathMatch: 'full' },
  { path: 'addorder', redirectTo: 'addorder', pathMatch: 'full' },
  { path: 'showorder', redirectTo: 'showorder', pathMatch: 'full' },
  { path: 'showhistory', redirectTo: 'showhistory', pathMatch: 'full' },
  { path: 'showcode', redirectTo: 'showcode', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
