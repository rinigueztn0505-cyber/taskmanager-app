# TaskManager App - Gestión de Tareas Offline

Aplicación web interactiva desarrollada para la **Actividad Integradora 2** de la asignatura **Programación de Sistemas Web**. La herramienta permite gestionar tareas diarias con persistencia de datos en el navegador y consumo de API externa.

---

## Funcionalidades Principales
- **Crear tareas:** Formulario con título (*), descripción, nivel de prioridad (Baja, Media, Alta) y fecha límite.
- **Editar y Eliminar:** Edición directa en el formulario y confirmación de eliminación de tareas.
- **Estado de Tareas:** Alternar entre estado pendiente y completado con actualización reactiva del dashboard.
- **Búsqueda, Filtros y Ordenamiento:** Búsqueda en tiempo real por palabra clave, filtro por estado (Todas, Pendientes, Completadas) y ordenamiento por fecha o prioridad.
- **Consumo de API REST:** Carga inicial automática desde JSONPlaceholder con manejo de excepciones y respaldo offline.
- **Persistencia Local:** Los datos se conservan al recargar la página gracias a `localStorage` y eventos personalizados (`CustomEvent`).
- **Diseño Responsive:** Interfaz adaptativa con barra lateral (Sidebar), CSS Grid/Flexbox y Variables CSS.

---

## Tecnologías Utilizadas
- **HTML5:** Estructuración semántica con paneles de control y dashboard.
- **CSS3:** Hoja de estilos externa con diseño adaptable, sombras y variables corporativas (`:root`).
- **JavaScript (ES6+):** Manipulación avanzada del DOM, asincronía (`async/await`), eventos personalizados y almacenamiento local.
- **Git & GitHub:** Control de versiones con historial de commits incrementales.
- **Visual Studio Code:** Entorno de desarrollo para la codificación..

---

## Estructura del Proyecto
```text
taskmanager-app/
├── index.html         # Interfaz principal con barra lateral y dashboard
├── styles.css         # Hojas de estilo y diseño adaptable
├── app.js             # Lógica de JavaScript, API REST y localStorage
├── AI_DECLARATION.md  # Declaración obligatoria de uso de IA
└── README.md          # Documentación general del repositorio