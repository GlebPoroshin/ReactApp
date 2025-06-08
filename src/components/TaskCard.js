import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './components_styles/TaskCard.css';

function TaskCard({ id, title, priority, participant, dateAdded, status, onEdit, index }) {
  const getPriorityClass = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return '';
    }
  };

  const getBorderClass = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'high-border';
      case 'medium': return 'medium-border';
      case 'low': return 'low-border';
      default: return '';
    }
  };

  const handleEdit = () => {
    console.log('TaskCard: Нажата кнопка редактирования для задачи:', id);
    onEdit({ 
      id, 
      title, 
      priority, 
      participant, 
      dateAdded,
      status 
    });
  };

  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided, snapshot) => (
        <div 
          className={`task-card ${getBorderClass(priority)} ${snapshot.isDragging ? 'is-dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
      <div className="task-header">
        <span className="task-title">{title}</span>
        <span className={`priority-label ${getPriorityClass(priority)}`}>{priority}</span>
      </div>
      <div className="task-details">
        <div className="detail-row">
          <span className="detail-label">Participant:</span>
          <span className="detail-value">{participant}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Date added:</span>
          <span className="detail-value">{dateAdded}</span>
        </div>
      </div>
      <button className="edit-task-button" onClick={handleEdit} aria-label="Edit task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.293 2.293L17.707 3.707L9 12.414L7.586 11L16.293 2.293ZM18.707 2.293L20.121 3.707C20.5115 4.09747 20.7312 4.63348 20.7312 5.1935C20.7312 5.75352 20.5115 6.28953 20.121 6.68L11.414 15.387L6.886 16.922L8.421 12.394L17.128 3.687C17.5185 3.29747 18.0545 3.0778 18.6145 3.0778C19.1745 3.0778 19.7105 3.29747 20.101 3.687L18.687 2.273L18.707 2.293ZM4 21H20V23H4V21Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
      )}
    </Draggable>
  );
}

export default TaskCard;