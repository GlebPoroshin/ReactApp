"use client"

import { useState, useCallback, useEffect } from "react"
import TaskBoard from "./components/TaskBoard"
import "./globals.css"

export default function App() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/tasks")
        
        if (!response.ok) {
          throw new Error(`Ошибка загрузки задач: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.tasks) {
          setTasks(data.tasks)
        } else {
          console.warn("Не удалось получить задачи с сервера")
          setTasks([])
        }
      } catch (error) {
        console.error("Ошибка при загрузке задач:", error)
        setError("Не удалось загрузить задачи с сервера")
        
        setTasks([])
        
        setTimeout(() => setError(null), 3000)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTasks()
  }, [])
  
  const sendToBackend = useCallback(async (taskData, action) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: taskData,
          action: action,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Backend response:", result)
    } catch (error) {
      console.error("Error sending to backend:", error)
      setError("Failed to sync with server. Changes saved locally.")

      // Показать ошибку на 3 секунды, затем скрыть
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleAddOrUpdateTask = useCallback(
    async (taskData) => {
      console.log("Processing task data:", taskData)

      try {
        const taskId = taskData.id || Date.now()
        const existingTaskIndex = tasks.findIndex((task) => task.id === taskId)

        let updatedTask
        let action

        if (existingTaskIndex !== -1) {
          // Обновить существующую задачу
          const existingTask = tasks[existingTaskIndex]
          updatedTask = {
            ...taskData,
            id: taskId,
            status: taskData.status || existingTask.status,
          }

          action = existingTask.status !== updatedTask.status ? "move" : "update"

          setTasks((prevTasks) => {
            const newTasks = [...prevTasks]
            newTasks[existingTaskIndex] = updatedTask
            return newTasks
          })
        } else {
          // Создаем задачу
          updatedTask = {
            ...taskData,
            id: taskId,
          }

          action = "create"

          setTasks((prevTasks) => [...prevTasks, updatedTask])
        }

        // Отправляем на бэкенд
        await sendToBackend(updatedTask, action)
      } catch (error) {
        console.error("Error processing task:", error)
        setError("Failed to process task. Please try again.")
      }
    },
    [tasks, sendToBackend],
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">{error}</div>
      )}

      {isLoading && (
        <div className="fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Syncing with server...
        </div>
      )}

      <TaskBoard tasks={tasks} onAddTask={handleAddOrUpdateTask} isLoading={isLoading} />
    </div>
  )
}
