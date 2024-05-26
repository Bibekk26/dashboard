document.addEventListener('DOMContentLoaded', () => {
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filterTitle = document.getElementById('filterTitle');
    const filterDueDate = document.getElementById('filterDueDate');
    const filterCategory = document.getElementById('filterCategory');
    const filterPriority = document.getElementById('filterPriority');
    const sortTasks = document.getElementById('sortTasks');

    let tasks = [];

    const addTaskToList = (task) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('taskItem');
        taskItem.setAttribute('data-id', task.id);
        taskItem.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <small>Due: ${task.dueDate}</small>
            <span>Category: ${task.category}</span>
            <span>Priority: ${task.priority}</span>
        `;
        taskList.appendChild(taskItem);
    };

    const loadTasks = () => {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToList(task));
    };

    const filterTasks = () => {
        const titleFilter = filterTitle.value.toLowerCase();
        const dueDateFilter = filterDueDate.value;
        const categoryFilter = filterCategory.value;
        const priorityFilter = filterPriority.value;
        return tasks.filter(task => {
            return (titleFilter === '' || task.title.toLowerCase().includes(titleFilter))
                && (dueDateFilter === '' || task.dueDate === dueDateFilter)
                && (categoryFilter === '' || task.category === categoryFilter)
                && (priorityFilter === '' || task.priority === priorityFilter);
        });
    };

    const sortTasksList = (tasks) => {
        const sortBy = sortTasks.value;
        return tasks.sort((a, b) => {
            if (sortBy === 'alphabetical') {
                return a.title.localeCompare(b.title);
            } else if (sortBy === 'reverseAlphabetical') {
                return b.title.localeCompare(a.title);
            } else if (sortBy === 'soonest') {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (sortBy === 'latest') {
                return new Date(b.dueDate) - new Date(a.dueDate);
            }
        });
    };

    const clearInputs = () => {
        taskTitle.value = '';
        taskDescription.value = '';
        taskDueDate.value = '';
        taskCategory.selectedIndex = 0;
        taskPriority.selectedIndex = 0;
    };

    addTaskButton.addEventListener('click', () => {
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();
        const dueDate = taskDueDate.value;
        const category = taskCategory.value;
        const priority = taskPriority.value;

        if (!title || !description || !dueDate || !category || !priority) {
            alert('Please fill in all fields');
            return;
        }

        const id = new Date().getTime().toString();
        const newTask = { id, title, description, dueDate, category, priority };
        tasks.push(newTask);
        addTaskToList(newTask);
        saveTasks();
        clearInputs();
    });

    filterTitle.addEventListener('input', displayFilteredTasks);
    filterDueDate.addEventListener('change', displayFilteredTasks);
    filterCategory.addEventListener('change', displayFilteredTasks);
    filterPriority.addEventListener('change', displayFilteredTasks);
    sortTasks.addEventListener('change', displayFilteredTasks);

    const displayFilteredTasks = () => {
        const filteredTasks = filterTasks();
        const sortedTasks = sortTasksList(filteredTasks);
        taskList.innerHTML = '';
        sortedTasks.forEach(task => addTaskToList(task));
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    loadTasks();
});
