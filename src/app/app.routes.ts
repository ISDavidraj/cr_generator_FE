import { Routes } from '@angular/router';
import { CvFormComponent } from './cv-form/cv-form.component';
import { UserListComponent } from './user-list/user-list.component';

export const routes: Routes = [
    { path: 'cv-form', component: CvFormComponent },
    { path: 'users', component: UserListComponent },
    { path: '**', redirectTo: 'users' }
];
