
"use strict";

/* =====================================================
   CONFIGURACIÓN Y VARIABLES
   ===================================================== */

const STORAGE_KEY = "tasks_data";

let tasks = [];
let currentFilter = "all";
let editingTaskId = null;
let apiLoadFailed = false;

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-desc");
const priorityInput = document.getElementById("task-priority");
const dateInput = document.getElementById("task-date");
const saveButton = document.getElementById("btn-save");

const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-tasks");
const tasksContainer = document.getElementById("tasks-container");

const filterButtons = document.querySelectorAll(".btn-filter");

/* =====================================================
   ALMACENAMIENTO LOCAL
   ===================================================== */

function getStoredTasks() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (storedData === null) {
            return { exists: false, data: [] };
        }

        const parsedData = JSON.parse(storedData);

        if (!Array.isArray(parsedData)) {
            throw new Error("El almacenamiento no contiene una lista válida.");
        }

        return { exists: true, data: parsedData };
    } catch (error) {
        console.error("No se pudieron leer las tareas guardadas:", error);
        return { exists: false, data: [] };
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

        // Notificar que las tareas cambiaron.
        document.dispatchEvent(new CustomEvent("tasksChanged"));
    } catch (error) {
        console.error("No se pudieron guardar las tareas:", error);

        alert(
            "No fue posible guardar las tareas en el navegador. " +
            "Comprueba el almacenamiento disponible."
        );
    }
}

/* =====================================================
   RESUMEN Y PROGRESO
   ===================================================== */

function updateDashboard() {
    const totalElement = document.getElementById("total-tasks");
    const pendingElement = document.getElementById("pending-tasks");
    const completedElement = document.getElementById("completed-tasks");

    const percentageElement = document.getElementById("progress-percentage");
    const progressFill = document.getElementById("progress-fill");
    const progressTrack = document.getElementById("progress-track");
    const progressMessage = document.getElementById("progress-message");

    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed === true;
    }).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (pendingElement) {
        pendingElement.textContent = pending;
    }

    if (completedElement) {
        completedElement.textContent = completed;
    }

    if (percentageElement) {
        percentageElement.textContent = percentage + "%";
    }

    if (progressFill) {
        progressFill.style.width = percentage + "%";
    }

    if (progressTrack) {
        progressTrack.setAttribute("aria-valuenow", percentage);
    }

    if (progressMessage) {
        if (total === 0) {
            progressMessage.textContent =
                "Empieza con una tarea y construye tu progreso.";
        } else if (percentage === 100) {
            progressMessage.textContent =
                "¡Excelente! Has completado todas tus tareas.";
        } else if (percentage >= 50) {
            progressMessage.textContent =
                "¡Vas por buen camino! Sigue avanzando.";
        } else {
            progressMessage.textContent =
                "Cada tarea completada te acerca a tu objetivo.";
        }
    }
}

/* =====================================================
   ORDENAMIENTO DE TAREAS
   ===================================================== */

function getSortedTasks(list) {
    const sorted = [...list];
    const sortMode = sortSelect ? sortSelect.value : "newest";

    if (sortMode === "oldest") {
        sorted.sort(function (a, b) {
            return (Number(a.createdAt) || 0) -
                   (Number(b.createdAt) || 0);
        });
    } else if (sortMode === "priority") {
        const priorityValues = {
            alta: 3,
            media: 2,
            baja: 1
        };

        sorted.sort(function (a, b) {
            return (priorityValues[b.priority] || 0) -
                   (priorityValues[a.priority] || 0);
        });
    } else {
        sorted.sort(function (a, b) {
            return (Number(b.createdAt) || 0) -
                   (Number(a.createdAt) || 0);
        });
    }

    return sorted;
}

/* =====================================================
   MOSTRAR TAREAS EN PANTALLA
   ===================================================== */

function renderTasks() {
    if (!tasksContainer) {
        console.error("No se encontró el elemento tasks-container.");
        updateDashboard();
        return;
    }

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    let visibleTasks = [...tasks];

    if (currentFilter === "pending") {
        visibleTasks = visibleTasks.filter(function (task) {
            return task.completed !== true;
        });
    } else if (currentFilter === "completed") {
        visibleTasks = visibleTasks.filter(function (task) {
            return task.completed === true;
        });
    }

    if (searchTerm) {
        visibleTasks = visibleTasks.filter(function (task) {
            const title = String(task.title || "").toLowerCase();
            const description = String(task.description || "").toLowerCase();

            return title.includes(searchTerm) ||
                   description.includes(searchTerm);
        });
    }

    visibleTasks = getSortedTasks(visibleTasks);

    tasksContainer.replaceChildren();

    if (visibleTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-msg";

        if (apiLoadFailed && tasks.length === 0) {
            emptyMessage.textContent =
                "No se pudieron cargar las tareas iniciales. " +
                "Puedes crear una tarea usando el formulario.";
        } else if (searchTerm || currentFilter !== "all") {
            emptyMessage.textContent =
                "No hay tareas que coincidan con tu búsqueda o filtro.";
        } else {
            emptyMessage.textContent =
                "Todavía no hay tareas. ¡Crea tu primera tarea!";
        }

        tasksContainer.appendChild(emptyMessage);
        updateDashboard();
        return;
    }

    visibleTasks.forEach(function (task) {
        const card = document.createElement("article");
        card.className = "task-card";

        const validPriority = ["alta", "media", "baja"].includes(task.priority)
            ? task.priority
            : "media";

        card.classList.add("priority-" + validPriority);

        if (task.completed === true) {
            card.classList.add("completed");
        }

        const content = document.createElement("div");
        content.className = "task-content";

        const heading = document.createElement("h3");
        heading.textContent = task.title || "Tarea sin título";
        content.appendChild(heading);

        if (task.description) {
            const description = document.createElement("p");
            description.className = "task-description";
            description.textContent = task.description;
            content.appendChild(description);
        }

        const metadata = document.createElement("div");
        metadata.className = "task-meta";

        const priorityBadge = document.createElement("span");
        priorityBadge.className = "priority-badge priority-" + validPriority;
        priorityBadge.textContent =
            "Prioridad: " +
            validPriority.charAt(0).toUpperCase() +
            validPriority.slice(1);
        metadata.appendChild(priorityBadge);

        const statusBadge = document.createElement("span");
        statusBadge.className = "status-badge";
        statusBadge.textContent = task.completed
            ? "Completada"
            : "Pendiente";
        metadata.appendChild(statusBadge);

        if (task.dueDate) {
            const dueDate = document.createElement("span");
            dueDate.className = "task-date";

            const dateParts = String(task.dueDate).split("-");
            dueDate.textContent = dateParts.length === 3
                ? "Fecha límite: " +
                  dateParts[2] + "/" +
                  dateParts[1] + "/" +
                  dateParts[0]
                : "Fecha límite: " + task.dueDate;

            metadata.appendChild(dueDate);
        }

        content.appendChild(metadata);
        card.appendChild(content);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "btn-task";

        toggleButton.textContent = task.completed
            ? "Reabrir"
            : "Completar";

        toggleButton.addEventListener("click", function () {
            toggleTaskStatus(task.id);
        });

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn-task";
        editButton.textContent = "Editar";

        editButton.addEventListener("click", function () {
            editTask(task.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn-task btn-delete";
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        actions.appendChild(toggleButton);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(actions);
        tasksContainer.appendChild(card);
    });

    updateDashboard();
}

/* =====================================================
   CREAR Y EDITAR TAREAS
   ===================================================== */

if (taskForm) {
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const priority = priorityInput.value;
        const dueDate = dateInput.value;

        if (!title) {
            alert("Escribe un título para la tarea.");
            titleInput.focus();
            return;
        }

        if (editingTaskId !== null) {
            tasks = tasks.map(function (task) {
                if (String(task.id) === String(editingTaskId)) {
                    return {
                        ...task,
                        title: title,
                        description: description,
                        priority: priority,
                        dueDate: dueDate
                    };
                }

                return task;
            });

            editingTaskId = null;

            if (saveButton) {
                saveButton.textContent = "Agregar tarea";
            }
        } else {
            const newTask = {
                id: Date.now(),
                title: title,
                description: description,
                priority: priority,
                dueDate: dueDate,
                completed: false,
                createdAt: Date.now()
            };

            tasks.push(newTask);
        }

        saveTasks();
        taskForm.reset();

        if (titleInput) {
            titleInput.focus();
        }
    });
}

function editTask(id) {
    const task = tasks.find(function (item) {
        return String(item.id) === String(id);
    });

    if (!task) {
        return;
    }

    editingTaskId = task.id;

    titleInput.value = task.title || "";
    descriptionInput.value = task.description || "";
    priorityInput.value = task.priority || "media";
    dateInput.value = task.dueDate || "";

    if (saveButton) {
        saveButton.textContent = "Guardar cambios";
    }

    taskForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    titleInput.focus();
}

/* =====================================================
   COMPLETAR Y ELIMINAR TAREAS
   ===================================================== */

function toggleTaskStatus(id) {
    tasks = tasks.map(function (task) {
        if (String(task.id) === String(id)) {
            return {
                ...task,
                completed: task.completed !== true
            };
        }

        return task;
    });

    saveTasks();
}

function deleteTask(id) {
    const task = tasks.find(function (item) {
        return String(item.id) === String(id);
    });

    if (!task) {
        return;
    }

    const confirmed = window.confirm(
        '¿Deseas eliminar la tarea "' + task.title + '"?'
    );

    if (!confirmed) {
        return;
    }

    tasks = tasks.filter(function (item) {
        return String(item.id) !== String(id);
    });

    if (String(editingTaskId) === String(id)) {
        editingTaskId = null;
        taskForm.reset();

        if (saveButton) {
            saveButton.textContent = "Agregar tarea";
        }
    }

    saveTasks();
}

/* =====================================================
   FILTROS Y BÚSQUEDA
   ===================================================== */

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter || "all";

        filterButtons.forEach(function (item) {
            item.classList.toggle("active", item === button);
        });

        renderTasks();
    });
});

if (searchInput) {
    searchInput.addEventListener("input", renderTasks);
}

if (sortSelect) {
    sortSelect.addEventListener("change", renderTasks);
}

/* =====================================================
   EVENTO PERSONALIZADO
   ===================================================== */

document.addEventListener("tasksChanged", function () {
    renderTasks();
});

/* =====================================================
   CARGAR TAREAS DE JSONPLACEHOLDER
   ===================================================== */

async function loadTasksFromAPI() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/todos"
        );

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const apiTasks = await response.json();

        tasks = apiTasks.map(function (item) {
            return {
                id: "api-" + item.id,
                title: item.title,
                description: "",
                priority: "media",
                dueDate: "",
                completed: item.completed,
                createdAt: Date.now() - (item.id * 1000)
            };
        });

        saveTasks();
    } catch (error) {
        console.error("No se pudieron cargar las tareas iniciales:", error);
        apiLoadFailed = true;
        renderTasks();
    }
}

/* =====================================================
   INICIAR LA APLICACIÓN
   ===================================================== */

async function initApp() {
    const stored = getStoredTasks();

    if (stored.exists) {
        tasks = stored.data;
        renderTasks();
        return;
    }

    // Solo consulta la API si no hay datos guardados.
    await loadTasksFromAPI();
}

initApp();
