import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowproductComponent } from './showproduct/showproduct.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AddorderComponent } from './addorder/addorder.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShoworderComponent } from './showorder/showorder.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { ShowhistoryComponent } from './showhistory/showhistory.component';
import { ShowcodeComponent } from './showcode/showcode.component';
import { SidebarModule } from 'ng-sidebar';

const routes: Routes = [
  { path: 'showproduct', component: ShowproductComponent },
  { path: 'addorder', component: AddorderComponent },
  { path: 'showorder', component: ShoworderComponent },
  { path: 'showhistory', component: ShowhistoryComponent },
  { path: 'showcode', component: ShowcodeComponent },
  { path: '', redirectTo: 'showproduct', pathMatch: 'full' },
  { path: 'addorder', redirectTo: 'addorder', pathMatch: 'full' },
  { path: 'showorder', redirectTo: 'showorder', pathMatch: 'full' },
  { path: 'showhistory', redirectTo: 'showhistory', pathMatch: 'full' },
  { path: 'showcode', redirectTo: 'showcode', pathMatch: 'full' }
  
];

@NgModule({
  declarations: [
    AppComponent,
    ShowproductComponent,
    AddorderComponent,
    ShoworderComponent,
    ShowhistoryComponent,
    ShowcodeComponent,
    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    // RouterModule.forRoot([
    //   { path: 'showproduct', component: ShowproductComponent },
    //   { path: 'addorder', component: AddorderComponent },
    //   { path: 'showorder', component: ShoworderComponent },
    //   { path: 'showhistory', component: ShowhistoryComponent },
    //   { path: 'showcode', component: ShowcodeComponent },
    //   { path: '', redirectTo: 'showproduct', pathMatch: 'full' },
    //   { path: 'addorder', redirectTo: 'addorder', pathMatch: 'full' },
    //   { path: 'showorder', redirectTo: 'showorder', pathMatch: 'full' },
    //   { path: 'showhistory', redirectTo: 'showhistory', pathMatch: 'full' },
    //   { path: 'showcode', redirectTo: 'showcode', pathMatch: 'full' }
      
    // ]),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,FormsModule,
    BrowserAnimationsModule,
    SweetAlert2Module.forRoot(),
    FeatherModule.pick(allIcons),
    SidebarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    FeatherModule
  ]
})

export class AppModule { }
