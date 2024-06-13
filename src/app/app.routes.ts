import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { HeaderComponent } from './composants/header/header.component';
import { LoginComponent } from './composants/login/login.component';
import { RegisterComponent } from './composants/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'home', component: AdminComponent},
    { path: 'header', component: HeaderComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
];

