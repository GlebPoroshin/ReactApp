"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { DragDropContext } from "@hello-pangea/dnd"
import TaskColumn from "./TaskColumn"
import TaskForm from "./TaskForm"
import { useMediaQuery } from "../hooks/useMediaQuery"

const TaskBoard = ({ tasks, onAddTask, isLoading = false }) => {
  const [showForm, setShowForm] = useState(false)
  const [currentStatus, setCurrentStatus] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [isDraggingTask, setIsDraggingTask] = useState(false)
  const boardRef = useRef(null)

  // Адаптивные контрольные точки
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
  const isDesktop = useMediaQuery("(min-width: 1025px)")

  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "closed", title: "Completed" },
    { id: "frozen", title: "On Hold" },
  ])

  const [showColumnForm, setShowColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")

  // Мемоизированные задачи колонки для предотвращения ненужных перерисовок
  const getColumnTasks = useCallback(
    (columnId) => {
        const filteredTasks = tasks.filter((task) => task.status === columnId)
        return filteredTasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    },
    [tasks],
  )

  // Логика адаптивного отображения колонок
  const getVisibleColumns = useMemo(() => {
    // Все макеты показывают все колонки, но организованы по-разному
    return columns
  }, [columns])

  // Улучшенная горизонтальная прокрутка для десктопа/планшета
  useEffect(() => {
    const slider = boardRef.current
    if (!slider || !isDesktop) return

    let isDown = false
    let startX
    let scrollLeft

    const handleMouseDown = (e) => {
      if (isDraggingTask || e.target !== slider) return

      isDown = true
      slider.classList.add("scrolling")
      startX = e.pageX - slider.offsetLeft
      scrollLeft = slider.scrollLeft
      slider.style.cursor = "grabbing"
    }

    const handleMouseLeave = () => {
      isDown = false
      slider.classList.remove("scrolling")
      slider.style.cursor = "grab"
    }

    const handleMouseUp = () => {
      isDown = false
      slider.classList.remove("scrolling")
      slider.style.cursor = "grab"
    }

    const handleMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - slider.offsetLeft
      const walk = (x - startX) * 2
      slider.scrollLeft = scrollLeft - walk
    }

    slider.addEventListener("mousedown", handleMouseDown)
    slider.addEventListener("mouseleave", handleMouseLeave)
    slider.addEventListener("mouseup", handleMouseUp)
    slider.addEventListener("mousemove", handleMouseMove)

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown)
      slider.removeEventListener("mouseleave", handleMouseLeave)
      slider.removeEventListener("mouseup", handleMouseUp)
      slider.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isDraggingTask, isDesktop])

  // Добавление обработчиков тач-событий для поддержки перетаскивания на мобильных/планшетах
  useEffect(() => {
    const handleTouchStart = (e) => {
      // Предотвращение стандартного поведения касания во время операций перетаскивания
      if (isDraggingTask) {
        e.preventDefault()
      }
    }

    const handleTouchMove = (e) => {
      if (isDraggingTask) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isDraggingTask])

  const handleAddTaskFromForm = useCallback(
    (taskData) => {
      console.log("TaskBoard: Processing form data:", taskData)

      let updatedTask

      if (editingTask) {
        updatedTask = {
          ...taskData,
          id: editingTask.id,
          status: editingTask.status,
        }
      } else {
        updatedTask = {
          ...taskData,
          status: currentStatus,
        }
      }

      onAddTask(updatedTask)
      setShowForm(false)
      setEditingTask(null)
    },
    [editingTask, currentStatus, onAddTask],
  )

  const handleEditTask = useCallback((task) => {
    console.log("TaskBoard: Editing task:", task)
    setEditingTask(task)
    setShowForm(true)
  }, [])

  const handleAddTaskToColumn = useCallback((columnId) => {
    setCurrentStatus(columnId)
    setEditingTask(null)
    setShowForm(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setShowForm(false)
    setEditingTask(null)
  }, [])

  const handleAddColumn = useCallback(() => {
    setShowColumnForm(true)
  }, [])

  const handleCloseColumnForm = useCallback(() => {
    setShowColumnForm(false)
    setNewColumnTitle("")
  }, [])

  const handleCreateColumn = useCallback(() => {
    if (newColumnTitle.trim() === "") return

    const newColumnId = newColumnTitle.toLowerCase().replace(/\s+/g, "-")

    if (columns.some((col) => col.id === newColumnId)) {
      alert("Column with this name already exists!")
      return
    }

    setColumns((prev) => [...prev, { id: newColumnId, title: newColumnTitle.trim() }])
    setShowColumnForm(false)
    setNewColumnTitle("")
  }, [newColumnTitle, columns])

  const handleDragStart = useCallback(() => {
    setIsDraggingTask(true)
  }, [])

  const handleDragEnd = useCallback(
    (result) => {
      setIsDraggingTask(false)

      const { source, destination, draggableId } = result

      // Проверка, было ли перетаскивание за пределы или в ту же позицию
      if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
        return
      }

      const taskId = Number.parseInt(draggableId, 10)
      const task = tasks.find((t) => t.id === taskId)

      if (!task) {
        console.error("Task not found:", taskId)
        return
      }

      // Проверка на дублирование заголовков в целевой колонке
      const tasksInDestination = tasks.filter((t) => t.status === destination.droppableId)
      const hasDuplicate = tasksInDestination.some(
        (t) => t.id !== taskId && t.title.toLowerCase() === task.title.toLowerCase(),
      )

      if (hasDuplicate) {
        const destinationColumn = columns.find((c) => c.id === destination.droppableId)
        alert(`Task "${task.title}" already exists in "${destinationColumn?.title}" column`)
        return
      }

      // Обновление статуса задачи
      const updatedTask = {
        ...task,
        status: destination.droppableId,
      }

      console.log("Moving task:", task.title, "to:", destination.droppableId)
      onAddTask(updatedTask)
    },
    [tasks, columns, onAddTask],
  )

  // Получение адаптивных имен классов
  const getBoardClassName = () => {
    let baseClass = "task-board"

    if (isMobile) {
      baseClass += " task-board--mobile"
    } else if (isTablet) {
      baseClass += " task-board--tablet"
    } else {
      baseClass += " task-board--desktop"
    }

    return baseClass
  }

  const getColumnsClassName = () => {
    let baseClass = "board-columns"

    if (isMobile) {
      baseClass += " board-columns--mobile"
    } else if (isTablet) {
      baseClass += " board-columns--tablet"
    } else {
      baseClass += " board-columns--desktop"
    }

    return baseClass
  }

  return (
    <div className={getBoardClassName()}>
      {/* Task Form Modal */}
      {showForm && (
        <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseForm()}>
          <div className="form-container">
            <button className="close-form-button" onClick={handleCloseForm} aria-label="Close form">
              ×
            </button>
            <TaskForm onAddTask={handleAddTaskFromForm} currentStatus={currentStatus} editingTask={editingTask} />
          </div>
        </div>
      )}

      {/* Column Form Modal */}
      {showColumnForm && (
        <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseColumnForm()}>
          <div className="form-container column-form">
            <button className="close-form-button" onClick={handleCloseColumnForm} aria-label="Close column form">
              ×
            </button>
            <div className="column-form-content">
              <h2 className="form-title">Add New Column</h2>
              <div className="form-group">
                <label htmlFor="columnTitle">Column Name:</label>
                <input
                  type="text"
                  id="columnTitle"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Enter column name"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateColumn()}
                />
              </div>
              <button onClick={handleCreateColumn} className="submit-button" disabled={!newColumnTitle.trim()}>
                Create Column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Board */}
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div ref={boardRef} className={`board-columns-wrapper ${isDesktop ? "scrollable" : ""}`}>
          <div className={getColumnsClassName()}>
            {getVisibleColumns.map((column) => (
              <TaskColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={getColumnTasks(column.id)}
                onAddTask={() => handleAddTaskToColumn(column.id)}
                onEditTask={handleEditTask}
                isMobile={isMobile}
                isTablet={isTablet}
                isDesktop={isDesktop}
              />
            ))}

            {/* Add Column Button - Only show on desktop */}
            {isDesktop && (
              <button
                className="add-column-button"
                onClick={handleAddColumn}
                aria-label="Add new column"
                disabled={isLoading}
              >
                +
              </button>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Mobile Add Column Button */}
      {isMobile && (
        <div className="mobile-add-column">
          <button className="mobile-add-column-button" onClick={handleAddColumn} disabled={isLoading}>
            + Add Column
          </button>
        </div>
      )}
    </div>
  )
}

export default React.memo(TaskBoard)
