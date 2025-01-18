"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Score, SortOption } from "@/types/score"
import { sortScores } from "@/lib/scores"

interface ScoreboardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scores: Score[]
  bestScores: {
    click: Score | null
    spacebar: Score | null
  }
}

export function Scoreboard({ open, onOpenChange, scores, bestScores }: ScoreboardProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [activeTab, setActiveTab] = useState<"all" | "click" | "spacebar">("all")

  const filteredScores = scores.filter((score) => {
    if (activeTab === "all") return true
    return score.mode === activeTab
  })

  const sortedScores = sortScores(filteredScores, sortBy)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="space-y-4">
          <SheetTitle>Your Scores</SheetTitle>
          <SheetDescription>
            View your test history and best scores
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 h-[calc(100vh-8rem)] overflow-y-auto pr-4">
          <div className="space-y-4">
            <h3 className="font-medium">Best Scores</h3>
            <div className="grid grid-cols-2 gap-4">
              {["click", "spacebar"].map((mode) => {
                const best = bestScores[mode as keyof typeof bestScores]
                return (
                  <div key={mode} className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground capitalize">{mode}</div>
                    {best ? (
                      <>
                        <div className="mt-1 text-2xl font-bold">{best.cps.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">
                          {best.clicks} clicks in {best.timeLimit}s
                        </div>
                      </>
                    ) : (
                      <div className="mt-1 text-sm text-muted-foreground">No attempts yet</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">History</h3>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="highest">Highest CPS</SelectItem>
                  <SelectItem value="lowest">Lowest CPS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={(value: typeof activeTab) => setActiveTab(value)}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="click" className="flex-1">Click</TabsTrigger>
                <TabsTrigger value="spacebar" className="flex-1">Spacebar</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              {sortedScores.map((score) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl pb-2">{score.rank.emoji}</span>
                      <span className="font-medium">{score.cps.toFixed(1)} CPS</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {score.clicks} clicks in {score.timeLimit}s
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(score.timestamp, "MMM d, yyyy HH:mm")}
                    </div>
                  </div>
                  <div className="text-sm capitalize text-muted-foreground">
                    {score.mode}
                  </div>
                </div>
              ))}
              {sortedScores.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No scores yet
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

