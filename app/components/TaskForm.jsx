 "use client"

import { useState, useEffect, useCallback } from "react"

const TaskForm = ({ onAddTask, currentStatus, editingTask = null }) => {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("low")
  const [participants, setParticipants] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    console.log("TaskForm: Received editing task:", editingTask)

    if (editingTask) {
      setTitle(editingTask.title || "")
      setPriority(editingTask.priority || "low")
      setParticipants(editingTask.participant || "")
      setTaskId(editingTask.id)
      setIsEditMode(true)
      console.log("TaskForm: Set edit mode, task id:", editingTask.id)
    } else {
      // Сброс формы для новой задачи
      setTitle("")
      setPriority("low")
      setParticipants("")
      setIsEditMode(false)
      setTaskId(null)
    }

    // Очистка ошибок при переключении режимов
    setErrors({})
  }, [editingTask])

  const formatStatusName = useCallback((statusId) => {
    return statusId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }, [])

  const getStatusName = useCallback(() => {
    if (!currentStatus) return ""
    return formatStatusName(currentStatus)
  }, [currentStatus, formatStatusName])

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = "Task title is required"
    } else if (title.trim().length < 3) {
      newErrors.title = "Task title must be at least 3 characters"
    } else if (title.trim().length > 100) {
      newErrors.title = "Task title must be less than 100 characters"
    }

    if (participants.trim().length > 200) {
      newErrors.participants = "Participants field must be less than 200 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [title, participants])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()

      if (!validateForm()) {
        return
      }

      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })

      const taskData = {
        id: taskId || undefined,
        title: title.trim(),
        priority,
        participant: participants.trim() || "Unassigned",
        dateAdded: editingTask?.dateAdded || currentDate,
        status: editingTask?.status || currentStatus,
      }

      console.log("TaskForm: Submitting task data:", taskData)
      onAddTask(taskData)

      // Сброс формы
      setTitle("")
      setPriority("low")
      setParticipants("")
      setErrors({})
    },
    [validateForm, taskId, title, priority, participants, editingTask, currentStatus, onAddTask],
  )

  const handleTitleChange = useCallback(
    (e) => {
      setTitle(e.target.value)
      if (errors.title) {
        setErrors((prev) => ({ ...prev, title: "" }))
      }
    },
    [errors.title],
  )

  const handleParticipantsChange = useCallback(
    (e) => {
      setParticipants(e.target.value)
      if (errors.participants) {
        setErrors((prev) => ({ ...prev, participants: "" }))
      }
    },
    [errors.participants],
  )

  return (
    <div className="task-form-container">
      <h2 className="form-title">{isEditMode ? "Edit Task" : `New Task in "${getStatusName()}"`}</h2>

      <form onSubmit={handleSubmit} className="task-form" noValidate>
        <div className="form-group">
          <label htmlFor="title">
            Task Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter task title"
            required
            maxLength={100}
            className={errors.title ? "error" : ""}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <span id="title-error" className="error-message" role="alert">
              {errors.title}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="participants">Assigned To</label>
          <input
            type="text"
            id="participants"
            value={participants}
            onChange={handleParticipantsChange}
            placeholder="Enter participant names (comma separated)"
            maxLength={200}
            className={errors.participants ? "error" : ""}
            aria-describedby={errors.participants ? "participants-error" : undefined}
          />
          {errors.participants && (
            <span id="participants-error" className="error-message" role="alert">
              {errors.participants}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          {isEditMode ? "Save Changes" : "Add Task"}
        </button>
      </form>
    </div>
  )
}

export default TaskForm
