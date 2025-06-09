export async function GET() {
  try {
   const initialTasks = [
      {
        id: 1,
        title: "CRM system design",
        participant: "Azhar",
        dateAdded: "05/06/2025",
        priority: "medium",
        status: "todo",
      },
      {
        id: 2,
        title: "Statistics Dashboard",
        participant: "Artur",
        dateAdded: "05/06/2025",
        priority: "low",
        status: "todo",
      },
      {
        id: 3,
        title: "Priority Management",
        participant: "Adyl, Artur",
        dateAdded: "05/06/2025",
        priority: "high",
        status: "todo",
      },
      {
        id: 4,
        title: "Push Notifications",
        participant: "Artur",
        dateAdded: "05/06/2025",
        priority: "low",
        status: "in-progress",
      },
      {
        id: 5,
        title: "Task Categories",
        participant: "Adyl",
        dateAdded: "05/06/2025",
        priority: "low",
        status: "in-progress",
      },
      {
        id: 6,
        title: "UI/UX Redesign",
        participant: "Azhar",
        dateAdded: "05/06/2025",
        priority: "low",
        status: "frozen",
      },
    ]

    console.log("GET tasks: Возвращаем список задач")

    return Response.json({
      success: true,
      tasks: initialTasks,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json(
      { success: false, message: "Ошибка сервера при получении задач" }, 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { task, action, timestamp } = body

    // Имитация времени обработки
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Логирование действия для демонстрации
    console.log(`[${timestamp}] Task ${action}:`, task)

    // В реальном приложении вы бы:
    // 1. Проверяли данные
    // 2. Сохраняли в базу данных
    // 3. Возвращали соответствующий ответ

    return Response.json({
      success: true,
      message: `Task ${action} successful`,
      taskId: task.id,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
