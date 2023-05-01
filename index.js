'use strict';
/* -------------------------- Declaring variables -----------------------------  */
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskDeadlineInput = document.getElementById('taskDeadline');
const taskPriorityInput = document.getElementById('taskPriority');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');

let tasks = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

/* -------------------------------- Adding a Task ---------------------------------  */
function addTask(){
    const taskTitle = taskTitleInput.value;
    const taskDescription = taskDescriptionInput.value;
    const taskDeadline = taskDeadlineInput.value;
    const taskPriority = taskPriorityInput.value;
    const taskCompleted = false;
    const timestamp = Date.now();

    if(new Date(taskDeadline) < new Date()){
        return alert('The deadline cannot be in the past. Choose a valid deadline.');
    } else if(!taskTitle){
        return alert('Choose a title to add a new task.');
    }

    const newTask = {
        id: timestamp,
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        priority: taskPriority,
        done: taskCompleted,
        status: ''
    };

    tasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    let sortBy = sortSelect.value;
    let sortOrder = orderSelect.value;

    sortTasksBy(sortBy, sortOrder);

    showTasks();

    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    taskDeadlineInput.value = '';
    taskPriority.value = 'low';
}

addTaskBtn.addEventListener('click', addTask);

/* ------------------------------- Rendering Tasks --------------------------------  */
function showTasks() {
    tasksList.innerHTML = '';

    tasks.forEach((task, index) => {
        if (task.done) {
            task.status = 'completed';
        } else {
            task.status = 'incomplete';
        }

        const li = document.createElement('li');
        li.setAttribute('data-index', index);
        li.setAttribute('data-id', task.id);

        if (task.done) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'completed';
        checkbox.classList.add('taskDone');
        checkbox.setAttribute('data-id', task.id);
        checkbox.setAttribute('data-index', index);
        if (task.done) {
            checkbox.checked = true;
        }
        li.appendChild(checkbox);

        const span1 = document.createElement('span');
        span1.textContent = index;
        li.appendChild(span1);

        const span2 = document.createElement('span');
        span2.textContent = ('. ') + task.title;
        li.appendChild(span2);

        const span3 = document.createElement('span');
        if(task.description === ''){
            span3.textContent = task.description;
        } else {
            span3.textContent = ('Description: ') + task.description;
        }
        li.appendChild(span3);

        const span4 = document.createElement('span');
        if(task.deadline === ''){
            span4.textContent = task.deadline;
        } else {
            span4.textContent = ('Deadline: ') + task.deadline;
        }
        li.appendChild(span4);

        const span5 = document.createElement('span');
        span5.textContent = ('Priority: ') + task.priority;
        li.appendChild(span5);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('editTaskBtn');
        li.appendChild(editBtn);
        editBtn.addEventListener('click', function (event) {
            editTask(`${index}`);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('data-index', index);
        deleteBtn.setAttribute('data-id', task.id);
        deleteBtn.classList.add('deleteTaskBtn');
        li.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', function (event) {
            deleteTask(`${task.id}`);
        });

        tasksList.append(li);

        const taskDoneInput = li.querySelector('.taskDone');
        taskDoneInput.addEventListener('click', function (event) {
            markTaskCompleted(event.target.getAttribute('data-index'));
        });
    });
}

document.addEventListener('DOMContentLoaded', function(){
    showTasks();
})

/* -------------------------------- Editing a Task --------------------------------  */
function editTask(index) {
    const task = tasks[index];

    // Create form elements
    const form = document.createElement('form');
    const titleInput = document.createElement('input');
    const descriptionInput = document.createElement('input');
    const deadlineInput = document.createElement('input');
    const priorityInput = document.createElement('select');
    const saveBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    // Set input values
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    deadlineInput.value = task.deadline;
    priorityInput.value = task.priority;

    // Set input attributes
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('placeholder', 'Title');
    descriptionInput.setAttribute('type', 'text');
    descriptionInput.setAttribute('placeholder', 'Description');
    deadlineInput.setAttribute('type', 'date');
    priorityInput.setAttribute('name', 'priority');
    priorityInput.setAttribute('id', 'priority');
    priorityInput.innerHTML = `
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
    <option value="high">Urgent</option>
    `;
    saveBtn.textContent = 'Save';
    cancelBtn.textContent = 'Cancel';

    // Add input elements to form
    form.appendChild(titleInput);
    form.appendChild(descriptionInput);
    form.appendChild(deadlineInput);
    form.appendChild(priorityInput);
    form.appendChild(saveBtn);
    form.appendChild(cancelBtn);

    // Replace li element with form
    const li = tasksList.querySelector(`li[data-index="${index}"]`);
    li.replaceWith(form);

    // Add event listeners
    form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Update task object
    task.title = titleInput.value;
    task.description = descriptionInput.value;
    task.deadline = deadlineInput.value;
    task.priority = priorityInput.value;

    // Save tasks to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Render tasks
    showTasks();
    });

    cancelBtn.addEventListener('click', function() {
    // Replace form element with li
    form.replaceWith(li);
    });
}

/* -------------------------------- Deleting a Task -------------------------------  */

function deleteTask(taskID){
    const ID = Number(taskID);
    const taskIndex = tasks.findIndex(task => task.id === ID);
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskToRemove = tasksList.querySelector(`li[data-id="${ID}"]`);
    taskToRemove.remove();
}

