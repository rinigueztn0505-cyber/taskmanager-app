# Declaración de Uso de Inteligencia Artificial

**Asignatura:** Programación de Sistemas Web  
**Proyecto:** Actividad Integradora 2 – TaskManager App  
**Estudiante:** Ricardo Iñiguez Valencia  
**Fecha:** Octubre de 2026  

---

##  Declaración de Asistencia de IA

Para la realización de esta actividad se contó con la asistencia colaborativa de **Gemini Notebook / Asistente Virtual**, principalmente en la estructuración de la lógica de manipulación del DOM y persistencia de datos.

---

##  Prompts Utilizados

1. **Estructura HTML & CSS:**  
   *"¿Cómo maquetar un panel de gestión de tareas accesible con formulario, área de filtros y tarjetas responsivas usando CSS Flexbox y Variables CSS?"*

2. **Lógica de Persistencia y Manipulación del DOM:**  
   *"¿Cómo guardar, editar, eliminar y filtrar un arreglo de objetos de tareas en localStorage usando JavaScript Vanilla puro (ES6+) sin librerías externas?"*

---

##  Código Generado vs. Adaptación Realizada

* **Código Generado:** Funciones base para la captura de eventos en el formulario (`submit`), filtrado con `.filter()` y renderizado dinámico de tarjetas HTML mediante `innerHTML`.
* **Adaptación Realizada por el Estudiante:**  
  * Personalización de los campos del formulario (título, descripción, prioridad con colores distintivos y fecha de vencimiento).
  * Configuración de estilos dinámicos para indicar tareas completadas (con texto tachado y cambio de opacidad).
  * Verificación manual e integración modular para asegurar que la aplicación funcione en modo totalmente offline.