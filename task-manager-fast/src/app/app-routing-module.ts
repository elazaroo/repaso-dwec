import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { TaskList } from './components/task-list/task-list';
import { TaskForm } from './components/task-form/task-form';

const routes: Routes = [
  { path: '', component: Home},
  { path: 'tasks', component: TaskList},
  { path: 'tasks/new', component: TaskForm},
  { path: 'tasks/edit/:id', component: TaskForm},
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
