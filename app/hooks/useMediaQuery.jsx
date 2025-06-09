 "use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Установка начального значения
    setMatches(media.matches)

    // Создание функции-слушателя
    const listener = (event) => {
      setMatches(event.matches)
    }

    // Добавление слушателя
    if (media.addEventListener) {
      media.addEventListener("change", listener)
    } else {
      // Запасной вариант для старых браузеров
      media.addListener(listener)
    }

    // Очистка
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener)
      } else {
        // Запасной вариант для старых браузеров
        media.removeListener(listener)
      }
    }
  }, [query])

  return matches
}
