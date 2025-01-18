export interface Score {
  id: string
  mode: "click" | "spacebar"
  cps: number
  clicks: number
  timeLimit: number
  timestamp: number
  rank: {
    name: string
    emoji: string
    stars: number
  }
}

export type SortOption = "recent" | "highest" | "lowest"

