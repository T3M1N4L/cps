"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SettingsSidebar } from "./settings-sidebar"
import { Scoreboard } from "./scoreboard"
import { ResultsDialog } from "./results-dialog"
import { Score } from "@/types/score"
import { saveScore, getScores, getBestScore } from "@/lib/scores"
import { saveTestMode, getTestMode, saveTimeLimit, getTimeLimit, saveCustomTime, getCustomTime } from "@/lib/storage"
import { Navbar } from "./navbar"

export default function CPSTest() {
  const [mode, setMode] = useState<"click" | "spacebar">(getTestMode())
  const [timeLimit, setTimeLimit] = useState(getTimeLimit())
  const [customTime, setCustomTime] = useState(getCustomTime())
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [lastScore, setLastScore] = useState<Omit<Score, "id" | "timestamp"> | null>(null)
  const [clickPositions, setClickPositions] = useState<{ x: number; y: number; id: number }[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scoreboardOpen, setScoreboardOpen] = useState(false)
  const [scores, setScores] = useState<Score[]>([])
  const [bestScores, setBestScores] = useState({
    click: getBestScore("click"),
    spacebar: getBestScore("spacebar"),
  })
  const [isReady, setIsReady] = useState(false)

  const clickAreaRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()
  
  const calculateTimeLimit = () => {
    if (timeLimit === "custom" && customTime) {
      return parseInt(customTime)
    }
    return parseInt(timeLimit)
  }
  const remainingTime = Math.max(0, calculateTimeLimit() - elapsedTime / 1000)
  const currentCPS = clicks / Math.max(elapsedTime / 1000, 0.001)

  const getRankInfo = (cps: number) => {
    if (cps < 5) return { 
      emoji: "🐢", 
      name: "Turtle", 
      stars: 1, 
      quote: "Slow and steady wins the race... but you might want to pick up the pace!"
    }
    if (cps < 7) return { 
      emoji: "🐭", 
      name: "Mouse", 
      stars: 2, 
      quote: "You're quick, but there's room for improvement. Keep practicing!"
    }
    if (cps < 8) return { 
      emoji: "🐰", 
      name: "Rabbit", 
      stars: 3, 
      quote: "Hopping along nicely! You're getting faster with each click!"
    }
    if (cps < 9) return { 
      emoji: "🐯", 
      name: "Tiger", 
      stars: 4, 
      quote: "You're fast, but not quite the best. Time to go full throttle!"
    }
    return { 
      emoji: "🐆", 
      name: "Cheetah", 
      stars: 5, 
      quote: "Lightning fast! You're the speed demon of clicking!"
    }
  }

  const resetTest = useCallback(() => {
    setIsRunning(false)
    setIsReady(false)
    setStartTime(null)
    setElapsedTime(0)
    setClicks(0)
    setClickPositions([])
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const animate = useCallback((timestamp: number) => {
    if (!startTime) {
      setStartTime(timestamp)
    }
    
    const elapsed = timestamp - (startTime || timestamp)
    setElapsedTime(elapsed)
    
    if (elapsed < calculateTimeLimit() * 1000) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      const finalCPS = clicks / (elapsed / 1000)
      const rank = getRankInfo(finalCPS)
      const score = {
        mode,
        cps: finalCPS,
        clicks,
        timeLimit: calculateTimeLimit(),
        rank,
      }
      setLastScore(score)
      const savedScore = saveScore(score)
      setScores(prev => [savedScore, ...prev])
      setBestScores(prev => ({
        ...prev,
        [mode]: !prev[mode] || finalCPS > prev[mode]!.cps ? savedScore : prev[mode],
      }))
      setIsRunning(false)
      setShowResults(true)
    }
  }, [startTime, clicks, mode, calculateTimeLimit])

  useEffect(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isRunning, animate])

  useEffect(() => {
    setScores(getScores())
  }, [])

  useEffect(() => {
    saveTestMode(mode)
  }, [mode])

  useEffect(() => {
    saveTimeLimit(timeLimit)
  }, [timeLimit])

  useEffect(() => {
    saveCustomTime(customTime)
  }, [customTime])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === "spacebar") {
        if (e.code === "Space") {
          e.preventDefault();
          if (e.repeat) return;

          if (isReady && !isRunning) {
            setIsReady(false);
            resetTest();
            setIsRunning(true);
            setClicks(1); // Increment the click count to 1 when starting
            return;
          }

          if (isRunning) {
            setClicks(prev => prev + 1);
            if (clickAreaRef.current) {
              const rect = clickAreaRef.current.getBoundingClientRect();
              setClickPositions(prev => [
                ...prev,
                {
                  x: rect.width / 2,
                  y: rect.height / 2,
                  id: Date.now(),
                },
              ]);
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, isRunning, isReady, resetTest]);

  const handleClick = (e: React.MouseEvent) => {
    if (mode === "click" && isRunning) {
      setClicks(prev => prev + 1)
      const rect = e.currentTarget.getBoundingClientRect()
      setClickPositions(prev => [...prev, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: Date.now(),
      }])
    }
  }

  const handleStart = () => {
    if (mode === "spacebar") {
      setIsReady(true)
      return
    }
    resetTest()
    setIsRunning(true)
    setStartTime(null) 
    setElapsedTime(0) 
    setClicks(1) // Increment the click count to 1 when starting
  }

  return (
    <div className="min-h-screen">
      <Navbar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenScoreboard={() => setScoreboardOpen(true)}
      />
      <div className="container mx-auto px-2 py-2">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="px-6 py-4 text-center">
                <div className="text-4xl font-bold text-white">
                  {remainingTime.toFixed(3)}
                </div>
                <div className="text-white/80">Timer</div>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500">
              <div className="px-6 py-4 text-center">
                <div className="text-4xl font-bold text-white">
                  {currentCPS.toFixed(2)}
                </div>
                <div className="text-white/80">Click/s</div>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500">
              <div className="px-6 py-4 text-center">
                <div className="text-4xl font-bold text-white">{clicks}</div>
                <div className="text-white/80">Score</div>
              </div>
            </div>
          </div>

          <div 
            ref={clickAreaRef}
            className="relative h-[400px] rounded-lg border border-border bg-card cursor-pointer flex items-center justify-center overflow-hidden"
            onClick={isRunning ? handleClick : handleStart}
          >
            <AnimatePresence>
              {clickPositions.map((pos) => (
                <motion.div
                  key={pos.id}
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute w-16 h-16 rounded-full bg-primary/10"
                  style={{
                    left: pos.x - 32,
                    top: pos.y - 32,
                  }}
                />
              ))}
            </AnimatePresence>
            <div className="select-none text-xl font-medium text-muted-foreground">
              {isRunning ? (
                mode === "click" ? "Click anywhere!" : "Press spacebar!"
              ) : isReady ? (
                <div className="text-center space-y-2">
                  <div className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-md">
                    Press <span className="px-2 py-1 bg-background/80 rounded-md">SPACEBAR</span> button
                  </div>
                </div>
              ) : (
                mode === "click" ? "Click to start" : "Click to ready up"
              )}
            </div>
          </div>
        </div>
      </div>

      <SettingsSidebar
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        timeLimit={timeLimit}
        customTime={customTime}
        onTimeLimitChange={(newTimeLimit) => {
          setTimeLimit(newTimeLimit)
          saveTimeLimit(newTimeLimit)
          resetTest() 
        }}
        onCustomTimeChange={(newCustomTime) => {
          setCustomTime(newCustomTime)
          saveCustomTime(newCustomTime)
          if (newCustomTime) {
            setTimeLimit("custom")
            saveTimeLimit("custom")
          }
          resetTest() 
        }}
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode)
          saveTestMode(newMode)
          resetTest() 
        }}
      />

      <Scoreboard
        open={scoreboardOpen}
        onOpenChange={setScoreboardOpen}
        scores={scores}
        bestScores={bestScores}
      />

      <ResultsDialog
        isOpen={showResults}
        onClose={() => {
          setShowResults(false)
          resetTest()
        }}
        score={lastScore}
      />
    </div>
  )
}

