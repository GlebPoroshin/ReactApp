import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';
import TaskForm from './TaskForm';
import './components_styles/TaskBoard.css';

function TaskBoard({ tasks, onAddTask }) {
  const [showForm, setShowForm] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isDraggingTask, setIsDraggingTask] = useState(false);
  const boardRef = useRef(null);
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To do' },
    { id: 'in-progress', title: 'In progress' },
    { id: 'closed', title: 'Closed' },
    { id: 'frozen', title: 'Frozen' }
  ]);
  const [showColumnForm, setShowColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const getColumnTasks = (columnId) => {
    return tasks.filter(task => task.status === columnId);
  };

  useEffect(() => {
    const slider = boardRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      if (isDraggingTask || e.target !== slider) return;
      
      isDown = true;
      slider.classList.add('active');
      const rect = slider.getBoundingClientRect();
      startX = e.clientX - rect.left;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active');
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove('active');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX);
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingTask]);

  const handleAddTaskFromForm = (taskData) => {
    console.log('TaskBoard: Получены данные с формы:', taskData);
    
    let updatedTask;
    
    if (editingTask) {
      updatedTask = {
        ...taskData,
        status: editingTask.status
      };
      console.log('TaskBoard: Обновляем задачу:', updatedTask);
    } else {
      updatedTask = {
        ...taskData,
        status: currentStatus
      };
      console.log('TaskBoard: Добавляем новую задачу:', updatedTask);
    }
    
    onAddTask(updatedTask);
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    console.log('TaskBoard: Редактируем задачу:', task);
    setEditingTask(task);
    setShowForm(true);
  };

  const handleAddTaskToColumn = (columnId) => {
    setCurrentStatus(columnId);
    setEditingTask(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleAddColumn = () => {
    setShowColumnForm(true);
  };

  const handleCloseColumnForm = () => {
    setShowColumnForm(false);
    setNewColumnTitle('');
  };

  const handleCreateColumn = () => {
    if (newColumnTitle.trim() === '') return;
    
    const newColumnId = newColumnTitle.toLowerCase().replace(/\s+/g, '-');
    
    if (columns.some(col => col.id === newColumnId)) {
      alert('Столбец с таким названием уже существует!');
      return;
    }
    
    setColumns([
      ...columns,
      { id: newColumnId, title: newColumnTitle.trim() }
    ]);
    
    setShowColumnForm(false);
    setNewColumnTitle('');
  };

  const handleDragStart = () => {
    setIsDraggingTask(true);
  };

  const handleDragEnd = (result) => {
    setIsDraggingTask(false);
    
    const { source, destination, draggableId } = result;
    
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }

    const taskId = parseInt(draggableId, 10);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;

    const tasksInDestination = tasks.filter(t => t.status === destination.droppableId);
    const hasDuplicate = tasksInDestination.some(t => 
      t.id !== taskId && t.title === task.title
    );

    if (hasDuplicate) {
      alert(`Задача "${task.title}" уже существует в колонке "${columns.find(c => c.id === destination.droppableId)?.title}"`);
      return;
    }

    const updatedTask = {
      ...task,
      status: destination.droppableId
    };
    
    onAddTask(updatedTask);
  };

  return (
    <div className="task-board">
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <button className="close-form-button" onClick={handleCloseForm}>×</button>
            <TaskForm 
              onAddTask={handleAddTaskFromForm} 
              currentStatus={currentStatus} 
              editingTask={editingTask} 
            />
          </div>
        </div>
      )}

      {showColumnForm && (
        <div className="form-overlay">
          <div className="form-container" style={{ padding: '20px', maxWidth: '400px' }}>
            <button className="close-form-button" onClick={handleCloseColumnForm}>×</button>
            <h2>Добавить новый столбец</h2>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="columnTitle" style={{ display: 'block', marginBottom: '8px' }}>Название столбца:</label>
              <input 
                type="text" 
                id="columnTitle"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>
            <button 
              onClick={handleCreateColumn}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Создать столбец
            </button>
          </div>
        </div>
      )}
      
      <DragDropContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
      <div ref={boardRef} className="board-columns-wrapper scrollable">
        <div className="board-columns">
          {columns.map(column => (
            <TaskColumn 
              key={column.id}
                id={column.id}
              title={column.title} 
              tasks={getColumnTasks(column.id)} 
              onAddTask={() => handleAddTaskToColumn(column.id)} 
              onEditTask={handleEditTask}
            />
          ))}
          <button className="add-column-button" onClick={handleAddColumn}>+</button>
        </div>
      </div>
      </DragDropContext>
    </div>
  );
}

export default TaskBoard; 