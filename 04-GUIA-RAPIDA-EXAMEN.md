# ⚡ Guía Rápida Examen - TaskManager con Bootstrap

Esta guía está optimizada para completar el ejercicio lo más rápido posible usando **Bootstrap** (sin escribir CSS).

---

## 🚀 PASO 1: Crear Proyecto y Estructura

```bash
ng new task-manager-fast --no-standalone --skip-git --routing --style=css
cd task-manager-fast
ng g c components/navbar
ng g c components/home
ng g c components/task-list
ng g c components/task-form
ng g s services/task
ng g interface models/task
```

---

## 📦 PASO 2: Instalar Bootstrap

```bash
npm install bootstrap
```

Edita `angular.json`, añadir en el nodo `"styles"` la linea de bootstrao:
```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
]
```

---

## 🎯 PASO 3: Modelo

**`src/app/models/task.ts`:**
```typescript
export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  userId?: number;
}
```

---

## 🔧 PASO 4: Servicio

**`src/app/services/task.ts`** - :

1- Cambiar nombre de la clase a TaskService\
2- Declarar variables\
3- Constructor\
4- Funciones que llaman a la API

```typescript
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

> ⚠️ **Importante:** `getTaskById`, `createTask`, `updateTask` devuelven `Observable<Task>` (singular), solo `getTasks()` devuelve array.

---

## ⚙️ PASO 5: Configurar Módulo

**`src/app/app-module.ts`:**

**Añadir imports:**
```typescript
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
```

**En `imports` array:**
```typescript
imports: [
  BrowserModule,
  AppRoutingModule,
  FormsModule  // ← AÑADIR
],
```

**En `providers` array:**
```typescript
providers: [
  provideHttpClient()  // ← CAMBIAR lo que haya por esto
],
```

---

## 🗺️ PASO 6: Rutas

**`src/app/app-routing-module.ts`:**

Definir el array de rutas

```typescript
const routes: Routes = [
  { path: '', component: Home },
  { path: 'tasks', component: TaskList },
  { path: 'tasks/new', component: TaskForm },
  { path: 'tasks/edit/:id', component: TaskForm },
  { path: '**', redirectTo: '' }
];
```

> ⚠️ **Orden importante:** `tasks/new` ANTES de `tasks/edit/:id`

---

## 📄 PASO 7: App Raíz

**`src/app/app.html`:**

1- Etiqueta del navbar\
2- Container de Bootstrap con router-outlet dentro

```html
<app-navbar></app-navbar>

<div class="container mt-4">
  <router-outlet></router-outlet>
</div>
```

---

## 🧭 PASO 8: Navbar

**`src/app/components/navbar/navbar.html`:**

```html
<nav class="navbar bg-dark p-3">
  <a class="text-white" routerLink="/">TaskManager</a>
  <div>
    <a class="btn btn-light me-2" routerLink="/">Inicio</a>
    <a class="btn btn-light me-2" routerLink="/tasks">Tareas</a>
    <a class="btn btn-success" routerLink="/tasks/new">Nueva</a>
  </div>
</nav>
```

**No necesitas editar el .ts ni el .css** (Bootstrap lo hace todo).

---

## 🏠 PASO 9: Home

**`src/app/components/home/home.html`:**

```html
<div class="card text-center p-5">
  <h1>Task Manager</h1>
  <p class="text-muted">Gestiona tus tareas</p>
  <div>
    <a class="btn btn-primary me-2" routerLink="/tasks">Ver Tareas</a>
    <a class="btn btn-success" routerLink="/tasks/new">Nueva Tarea</a>
  </div>
</div>
```

---

## 📋 PASO 10: Lista de Tareas

### TypeScript - `src/app/components/task-list/task-list.ts`:

1- Variables del componente (tasks, filteredTasks, searchTerm, loading)\
2- Constructor con TaskService y ChangeDetectorRef\
3- ngOnInit() que llama a loadTasks()\
4- loadTasks() con subscribe y detectChanges()\
5- filterTasks() para el buscador\
6- deleteTask() con confirm

```typescript
export class TaskList implements OnInit {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  loading: boolean = true;

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
        this.tasks = data.slice(0, 20);
        this.filteredTasks = this.tasks;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    })
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(t => 
      t.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteTask(task: Task): void {
    if (confirm(`¿Eliminar "${task.title}"?`)) {
      this.taskService.deleteTask(task.id!).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.filterTasks();
        }
      })
    }
  }
}
```

> ⚠️ **Crítico:** 
> - `implements OnInit`
> - `ChangeDetectorRef` + `detectChanges()` para que se actualice la vista
> - `.slice(0, 20)` para mostrar solo 20 tareas

### HTML - `src/app/components/task-list/task-list.html`:

```html
<div class="card p-3">
  <h2>📋 Lista de Tareas</h2>
  
  <input class="form-control mb-3" [(ngModel)]="searchTerm" (input)="filterTasks()" placeholder="Buscar...">
  
  <p *ngIf="loading">⏳ Cargando...</p>
  <p *ngIf="!loading && filteredTasks.length === 0">📭 No hay tareas</p>
  
  <table class="table" *ngIf="!loading && filteredTasks.length > 0">
    <thead>
      <tr>
        <th>Título</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let task of filteredTasks">
        <td>{{ task.title }}</td>
        <td>{{ task.completed ? '✅ Completada' : '⏳ Pendiente' }}</td>
        <td>
          <a class="btn btn-sm btn-primary me-1" [routerLink]="['/tasks/edit', task.id]">Editar</a>
          <button class="btn btn-sm btn-danger" (click)="deleteTask(task)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## ✏️ PASO 11: Formulario de Tareas

### TypeScript - `src/app/components/task-form/task-form.ts`:

1- Variables del componente (task, isEditMode, taskId)\
2- Constructor con ActivatedRoute, Router, TaskService, ChangeDetectorRef\
3- ngOnInit() para detectar si es edición (con parámetro :id)\
4- loadTask() para cargar datos en modo edición\
5- onSubmit() con lógica de crear/editar\

```typescript
export class TaskForm implements OnInit {
  
  task: Task = { title: '', completed: false };
  isEditMode: boolean = false;
  taskId: number | null = null;

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
      this.taskId = +id;
      this.loadTask(this.taskId);
    }
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (data) => {
        this.task = data;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, this.task).subscribe({
        next: () => this.router.navigate(['/tasks'])
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: () => this.router.navigate(['/tasks'])
      });
    }
  }
}
```

> ⚠️ **Importante:** 
> - `+id` convierte string a number
> - Mismo componente para crear y editar
> - `ChangeDetectorRef` para actualizar vista

### HTML - `src/app/components/task-form/task-form.html`:

```html
<div class="card p-4">
  <h2>{{ isEditMode ? '✏️ Editar Tarea' : '➕ Nueva Tarea' }}</h2>
  
  <form (ngSubmit)="onSubmit()">
    <div class="mb-3">
      <label class="form-label">Título</label>
      <input class="form-control" [(ngModel)]="task.title" name="title" required>
    </div>
    
    <div class="mb-3 form-check">
      <input class="form-check-input" type="checkbox" [(ngModel)]="task.completed" name="completed">
      <label class="form-check-label">Completada</label>
    </div>
    
    <button class="btn btn-primary me-2" type="submit" [disabled]="!task.title">Guardar</button>
    <a class="btn btn-secondary" routerLink="/tasks">Cancelar</a>
  </form>
</div>
```

---

## ✅ PASO 12: Probar

```bash
ng serve
```

Abre `http://localhost:4200` y verifica:
- ✅ Navegación entre páginas
- ✅ Ver lista de tareas
- ✅ Buscar tareas
- ✅ Crear tarea
- ✅ Editar tarea (JSONPlaceholder no persiste, pero verás status 200)
- ✅ Eliminar tarea

---

## 🚀 PASO 13: Subir a GitHub y Desplegar (5 min)

### 1. Crear repositorio en GitHub
- Ve a https://github.com/new
- Nombre: `task-manager` (o el que prefieras)
- Público
- **NO** inicialices con README
- Crear repositorio

### 2. Subir código

```bash
git init
git add .
git commit -m "Task Manager completo"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/task-manager.git
git push -u origin main
```

> ⚠️ Reemplaza `TU-USUARIO` con tu usuario de GitHub

### 3. Generar build y desplegar en GitHub Pages

```bash
ng build --base-href=/task-manager-fast/
npx angular-cli-ghpages --dir=dist/task-manager-fast/browser
```

> ⚠️ Cambia `task-manager` y `task-manager-fast` por el nombre de tu proyecto

**Tu app estará en:** `https://TU-USUARIO.github.io/task-manager/`

> 📌 Puede tardar 1-2 minutos en estar disponible la primera vez

---

## 🎓 CONCEPTOS CLAVE PARA MEMORIZAR

### Patrón CRUD Servicio:
```typescript
getTasks()         → Observable<Task[]>    → GET /todos
getTaskById(id)    → Observable<Task>      → GET /todos/:id
createTask(task)   → Observable<Task>      → POST /todos
updateTask(id, t)  → Observable<Task>      → PUT /todos/:id
deleteTask(id)     → Observable<void>      → DELETE /todos/:id
```

### Bootstrap Clases Esenciales:
```
navbar bg-dark p-3        → Navbar oscuro
card p-3/p-4/p-5          → Contenedor con padding
btn btn-primary           → Botón azul
btn btn-success           → Botón verde
btn btn-danger            → Botón rojo
btn btn-light             → Botón blanco
btn-sm                    → Botón pequeño
me-2                      → Margen derecha
mb-3                      → Margen abajo
form-control              → Input estilizado
form-label                → Label de formulario
table                     → Tabla estilizada
text-muted                → Texto gris
container mt-4            → Contenedor centrado con margen arriba
```

### Angular Patterns:
```html
{{ variable }}                              → Interpolación
[propiedad]="valor"                        → Property binding
(evento)="metodo()"                        → Event binding
[(ngModel)]="variable"                     → Two-way binding
*ngIf="condicion"                          → Condicional
*ngFor="let item of items"                 → Iteración
[routerLink]="['/path', id]"               → Navegación con parámetro
routerLink="/path"                         → Navegación simple
```

### Errores Comunes:
| Error | Solución |
|-------|----------|
| "Can't bind to 'ngModel'" | Importar `FormsModule` en module |
| "NullInjectorError: HttpClient" | Añadir `provideHttpClient()` en providers |
| Vista no actualiza | Usar `ChangeDetectorRef` + `detectChanges()` |
| `routerlink` no funciona | Usar `routerLink` (camelCase) |
| Varios observables sin datos | Olvidaste `.subscribe()` |
| PUT/POST no persiste en API | Normal, JSONPlaceholder es fake |

---

## 📝 Checklist Final Examen

```
□ Proyecto creado con --no-standalone
□ Bootstrap instalado y configurado en angular.json
□ Modelo Task con id?, title, completed, userId?
□ Servicio con 5 métodos CRUD (tipos correctos)
□ FormsModule en imports
□ provideHttpClient() en providers
□ Rutas configuradas (orden correcto)
□ ChangeDetectorRef en task-list y task-form
□ implements OnInit en componentes con ngOnInit
□ [(ngModel)] con name="..." en inputs
□ Todos los routerLink en camelCase
□ Funciona crear, editar, eliminar, buscar
```

---

## 💡 Trucos para el Examen

1. **No pierdas tiempo en CSS**: Bootstrap hace todo
2. **Estructura mental**: Modelo → Servicio → Config → Rutas → Vistas
3. **Componentes en orden**: Home → TaskList → TaskForm (de simple a complejo)
4. **Imports automáticos**: VSCode los añade solo, no los escribas
5. **Consola F12**: Si algo falla, mira errores en rojo
6. **Network tab**: Verifica que las peticiones HTTP funcionan

---

