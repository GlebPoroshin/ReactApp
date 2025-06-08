import React, { useState, useEffect } from 'react';
import './components_styles/TaskForm.css';

function TaskForm({ onAddTask, currentStatus, editingTask = null }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('low');
  const [participants, setParticipants] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskId, setTaskId] = useState(null);

  useEffect(() => {
    console.log('TaskForm: Получили задачу для редактирования:', editingTask);
    
    if (editingTask) {
      setTitle(editingTask.title || '');
      setPriority(editingTask.priority || 'low');
      setParticipants(editingTask.participant || '');
      setTaskId(editingTask.id);
      setIsEditMode(true);
      console.log('TaskForm: Установлен режим редактирования, id задачи:', editingTask.id);
    } else {
      setIsEditMode(false);
      setTaskId(null);
    }
  }, [editingTask]);

  const formatStatusName = (statusId) => {
    // Разделяем по дефису и преобразуем каждое слово с заглавной буквы
    return statusId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusName = () => {
    if (!currentStatus) return '';
    return formatStatusName(currentStatus);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Пожалуйста, введите название задачи');
      return;
    }
    
    const currentDate = new Date().toLocaleDateString();
    
    const taskData = {
      id: taskId || Date.now(),
      title: title.trim(),
      priority,
      participant: participants.trim(),
      dateAdded: editingTask?.dateAdded || currentDate
    };
    
    console.log('TaskForm: Отправляем данные формы:', taskData);
    onAddTask(taskData);
    
    setTitle('');
    setPriority('low');
    setParticipants('');
  };

  return (
    <div className="task-form-container">
      <h2 className="form-title">{isEditMode ? 'Редактировать задачу' : `Новая задача в "${getStatusName()}"`}</h2>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Название задачи:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название задачи"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="participants">Участники:</label>
          <input
            type="text"
            id="participants"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="Имена участников, через запятую"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Приоритет:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>
        
        <button type="submit" className="submit-button">
          {isEditMode ? 'Сохранить изменения' : 'Добавить задачу'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
