import React, { useState } from 'react';
import './App.css';
import TaskBoard from './components/TaskBoard';

function App() {
  const initialTasks = [
    {
      id: 1,
      title: 'CRM system design',
      participant: 'Azhar',
      dateAdded: '12/04/2021',
      priority: 'medium',
      status: 'todo'
    },
    {
      id: 2,
      title: 'Statistics',
      participant: 'Artur',
      dateAdded: '12/04/2021',
      priority: 'low',
      status: 'todo'
    },
    {
      id: 3,
      title: 'Priorities',
      participant: 'Adyl, Artur',
      dateAdded: '12/04/2021',
      priority: 'high',
      status: 'todo'
    },
    {
      id: 4,
      title: 'Notifications',
      participant: 'Artur',
      dateAdded: '12/04/2021',
      priority: 'low',
      status: 'in-progress'
    },
    {
      id: 5,
      title: 'Task types',
      participant: 'Adyl',
      dateAdded: '12/04/2021',
      priority: 'low',
      status: 'in-progress'
    },
    {
      id: 6,
      title: 'Todoshnik design',
      participant: 'Azhar',
      dateAdded: '12/04/2021',
      priority: 'low',
      status: 'frozen'
    }
  ];

  const [tasks, setTasks] = useState(initialTasks);

  const handleAddOrUpdateTask = (taskData) => {
    console.log('Получены данные задачи:', taskData);
    
    const taskId = typeof taskData.id === 'string' ? parseInt(taskData.id, 10) : taskData.id;
    
    const existingTaskIndex = tasks.findIndex(task => task.id === taskId);
    console.log('Индекс существующей задачи:', existingTaskIndex);
    
    if (existingTaskIndex !== -1) {
      const updatedTasks = [...tasks];
      
      const status = taskData.status || tasks[existingTaskIndex].status;
      
      updatedTasks[existingTaskIndex] = {
        ...taskData,
        id: taskId,
        status: status
      };
      
      console.log('Обновление задачи:', updatedTasks[existingTaskIndex]);
      setTasks(updatedTasks);
    } else {
      const newTask = {
        ...taskData,
        id: taskId || Date.now()
      };
      
      console.log('Добавление новой задачи:', newTask);
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
  };

  return (
    <div className="App">
      <TaskBoard tasks={tasks} onAddTask={handleAddOrUpdateTask} />
    </div>
  );
}

export default App;
