# 🛠️ Guía Paso a Paso - Solución TaskManager

Esta guía te lleva de la mano para completar el ejercicio. **Intenta hacerlo antes de mirar la solución.**

---

## Paso 1: Crear el Proyecto

```bash
ng new task-manager --no-standalone

# Responde:
# - CSS (o tu preferencia)
# - No a SSR

cd task-manager
```

### ¿Por qué `--no-standalone`?
El profesor especificó proyectos "no standalone", que usan el sistema de módulos tradicional (`app-module.ts`).

---

## Paso 2: Generar Componentes

```bash
ng g c components/navbar
ng g c components/home
ng g c components/task-list
ng g c components/task-form
```

### ¿Qué genera esto?
Por cada componente crea:
- `nombre.ts` → Lógica
- `nombre.html` → Vista
- `nombre.css` → Estilos
- Y lo registra en `app-module.ts`

---

## Paso 3: Crear el Modelo

```bash
ng g interface models/task
```

📁 Edita `src/app/models/task.ts`:

```typescript
export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  userId?: number;
}
```

### ¿Por qué `id?` con interrogación?
Es opcional porque al crear una tarea nueva, la API genera el ID.

> ⚠️ **Nota:** Usamos `title` y `completed` porque son los nombres que usa la API JSONPlaceholder.

---

## Paso 4: Crear el Servicio

```bash
ng g s services/task
```

📁 Edita `src/app/services/task.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) { }

  // GET - Obtener todas
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // GET - Obtener por ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear nueva
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // PUT - Actualizar
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // DELETE - Eliminar
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Patrón CRUD para memorizar:
```
GET    → http.get<T>(url)           → Leer
POST   → http.post<T>(url, data)    → Crear
PUT    → http.put<T>(url, data)     → Actualizar
DELETE → http.delete<void>(url)     → Eliminar
```

---

## Paso 5: Configurar el Módulo

📁 Edita `src/app/app-module.ts`:

```typescript
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
    FormsModule        // ¡Necesario para ngModel!
  ],
  providers: [
    provideHttpClient() // ¡Necesario para HttpClient!
  ],
  bootstrap: [App]
})
export class AppModule { }
```

### Errores comunes si olvidas esto:
- Sin `FormsModule` → Error: `Can't bind to 'ngModel'`
- Sin `provideHttpClient()` → Error: `NullInjectorError: HttpClient`

---

## Paso 6: Configurar Rutas

📁 Edita `src/app/app-routing-module.ts`:

```typescript
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
```

### ⚠️ Orden importante:
`tasks/new` DEBE ir ANTES de `tasks/edit/:id`, si no Angular pensará que "new" es un ID.

---

## Paso 7: Navbar

📁 `src/app/components/navbar/navbar.html`:

```html
<nav class="navbar">
  <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
    🏠 Inicio
  </a>
  <a routerLink="/tasks" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
    📋 Tareas
  </a>
  <a routerLink="/tasks/new" routerLinkActive="active">
    ➕ Nueva Tarea
  </a>
</nav>
```

> ⚠️ **Importante:** Usamos `{exact: true}` en `/` y `/tasks` porque son prefijos de otras rutas. Sin esto, ambos enlaces estarían siempre "activos".

📁 `src/app/components/navbar/navbar.css`:

```css
.navbar {
  display: flex;
  gap: 20px;
  padding: 15px 30px;
  background: #2c3e50;
}

.navbar a {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s;
}

.navbar a:hover {
  background: #34495e;
}

.navbar a.active {
  background: #3498db;
}
```

---

## Paso 8: App Component (Raíz)

📁 `src/app/app.html`:

```html
<app-navbar></app-navbar>

<main class="container">
  <router-outlet></router-outlet>
</main>
```

📁 `src/styles.css` (en la raíz de src):

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #ecf0f1;
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
}
```

---

## Paso 9: Home

📁 `src/app/components/home/home.html`:

```html
<div class="home">
  <h1>📋 Task Manager</h1>
  <p>Bienvenido al gestor de tareas</p>
  
  <div class="actions">
    <a routerLink="/tasks" class="btn btn-primary">Ver Tareas</a>
    <a routerLink="/tasks/new" class="btn btn-success">Nueva Tarea</a>
  </div>
