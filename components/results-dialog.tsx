"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star } from 'lucide-react'
import { Score } from "@/types/score"

interface ResultsDialogProps {
  isOpen: boolean
  onClose: () => void
  score: Omit<Score, "id" | "timestamp"> | null
}

export function ResultsDialog({ isOpen, onClose, score }: ResultsDialogProps) {
  if (!score) return null

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[800px]">
        <div className="flex gap-8 p-6">
          <div className="flex items-center justify-center w-1/3 border-r border-border">
            <div className="text-9xl">{score.rank.emoji}</div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">Your Rank is</div>
              <div className="text-5xl font-bold">{score.rank.name}!</div>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-8 w-8 ${
                    i < score.rank.stars
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-none text-muted-foreground/25"
                  }`}
                />
              ))}
            </div>

            <div className="space-y-1 text-lg">
              <div>
                You Clicked with the speed of{" "}
                <span className="text-2xl font-bold">{score.cps.toFixed(1)}</span>{" "}
                CPS
              </div>
              <div className="text-muted-foreground">
                {score.clicks} Clicks in {score.timeLimit} Seconds
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="text-center italic text-muted-foreground">
                "{score.rank.quote}"
              </div>

              <Button onClick={onClose} className="w-full" size="lg">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

