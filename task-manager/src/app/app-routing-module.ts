import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { TaskListComponent } from './components/task-list/task-list';
import { TaskFormComponent } from './components/task-form/task-form';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/edit/:id', component: TaskFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }