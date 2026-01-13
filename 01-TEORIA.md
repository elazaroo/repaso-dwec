# 📚 Teoría Angular - Repaso DWEC

## 1. ¿Qué es Angular?

Angular es un **framework** de desarrollo web para crear aplicaciones **SPA (Single Page Application)**.
- Usa **TypeScript** (JavaScript tipado)
- Arquitectura basada en **componentes**
- Inyección de dependencias mediante **servicios**

---

## 2. Arquitectura de un Proyecto Angular

```
mi-proyecto/
├── src/
│   ├── app/
│   │   ├── components/       # Componentes (UI)
│   │   ├── models/           # Interfaces de datos
│   │   ├── services/         # Lógica y HTTP
│   │   ├── app.component.ts  # Componente raíz
│   │   ├── app.module.ts     # Módulo principal
│   │   └── app-routing.module.ts
│   └── index.html
├── angular.json
└── package.json
```

---

## 3. Componentes

Un componente tiene 3 partes:
- **TypeScript (.ts)** → Lógica
- **HTML (.html)** → Vista/Template
- **CSS (.css)** → Estilos

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ejemplo',           // Etiqueta HTML
  templateUrl: './ejemplo.component.html',
  styleUrls: ['./ejemplo.component.css']
})
export class EjemploComponent implements OnInit {
  titulo: string = 'Hola';
  
  constructor() {}
  
  ngOnInit(): void {
    // Se ejecuta al cargar el componente
  }
}
```

### Generar componente:
```bash
ng generate component components/nombre
# Abreviado: ng g c components/nombre
```

---

## 4. Servicios e Inyección de Dependencias

Los servicios centralizan la lógica de negocio y las llamadas HTTP.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private url = 'https://api.ejemplo.com';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
```

### Usar servicio en componente:
```typescript
constructor(private apiService: ApiService) {}

ngOnInit(): void {
  this.apiService.getAll().subscribe({
    next: (data) => this.items = data,
    error: (err) => console.error(err)
  });
}
```

---

## 5. Modelos (Interfaces)

Definen la estructura de los datos:

```typescript
// models/producto.model.ts
export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
}
```

---

## 6. Data Binding (Enlace de Datos)

| Tipo | Sintaxis | Dirección |
|------|----------|-----------|
| Interpolación | `{{ variable }}` | TS → HTML |
| Property Binding | `[propiedad]="valor"` | TS → HTML |
| Event Binding | `(evento)="metodo()"` | HTML → TS |
| Two-way Binding | `[(ngModel)]="variable"` | TS ↔ HTML |

### Ejemplos:
```html
<!-- Interpolación -->
<h1>{{ titulo }}</h1>

<!-- Property Binding -->
<button [disabled]="!valido">Enviar</button>
<img [src]="imagenUrl">

<!-- Event Binding -->
<button (click)="guardar()">Guardar</button>
<input (input)="buscar($event)">

<!-- Two-way Binding (requiere FormsModule) -->
<input [(ngModel)]="nombre" name="nombre">
```

---

## 7. Directivas Estructurales

### *ngIf - Mostrar/Ocultar
```html
<div *ngIf="mostrar">Contenido visible</div>

<div *ngIf="items.length > 0; else vacio">
  Hay datos
</div>
<ng-template #vacio>Sin datos</ng-template>
```

### *ngFor - Iterar
```html
<ul>
  <li *ngFor="let item of items; let i = index">
    {{ i + 1 }}. {{ item.nombre }}
  </li>
</ul>
```

### ngClass y ngStyle
```html
<div [ngClass]="{'activo': esActivo, 'error': hayError}">
<div [ngStyle]="{'color': colorTexto}">
```

---

## 8. Routing (Navegación)

### Configurar rutas:
```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lista', component: ListaComponent },
  { path: 'detalle/:id', component: DetalleComponent },
  { path: '**', redirectTo: '' }
];
```

### Navegar en HTML:
```html
<a routerLink="/lista">Ver Lista</a>
<a [routerLink]="['/detalle', item.id]">Ver Detalle</a>
<router-outlet></router-outlet>
```

### Obtener parámetros de ruta:
```typescript
constructor(private route: ActivatedRoute) {}

ngOnInit(): void {
  const id = +this.route.snapshot.paramMap.get('id')!;
}
```

---

## 9. Configuración del Módulo

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

---

## 10. Comandos CLI Esenciales

```bash
# Crear proyecto (no standalone)
ng new mi-proyecto --no-standalone

# Generar
ng g c components/nombre    # Componente
ng g s services/nombre      # Servicio
ng g interface models/nombre # Interface

# Ejecutar
ng serve                    # Modo desarrollo
ng build                    # Producción
```

---

## 11. Errores Comunes

| Error | Solución |
|-------|----------|
| `Can't bind to 'ngModel'` | Importar `FormsModule` |
| `NullInjectorError: HttpClient` | Añadir `provideHttpClient()` en providers |
| Datos no se muestran | Falta `.subscribe()` |
| `name` error en form | Añadir `name="campo"` al input |
