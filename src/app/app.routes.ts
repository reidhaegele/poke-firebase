import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: 'register', component: CreateAccountComponent},
    { path: 'login', component: SigninComponent },
    { path: '', component: HomeComponent },
];
