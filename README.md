# Web-Notepad-
Web(NotePad)


html
----------
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Notepad</title>
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
    <div class="container">
        <h1>Sima's Notepad</h1>
        
        <!-- Task Creation Form -->
        <div class="form-container">
            <input type="text" id="taskTitle" placeholder="Notes Title">
            <textarea id="taskDescription" rows="3" placeholder="Notes Description"></textarea>
            <button onclick="addTask()">Add Notes</button>
        </div>
        
        <!-- Task List -->
        <div id="taskList"></div>
    </div>

    <script>
        // Fetch and display tasks on page load
        async function fetchTasks() {
            const response = await fetch('http://localhost:5000/api/notes');
            const tasks = await response.json();
            const taskListDiv = document.getElementById('taskList');
            taskListDiv.innerHTML = '';

            tasks.forEach(task => {
                const taskEl = document.createElement('div');
                taskEl.className = 'task';
                taskEl.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <button onclick="deleteTask('${task._id}')">Delete</button>
                    <button onclick="updateTask('${task._id}', this)">Update</button>
                    <textarea class="edit-description" style="display:none;">${task.description}</textarea>
                `;
                taskListDiv.appendChild(taskEl);
            });
        }

        // Add a new task
        async function addTask() {
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            
            if (!title || !description) return alert('Please provide both title and description');
            
            await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });
            
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            fetchTasks();
        }

        // Delete a task
        async function deleteTask(id) {
            await fetch(`http://localhost:5000/api/notes/${id}`, { method: 'DELETE' });
            fetchTasks();
        }

        // Update a task
        async function updateTask(id, button) {
            const textarea = button.nextElementSibling;
            textarea.style.display = 'block';
            textarea.focus();

            textarea.addEventListener('blur', async () => {
                const updatedDescription = textarea.value;
                const title = button.parentElement.querySelector('h3').textContent;
                
                await fetch(`http://localhost:5000/api/notes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description: updatedDescription })
                });
                
                fetchTasks();
            });
        }

        fetchTasks(); // Initial fetch to populate tasks
    </script>
</body>
</html>



css
----------

*{
    margin: 0;
    padding: 0;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    /* margin-top: 70px; */
    padding: 0;
}


.container {
    width: 80%;
    max-width: 600px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

h1 {
    text-align: center;
    color: #333;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

input, textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
}

button {
    background-color: #007bff;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

#taskList {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.task {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
}

.edit-description {
    width: 100%;
    padding: 8px;
    margin-top: 10px;
}
