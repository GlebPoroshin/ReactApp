"use client"

import { memo, useCallback, useEffect } from "react"
import { Draggable } from "@hello-pangea/dnd"

const TaskCard = ({
  id,
  title,
  priority,
  participant,
  dateAdded,
  status,
  onEdit,
  index,
  isMobile,
  isTablet,
  isDesktop,
}) => {
  const getPriorityClass = useCallback((priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "high"
      case "medium":
        return "medium"
      case "low":
        return "low"
      default:
        return "low"
    }
  }, [])

  const getBorderClass = useCallback((priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "high-border"
      case "medium":
        return "medium-border"
      case "low":
        return "low-border"
      default:
        return "low-border"
    }
  }, [])

  const handleEdit = useCallback(() => {
    console.log("TaskCard: Editing task:", id)
    onEdit({
      id,
      title,
      priority,
      participant,
      dateAdded,
      status,
    })
  }, [id, title, priority, participant, dateAdded, status, onEdit])

  const getCardClassName = () => {
    let baseClass = `task-card ${getBorderClass(priority)}`

    if (isMobile) {
      baseClass += " task-card--mobile"
    } else if (isTablet) {
      baseClass += " task-card--tablet"
    } else {
      baseClass += " task-card--desktop"
    }

    return baseClass
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  useEffect(() => {
    // Включение тач-событий для перетаскивания на мобильных/планшетах
    const enableTouch = () => {
      if ("ontouchstart" in window) {
        // Обнаружено сенсорное устройство - обеспечиваем работу перетаскивания
        return true
      }
      return false
    }

    enableTouch()
  }, [])

  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided, snapshot) => (
        <div
          className={`${getCardClassName()} ${snapshot.isDragging ? "is-dragging" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          role="button"
          tabIndex={0}
          aria-label={`Task: ${title}`}
          style={{
            ...provided.draggableProps.style,
            // Обеспечиваем правильную работу тач-событий
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <div className="task-header">
            <h3 className="task-title">{title}</h3>
            <span className={`priority-label ${getPriorityClass(priority)}`}>{priority}</span>
          </div>

          <div className="task-details">
            <div className="detail-row">
              <span className="detail-label">Assigned to:</span>
              <span className="detail-value">{participant || "Unassigned"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{formatDate(dateAdded)}</span>
            </div>
          </div>

          <button className="edit-task-button" onClick={handleEdit} aria-label={`Edit task: ${title}`} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.293 2.293L17.707 3.707L9 12.414L7.586 11L16.293 2.293ZM18.707 2.293L20.121 3.707C20.5115 4.09747 20.7312 4.63348 20.7312 5.1935C20.7312 5.75352 20.5115 6.28953 20.121 6.68L11.414 15.387L6.886 16.922L8.421 12.394L17.128 3.687C17.5185 3.29747 18.0545 3.0778 18.6145 3.0778C19.1745 3.0778 19.7105 3.29747 20.101 3.687L18.687 2.273L18.707 2.293ZM4 21H20V23H4V21Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}
    </Draggable>
  )
}

export default memo(TaskCard)
