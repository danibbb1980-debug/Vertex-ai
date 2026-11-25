import { createContext, useContext } from 'react'

export const QuizContexto = createContext<(gatilho: HTMLElement | null) => void>(() => {})
export const useAbrirQuiz = () => useContext(QuizContexto)