</div>
```

📁 `src/app/components/home/home.css`:

```css
.home {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.home h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.home p {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

.btn-primary { background: #3498db; color: white; }
.btn-success { background: #27ae60; color: white; }
```

---

## Paso 10: Lista de Tareas

📁 `src/app/components/task-list/task-list.ts`:

```typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data.slice(0, 20); // Solo 20 tareas
        this.filteredTasks = this.tasks;
        this.loading = false;
        this.cdr.detectChanges(); // Forzar actualización de vista
      },
      error: (err) => {
        this.error = 'Error al cargar las tareas';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  filterTasks(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter(task =>
      task.title.toLowerCase().includes(term)
    );
  }

  deleteTask(task: Task): void {
    if (confirm(`¿Eliminar "${task.title}"?`)) {
      this.taskService.deleteTask(task.id!).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.filteredTasks = this.filteredTasks.filter(t => t.id !== task.id);
        },
        error: (err) => {
          this.error = 'Error al eliminar';
          console.error(err);
        }
      });
    }
  }
}
```

> ⚠️ **Importante:** Usamos `ChangeDetectorRef` y `detectChanges()` para forzar la actualización de la vista después de recibir datos HTTP. Sin esto, la vista puede quedarse en "Cargando..." aunque los datos lleguen.

📁 `src/app/components/task-list/task-list.html`:

```html
<div class="task-list">
  <h2>📋 Lista de Tareas</h2>

  <!-- Buscador -->
  <div class="search-box">
    <input 
      type="text" 
      [(ngModel)]="searchTerm" 
      (input)="filterTasks()"
      placeholder="🔍 Buscar tareas...">
  </div>

  <!-- Estado: Cargando -->
  <div *ngIf="loading" class="status loading">
    ⏳ Cargando tareas...
  </div>

  <!-- Estado: Error -->
  <div *ngIf="error" class="status error">
    ❌ {{ error }}
  </div>

  <!-- Estado: Sin datos -->
  <div *ngIf="!loading && filteredTasks.length === 0" class="status empty">
    📭 No hay tareas
  </div>

  <!-- Tabla de tareas -->
  <table *ngIf="!loading && filteredTasks.length > 0">
    <thead>
      <tr>
        <th>ID</th>
        <th>Título</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let task of filteredTasks">
        <td>{{ task.id }}</td>
        <td>{{ task.title }}</td>
        <td>
          <span [ngClass]="{'completada': task.completed, 'pendiente': !task.completed}">
            {{ task.completed ? '✅ Completada' : '⏳ Pendiente' }}
          </span>
        </td>
        <td class="actions">
          <a [routerLink]="['/tasks/edit', task.id]" class="btn btn-edit">✏️</a>
          <button (click)="deleteTask(task)" class="btn btn-delete">🗑️</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

📁 `src/app/components/task-list/task-list.css`:

```css
.task-list {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.task-list h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.search-box { margin-bottom: 20px; }

.search-box input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.search-box input:focus {
  outline: none;
  border-color: #3498db;
}

.status {
  padding: 20px;
  text-align: center;
  border-radius: 5px;
}

.status.loading { background: #fff3cd; }
.status.error { background: #f8d7da; color: #721c24; }
.status.empty { background: #e2e3e5; }

table { width: 100%; border-collapse: collapse; }

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th { background: #2c3e50; color: white; }
tr:hover { background: #f5f5f5; }

.completada { color: #27ae60; }
.pendiente { color: #e67e22; }

.actions { display: flex; gap: 8px; }

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.btn-edit { background: #3498db; color: white; }
.btn-delete { background: #e74c3c; color: white; }
.btn:hover { opacity: 0.8; }
```

---

## Paso 11: Formulario de Tareas

📁 `src/app/components/task-form/task-form.ts`:

```typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskFormComponent implements OnInit {

  task: Task = {
    title: '',
    completed: false
  };

  isEditMode: boolean = false;
  taskId: number | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = +id;  // +id convierte "5" a 5
      this.loadTask(this.taskId);
    }
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (data) => {
        this.task = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar la tarea';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isFormValid(): boolean {
    return this.task.title.trim().length >= 3;
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, this.task).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => this.error = 'Error al actualizar'
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => this.error = 'Error al crear'
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
```

📁 `src/app/components/task-form/task-form.html`:

```html
<div class="task-form">
  <h2>{{ isEditMode ? '✏️ Editar Tarea' : '➕ Nueva Tarea' }}</h2>

  <div *ngIf="loading" class="status">Cargando...</div>
  <div *ngIf="error" class="status error">{{ error }}</div>

  <form *ngIf="!loading" (ngSubmit)="onSubmit()">
    
    <!-- Título -->
    <div class="form-group">
      <label for="title">Título *</label>
      <input 
        type="text" 
        id="title"
        [(ngModel)]="task.title" 
        name="title"
        placeholder="Escribe el título...">
      <span *ngIf="task.title.length > 0 && task.title.length < 3" class="error-msg">
        Mínimo 3 caracteres
      </span>
    </div>

    <!-- Completada -->
    <div class="form-group checkbox">
      <label>
        <input 
          type="checkbox" 
          [(ngModel)]="task.completed" 
          name="completed">
        Tarea completada
      </label>
    </div>

    <!-- Botones -->
    <div class="form-actions">
      <button type="submit" [disabled]="!isFormValid()" class="btn btn-primary">
        {{ isEditMode ? 'Guardar' : 'Crear' }}
      </button>
      <button type="button" (click)="cancel()" class="btn btn-secondary">
        Cancelar
      </button>
    </div>
  </form>
</div>
```

