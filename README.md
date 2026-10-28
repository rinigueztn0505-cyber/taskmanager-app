# TaskManager App - Gestión de Tareas Offline

Aplicación web interactiva desarrollada para la **Actividad Integradora 2** de la asignatura **Programación de Sistemas Web**. La herramienta permite gestionar tareas diarias con persistencia de datos en el navegador.

---

## Funcionalidades Principales
*  **Crear tareas:** Formulario con título (*), descripción, nivel de prioridad (Baja, Media, Alta) y fecha límite.
*  **Editar y Eliminar:** Edición directa en el formulario y confirmación de eliminación de tareas.
*  **Estado de Tareas:** Alternar entre estado pendiente y completado.
*  **Búsqueda y Filtros:** Búsqueda en tiempo real por palabra clave y filtro por estado (Todas, Pendientes, Completadas).
*  **Persistencia Local:** Los datos se conservan al recargar la página gracias a `localStorage`.
*  **Diseño Responsive:** Interfaz adaptativa construida con CSS Flexbox y Variables CSS.

---

## Tecnologías Utilizadas
* **HTML5:** Estructuración semántica.
* **CSS3:** Hoja de estilos externa con diseño adaptable y variables corporativas.
* **JavaScript (ES6+):** Manipulación del DOM, eventos asíncronos y almacenamiento local.
* **Git & GitHub Desktop:** Control de versiones con historial de ramas y commits.
* **Visual Studio Code:** Entorno de desarrollo para la edición del código.

---

## Estructura del Proyecto
```text
taskmanager-app/
├── index.html          # Interfaz principal de la aplicación
├── styles.css          # Hojas de estilo y diseño adaptable
├── app.js              # Lógica de JavaScript y localStorage
├── AI_DECLARATION.md   # Declaración obligatoria de uso de IA
└── README.md           # Documentación general del repositorio