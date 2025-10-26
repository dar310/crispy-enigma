import { Routes } from '@angular/router';
import { MainBodyComponent } from './main-body/main-body.component';
import { App } from './app';

export const routes: Routes = [
    {
        path: 'test', component: MainBodyComponent
    },
    {path: '', component: App}
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     loadComponent: () =>{
    //         return import('./main-body/main-body.component').then((m) => m.MainBodyComponent)
    //     },
        
    // },
    // {
    //     path: 'test',
    //     loadComponent: () =>{
    //         return import('./footer/footer.component').then((m) => m.FooterComponent)
    //     },
        
    // },

];
