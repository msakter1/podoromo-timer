// script.js
document.addEventListener('DOMContentLoaded', () => {
    const videoSources = [
        'videos/cozy-cafe.mp4',
        'videos/rainy-window.mp4',
        'videos/fireplace.mp4',
        'videos/snow.mp4'
    ];
    
    const backgroundVideo = document.getElementById('backgroundVideo');
    const videoDialog = document.getElementById('videoDialog');
    
    // Load video selection dialog
    fetch('video-options.html')
        .then(res => res.text())
        .then(html => {
            videoDialog.innerHTML = html;
            videoDialog.querySelectorAll('.video-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    backgroundVideo.src = btn.dataset.src;
                    videoDialog.close();
                });
            });
        });

    document.getElementById('videoSelectBtn').addEventListener('click', () => videoDialog.showModal());

    // Timer Logic
    let timer;
    let timeLeft;
    let isWorking = true;
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startTimer');
    const resetBtn = document.getElementById('resetTimer');
    // const cat = document.getElementById('cat');

    function updateTimerDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer(duration) {
        timeLeft = duration * 60;
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            cat.style.transform = `scale(${1 + Math.sin(Date.now()/500)*0.1})`;
            
            if(timeLeft <= 0) {
                clearInterval(timer);
                isWorking = !isWorking;
                const nextDuration = isWorking 
                    ? document.getElementById('workDuration').value 
                    : document.getElementById('breakDuration').value;
                alert(isWorking ? 'Break time over! Back to work!' : 'Great job! Time for a break!');
                startTimer(nextDuration);
            }
        }, 1000);
    }

    startBtn.addEventListener('click', () => {
        const duration = document.getElementById('workDuration').value;
        startTimer(duration);
        startBtn.disabled = true;
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(timer);
        const duration = document.getElementById('workDuration').value;
        updateTimerDisplay(duration * 60);
        startBtn.disabled = false;
    });

    // Todo List
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = tasks.map(task => `
            <li class="${task.completed ? 'completed' : ''}">${task.text}</li>
        `).join('');
    }

    todoForm.addEventListener('submit', e => {
        e.preventDefault();
        if(taskInput.value.trim()) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ text: taskInput.value, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            loadTasks();
            cat.style.transform = 'rotate(360deg)';
            setTimeout(() => cat.style.transform = '', 500);
        }
    });

    taskList.addEventListener('click', e => {
        if(e.target.tagName === 'LI') {
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            const index = [...taskList.children].indexOf(e.target);
            tasks[index].completed = !tasks[index].completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }
    });


    // Spotify Playlists
    const playlists = [
        '37i9dQZF1DX4WYpdgoIcn6', 
        '37i9dQZF1DXcBWIGoYBM5M', 
        '37i9dQZF1DX3rxVfibe1L0' 
    ];

    const playlistContainer = document.getElementById('playlistContainer');
    playlistContainer.innerHTML = playlists.map(id => `
        <iframe src="https://open.spotify.com/embed/playlist/${id}" 
                width="100%" 
                height="80" 
                allowtransparency="true" 
                allow="encrypted-media"></iframe>
    `).join('');

    // Fullscreen
    document.getElementById('fullscreenBtn').addEventListener('click', () => {
        if(!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Initial Load
    loadTasks();
    backgroundVideo.src = videoSources[0];

    
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = tasks.map((task, index) => `
            <li class="${task.completed ? 'completed' : ''}">
                ${task.text}
                <button class="delete-task" data-index="${index}">×</button>
            </li>
        `).join('');
    }
    
    // Add task deletion handler
    taskList.addEventListener('click', (e) => {
        if(e.target.classList.contains('delete-task')) {
            const index = e.target.dataset.index;
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
            cat.reactToEvent('taskDeleted');
        }
        else if(e.target.tagName === 'LI') {
            const index = [...taskList.children].indexOf(e.target);
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks[index].completed = !tasks[index].completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }
    });
    
});