/* -------------------------------- Sorting a Task -------------------------------  */

function sortTasksBy(sortBy, sortOrder) {
    tasks.sort(function(a, b) {
        let compareResult = 0;
        if (sortBy === 'title') {
            compareResult = a.title.localeCompare(b.title);
        } else if (sortBy === 'description') {
            compareResult = a.description.localeCompare(b.description);
        } else if (sortBy === 'deadline') {
            compareResult = new Date(a.deadline) - new Date(b.deadline);
        } else if (sortBy === 'priority') {
            const priorityOrder = ['urgent', 'high', 'medium', 'low'];
            compareResult = priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        }
        return sortOrder === 'ascending' ? compareResult : -compareResult;    
    });
    showTasks();
}

let sortSelect = document.getElementById('sortedBy');
let orderSelect = document.getElementById('sortOrder');
sortSelect.addEventListener('change', function() {
    let sortBy = sortSelect.value;
    let sortOrder = orderSelect.value;
    sortTasksBy(sortBy, sortOrder);
});
orderSelect.addEventListener('change', function() {
    let sortBy = sortSelect.value;
    let sortOrder = orderSelect.value;
    sortTasksBy(sortBy, sortOrder);
});

/* -------------------------------- Changing Task's Status -------------------------------  */
function markTaskCompleted(index) {
    tasks[index].done = !tasks[index].done;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    showTasks();
    
    const li = document.querySelector(`li[data-index="${index}"]`);
    if (tasks[index].done) {
        li.classList.add('completed');
    } else {
        li.classList.remove('completed');
    }
}

/* --------------------------------- Filtering Tasks ----------------------------------  */
function filterTasksByStatus(status) {
    let tasksByStatus = tasks.filter(task => task.done === (status === 'completed'));
    showFilteredTasks(tasksByStatus);
}

function filterTasksByPriority(priority) {
    let tasksByPriority = tasks.filter(task => task.priority=== priority);
    console.log(tasksByPriority);
    showFilteredTasks(tasksByPriority);
}

function filterTasksByStatusAndPriority(status, priority) {
    let tasksByStatus = tasks.filter(task => task.done === (status === 'completed'));
    let tasksByPriority = tasksByStatus.filter(task => task.priority === priority);
    showFilteredTasks(tasksByPriority);
}

function showFilteredTasks(filteredTasks) {
    tasksList.innerHTML = '';
    
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', index);
        li.setAttribute('data-id', task.id);
        
        if (task.done) {
            li.classList.add('completed');
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'completed';
        checkbox.classList.add('taskDone');
        checkbox.setAttribute('data-id', task.id);
        checkbox.setAttribute('data-index', index);
        if (task.done) {
            checkbox.checked = true;
        }
        li.appendChild(checkbox);
        
        const span1 = document.createElement('span');
        span1.textContent = index;
        li.appendChild(span1);
        
        const span2 = document.createElement('span');
        span2.textContent = task.title;
        li.appendChild(span2);
        
        const span3 = document.createElement('span');
        span3.textContent = task.description;
        li.appendChild(span3);
        
        const span4 = document.createElement('span');
        span4.textContent = task.deadline;
        li.appendChild(span4);
        
        const span5 = document.createElement('span');
        span5.textContent = task.priority;
        li.appendChild(span5);
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('editTaskBtn');
        li.appendChild(editBtn);
        editBtn.addEventListener('click', function (event) {
            editTask(`${index}`);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('data-index', index);
        deleteBtn.setAttribute('data-id', task.id);
        deleteBtn.classList.add('deleteTaskBtn');
        li.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', function (event) {
            deleteTask(`${task.id}`);
        });
        
        tasksList.append(li);
        
        const taskDoneInput = li.querySelector('.taskDone');
        taskDoneInput.addEventListener('click', function (event) {
            markTaskCompleted(event.target.getAttribute('data-index'));
        });
    });
}

const statusSelect = document.getElementById('filterByStatus');
statusSelect.addEventListener('change', function(){
    let statusSelected = statusSelect.value;
    filterTasksByStatus(statusSelected);
})

const prioritySelect = document.getElementById('filterByPriority');
prioritySelect.addEventListener('change', function(){
    let prioritySelected = prioritySelect.value;
    filterTasksByPriority(prioritySelected);
})

const filterBothBtn = document.getElementById('filterByBoth');
filterBothBtn.addEventListener('click', function (){
    let statusSelected = statusSelect.value;
    let prioritySelected = prioritySelect.value;
    filterTasksByStatusAndPriority(statusSelected, prioritySelected);
})

const showAllBtn = document.getElementById('showAll');
showAllBtn.addEventListener('click', function (){
    showTasks();
})

/* ------------------------------- Search Tasks by Keywords ------------------------------  */

function searchTasksByKeyword(keyword) {
    if (!keyword || keyword.trim() === '') {
        alert('Please provide a valid keyword.');
    return;
    }
    let tasksByKeyword = tasks.filter(task => task.title.toLowerCase().includes(keyword.toLowerCase()) || task.description.toLowerCase().includes(keyword.toLowerCase()));
    showFilteredTasks(tasksByKeyword);
}

function handleSearch(event) {
    event.preventDefault();
    let keyword = document.getElementById('search').value;
    searchTasksByKeyword(keyword);
}

