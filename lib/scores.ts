import { Score } from "@/types/score"

const STORAGE_KEY = "cps-test-scores"

export function saveScore(score: Omit<Score, "id" | "timestamp">) {
  const scores = getScores()
  const newScore: Score = {
    ...score,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newScore, ...scores]))
  return newScore
}

export function getScores(): Score[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function getBestScore(mode: "click" | "spacebar"): Score | null {
  const scores = getScores()
  return scores
    .filter(score => score.mode === mode)
    .sort((a, b) => b.cps - a.cps)[0] || null
}

export function sortScores(scores: Score[], sortBy: "recent" | "highest" | "lowest"): Score[] {
  return [...scores].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return b.timestamp - a.timestamp
      case "highest":
        return b.cps - a.cps
      case "lowest":
        return a.cps - b.cps
      default:
        return 0
    }
  })
}

