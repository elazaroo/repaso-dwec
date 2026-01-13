import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { NavbarComponent } from './components/navbar/navbar';
import { HomeComponent } from './components/home/home';
import { TaskListComponent } from './components/task-list/task-list';
import { TaskFormComponent } from './components/task-form/task-form';

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    HomeComponent,
    TaskListComponent,
    TaskFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }