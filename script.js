 const STORAGE_KEY = 'todo-tasks';
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const stats = document.getElementById('stats');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');

    function saveTasks() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function renderTasks() {
      const pending = tasks.filter(t => !t.completed).length;
      const completed = tasks.filter(t => t.completed).length;

      stats.style.display = tasks.length ? 'flex' : 'none';
      pendingCount.textContent = `${pending} pending`;
      completedCount.textContent = `${completed} completed`;

      if (tasks.length === 0) {
        taskList.innerHTML = `
          <div class="empty-state">
            <p>No tasks yet</p>
            <p>Add your first task above</p>
          </div>
        `;
        return;
      }

      taskList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <div class="checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.id}')">
            ${task.completed ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
          </div>
          <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
          <button class="delete-btn" onclick="deleteTask('${task.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `).join('');
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function addTask() {
      const text = taskInput.value.trim();
      if (!text) return;

      tasks.unshift({
        id: crypto.randomUUID(),
        text,
        completed: false
      });

      saveTasks();
      renderTasks();
      taskInput.value = '';
      addBtn.disabled = true;
    }

    function toggleTask(id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      }
    }

    function deleteTask(id) {
      const el = document.querySelector(`[data-id="${id}"]`);
      if (el) {
        el.classList.add('deleting');
        setTimeout(() => {
          tasks = tasks.filter(t => t.id !== id);
          saveTasks();
          renderTasks();
        }, 200);
      }
    }

    taskInput.addEventListener('input', () => {
      addBtn.disabled = !taskInput.value.trim();
    });

    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addTask();
    });

    addBtn.addEventListener('click', addTask);

    renderTasks();