📁 `src/app/components/task-form/task-form.css`:

```css
.task-form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 500px;
  margin: 0 auto;
}

.task-form h2 {
  margin-bottom: 25px;
  color: #2c3e50;
  text-align: center;
}

.form-group { margin-bottom: 20px; }

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #34495e;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group input[type="text"]:focus {
  outline: none;
  border-color: #3498db;
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.error-msg {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
}

.status {
  padding: 15px;
  text-align: center;
  border-radius: 5px;
  margin-bottom: 20px;
}

.status.error { background: #f8d7da; color: #721c24; }

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 25px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.btn-primary { background: #3498db; color: white; }
.btn-primary:disabled { background: #bdc3c7; cursor: not-allowed; }
.btn-secondary { background: #95a5a6; color: white; }
```

---

## Paso 12: Ejecutar y Probar

```bash
ng serve
```

Abre `http://localhost:4200` y prueba:
1. ✅ Navegar entre páginas
2. ✅ Ver lista de tareas
3. ✅ Buscar tareas
4. ✅ Crear nueva tarea
5. ✅ Editar tarea existente
6. ✅ Eliminar tarea

---

## 📝 Resumen de Conceptos

| Concepto | Dónde lo usamos |
|----------|-----------------|
| Componentes | navbar, home, task-list, task-form |
| Servicios + HTTP | TaskService con CRUD |
| Routing | app-routing-module.ts |
| Parámetros de ruta | `:id` y `ActivatedRoute` |
| *ngIf | Estados loading/error/vacío |
| *ngFor | Iterar tareas |
| [(ngModel)] | Two-way binding en formularios |
| (click), (ngSubmit) | Event binding |
| [disabled], [routerLink] | Property binding |
| [ngClass] | Clases condicionales |
| ChangeDetectorRef | Forzar actualización de vista |

---

## Paso 13: Subir a GitHub y Desplegar

### 13.1: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `task-manager`
3. Público
4. NO inicialices con README (ya tenemos código)
5. Crea el repositorio

### 13.2: Subir código

En la terminal (dentro de la carpeta `task-manager`):

```bash
git add .
git commit -m "Task Manager Angular completo"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/task-manager.git
git push -u origin main
```

> ⚠️ Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub.

### 13.3: Desplegar en GitHub Pages

```bash
# Instalar la herramienta de despliegue
npm install -g angular-cli-ghpages

# Generar build de producción
ng build --base-href=/task-manager/

# Desplegar
npx angular-cli-ghpages --dir=dist/task-manager/browser
```

### 13.4: Acceder a la web

Tu aplicación estará disponible en:
```
https://TU-USUARIO.github.io/task-manager/
```

> ⚠️ Puede tardar unos minutos en estar disponible la primera vez.

---

## ⚠️ Errores Comunes y Soluciones

| Problema | Solución |
|----------|----------|
| "Can't bind to 'ngModel'" | Importar `FormsModule` en el módulo |
| "NullInjectorError: HttpClient" | Añadir `provideHttpClient()` en providers |
| Vista no se actualiza | Añadir `ChangeDetectorRef.detectChanges()` |
| Varios enlaces "active" | Usar `[routerLinkActiveOptions]="{exact: true}"` |
| `+id` error | Es para convertir string a number |
| Página en blanco en GitHub Pages | Verificar `--base-href` correcto |
| 404 al refrescar en GitHub Pages | Es normal en SPAs, usar hash routing |

---

## 📝 Resumen de Conceptos

| Concepto | Dónde lo usamos |
|----------|-----------------|
| Componentes | navbar, home, task-list, task-form |
| Servicios + HTTP | TaskService con CRUD |
| Routing | app-routing-module.ts |
| Parámetros de ruta | `:id` y `ActivatedRoute` |
| *ngIf | Estados loading/error/vacío |
| *ngFor | Iterar tareas |
| [(ngModel)] | Two-way binding en formularios |
| (click), (ngSubmit) | Event binding |
| [disabled], [routerLink] | Property binding |
| [ngClass] | Clases condicionales |
| ChangeDetectorRef | Forzar actualización de vista |
| GitHub Pages | Despliegue de producción |

---

¡Practica hasta que puedas hacerlo sin mirar! 💪
