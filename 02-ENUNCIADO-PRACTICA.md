# 📝 Ejercicio de Práctica - Examen DWEC

## 🎯 Enunciado: Gestor de Tareas (TaskManager)

Desarrolla una aplicación web SPA con Angular para gestionar tareas pendientes, conectándote a una API REST.

---

## 📋 Requisitos

### Ejercicio 1: Estructura y Componentes (2 puntos)

1. Crea un proyecto Angular **no standalone**
2. Crea los siguientes componentes:
   - `navbar` - Barra de navegación
   - `home` - Página de inicio
   - `task-list` - Lista de tareas
   - `task-form` - Formulario para crear/editar tareas
3. Configura las rutas:
   - `/` → Home
   - `/tasks` → Lista de tareas
   - `/tasks/new` → Crear tarea
   - `/tasks/edit/:id` → Editar tarea
4. La navbar debe tener enlaces a Home y Lista de Tareas

---

### Ejercicio 2: Modelo y Servicio (2.5 puntos)

1. Crea el modelo `Task` con los siguientes campos:
   - `id`: number (opcional)
   - `titulo`: string
   - `descripcion`: string
   - `completada`: boolean
   - `prioridad`: string ('alta', 'media', 'baja')

2. Crea un servicio `TaskService` con operaciones CRUD:
   - `getTasks()` → GET todas las tareas
   - `getTaskById(id)` → GET una tarea por ID
   - `createTask(task)` → POST crear tarea
   - `updateTask(id, task)` → PUT actualizar tarea
   - `deleteTask(id)` → DELETE eliminar tarea

3. **API a utilizar**: `https://jsonplaceholder.typicode.com/todos`
   - Nota: Esta API no persiste realmente los cambios, pero responde correctamente

---

### Ejercicio 3: Lista de Tareas (2.5 puntos)

En el componente `task-list`:

1. Mostrar todas las tareas en una **tabla** con columnas:
   - Título
   - Estado (Completada / Pendiente)
   - Prioridad
   - Acciones (Ver, Editar, Eliminar)

2. Implementar **búsqueda/filtro** por título

3. Mostrar estados de la UI:
   - "Cargando..." mientras se obtienen datos
   - "Error al cargar" si falla
   - "No hay tareas" si la lista está vacía

4. El botón Eliminar debe pedir confirmación

---

### Ejercicio 4: Formulario de Tareas (2 puntos)

En el componente `task-form`:

1. Crear formulario con campos:
   - Título (obligatorio, mínimo 3 caracteres)
   - Descripción (opcional)
   - Prioridad (select: alta/media/baja)
   - Completada (checkbox)

2. Validaciones:
   - El botón Guardar está deshabilitado si el título está vacío
   - Mostrar mensaje de error si el título tiene menos de 3 caracteres

3. El mismo componente sirve para:
   - **Crear**: cuando no hay ID en la URL
   - **Editar**: cuando hay `:id` en la URL (carga los datos)

4. Después de guardar, redirige a `/tasks`

---

### Ejercicio 5: Funcionalidad Extra (1 punto)

Implementa **UNA** de las siguientes opciones:

**Opción A - Contador de tareas:**
- Muestra en la página Home cuántas tareas hay completadas y pendientes

**Opción B - Filtro por estado:**
- Añade botones para filtrar: "Todas", "Completadas", "Pendientes"

**Opción C - Cambio rápido de estado:**
- Al hacer clic en el estado de una tarea, cambia entre Completada/Pendiente

---

### Ejercicio 6: GitHub y Despliegue (Obligatorio)

1. **Subir a GitHub:**
   - Crea un repositorio en GitHub
   - Sube todo el código del proyecto
   - El repositorio debe ser público o accesible para el profesor

2. **Desplegar en GitHub Pages:**
   - Genera el build de producción
   - Despliega la aplicación en GitHub Pages
   - Entrega el enlace de la web funcionando

---

## 📌 Criterios de Evaluación

| Criterio | Puntos |
|----------|--------|
| Estructura correcta y componentes | 2 |
| Modelo y servicio CRUD | 2 |
| Lista con filtro y estados UI | 2 |
| Formulario con validación | 2 |
| Funcionalidad extra | 1 |
| GitHub + Despliegue | 1 |
| **Total** | **10** |

---

## ⏱️ Tiempo recomendado: 2-3 horas

---

## 🔗 Recursos permitidos

- Documentación oficial de Angular: https://angular.dev
- MDN Web Docs: https://developer.mozilla.org

---

¡Buena suerte! 🍀
