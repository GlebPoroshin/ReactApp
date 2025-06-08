 "use client"

import { memo } from "react"
import { Droppable } from "@hello-pangea/dnd"
import TaskCard from "./TaskCard"

const TaskColumn = ({ id, title, tasks, onAddTask, onEditTask, isMobile, isTablet, isDesktop }) => {
  const getColumnClassName = () => {
    let baseClass = "task-column"

    if (isMobile) {
      baseClass += " task-column--mobile"
    } else if (isTablet) {
      baseClass += " task-column--tablet"
    } else {
      baseClass += " task-column--desktop"
    }

    return baseClass
  }

  return (
    <div className={getColumnClassName()}>
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <div className="column-meta">
          <span className="task-count">{tasks.length}</span>
          <button className="add-task-button" onClick={onAddTask} aria-label={`Add task to ${title}`}>
            +
          </button>
        </div>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            className={`tasks-container ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length === 0 ? (
              <div className="empty-column">
                <p>No tasks yet</p>
                <button className="empty-add-button" onClick={onAddTask}>
                  Add your first task
                </button>
              </div>
            ) : (
              tasks.map((task, index) => (
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
                  isMobile={isMobile}
                  isTablet={isTablet}
                  isDesktop={isDesktop}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default memo(TaskColumn)
