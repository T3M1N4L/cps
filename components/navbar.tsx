"use client"

import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onOpenSettings: () => void
  onOpenScoreboard: () => void
}

export function Navbar({ onOpenSettings, onOpenScoreboard }: NavbarProps) {
  return (
    <div className="sticky top-0 z-50">
      <div className="w-full px-4">
        <div className="flex items-center justify-end h-16"> {/* Changed to justify-end */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onOpenScoreboard}
            >
              Scoreboard
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenSettings}
            >
              <Menu className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
