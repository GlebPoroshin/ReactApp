import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import './components_styles/TaskColumn.css';
import TaskCard from './TaskCard';

function TaskColumn({ id, title, tasks, onAddTask, onEditTask }) {
  return (
    <div className="task-column">
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <button className="add-task-button" onClick={onAddTask}>+</button>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div 
            className={`tasks-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks && tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            id={task.id}
                index={index}
            title={task.title}
            priority={task.priority}
            participant={task.participant}
            dateAdded={task.dateAdded}
            status={task.status}
            onEdit={onEditTask}
          />
        ))}
            {provided.placeholder}
      </div>
        )}
      </Droppable>
    </div>
  );
}

export default TaskColumn;