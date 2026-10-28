// =======================================================
// 1. ESTADO GLOBAL Y SELECCIÓN DE ELEMENTOS DEL DOM
// =======================================================
// Cargar tareas guardadas desde localStorage o inicializar arreglo vacío
let tasks = JSON.parse(localStorage.getItem('tasks_data')) || [];

// Referencias a los elementos del formulario HTML
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const taskPriorityInput = document.getElementById('task-priority');
const taskDateInput = document.getElementById('task-date');
const btnSave = document.getElementById('btn-save');

// Referencias a filtros y lista de tareas
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.btn-filter');
const tasksContainer = document.getElementById('tasks-container');

// Variables para control de filtros activos y edición
let currentFilter = 'all';
let editTaskId = null;

// =======================================================
// 2. FUNCIONES DE PERSISTENCIA (localStorage)
// =======================================================
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks_data', JSON.stringify(tasks));
}

// =======================================================
// 3. RENDERIZADO DINO EN EL DOM
// =======================================================
function renderTasks() {
    tasksContainer.innerHTML = '';

    // Filtrar tareas según el estado activo y la búsqueda por texto
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredTasks = tasks.filter(task => {
        // Filtro por estado (todas, pendientes, completadas)
        const matchesFilter = 
            currentFilter === 'all' ? true :
            currentFilter === 'pending' ? !task.completed :
            currentFilter === 'completed' ? task.completed : true;

        // Búsqueda por coincidencia en el título
        const matchesSearch = task.title.toLowerCase().includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    // Si no hay tareas para mostrar
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <p class="empty-msg">No se encontraron tareas que coincidan con los criterios.</p>
        `;
        return;
    }

    // Renderizar cada tarjeta de tarea
    filteredTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`;

        card.innerHTML = `
            <div class="task-info">
                <h3 class="task-title">${task.title}</h3>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <div class="task-meta">
                    <span class="badge ${task.priority}">Prioridad: ${task.priority.toUpperCase()}</span>
                    ${task.dueDate ? `<span>📅 Límite: ${task.dueDate}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-action" onclick="toggleTaskStatus(${task.id})" title="${task.completed ? 'Marcar pendiente' : 'Marcar completada'}">
                    ${task.completed ? '↩️' : '✅'}
                </button>
                <button class="btn-action" onclick="editTask(${task.id})" title="Editar tarea">✏️</button>
                <button class="btn-action" onclick="deleteTask(${task.id})" title="Eliminar tarea">🗑️</button>
            </div>
        `;

        tasksContainer.appendChild(card);
    });
}

// =======================================================
// 4. MANEJO DE EVENTOS (AGREGAR Y EDITAR)
// =======================================================
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();
    const priority = taskPriorityInput.value;
    const dueDate = taskDateInput.value;

    if (!title) return;

    if (editTaskId !== null) {
        // Modo edición de tarea existente
        tasks = tasks.map(task => {
            if (task.id === editTaskId) {
                return { ...task, title, description, priority, dueDate };
            }
            return task;
        });
        editTaskId = null;
        btnSave.textContent = '➕ Guardar Tarea';
    } else {
        // Modo agregar nueva tarea
        const newTask = {
            id: Date.now(),
            title,
            description,
            priority,
            dueDate,
            completed: false
        };
        tasks.unshift(newTask); // Insertar al inicio de la lista
    }

    // Guardar en localStorage, limpiar formulario y re-renderizar DOM
    saveTasksToLocalStorage();
    taskForm.reset();
    renderTasks();
});

// Cambiar estado completado / pendiente
window.toggleTaskStatus = function (id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasksToLocalStorage();
    renderTasks();
};

// Eliminar tarea
window.deleteTask = function (id) {
    if (confirm('¿Estás seguro/a de eliminar esta tarea?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToLocalStorage();
        renderTasks();
    }
};

// Preparar formulario para edición
window.editTask = function (id) {
    const taskToEdit = tasks.find(task => task.id === id);
    if (!taskToEdit) return;

    taskTitleInput.value = taskToEdit.title;
    taskDescInput.value = taskToEdit.description || '';
    taskPriorityInput.value = taskToEdit.priority;
    taskDateInput.value = taskToEdit.dueDate || '';

    editTaskId = id;
    btnSave.textContent = '💾 Actualizar Tarea';
    taskTitleInput.focus();
};

// =======================================================
// 5. EVENTOS DE FILTROS Y BÚSQUEDA EN TIEMPO REAL
// =======================================================
searchInput.addEventListener('input', renderTasks);

filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        currentFilter = this.getAttribute('data-filter');
        renderTasks();
    });
});

// Cargar la lista inicial al abrir la aplicación
document.addEventListener('DOMContentLoaded', renderTasks);
searchInput.addEventListener('input', renderTasks);