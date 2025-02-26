import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function HowToPlayModal() {
  return (
    <Dialog>
      <DialogTrigger className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300 underline underline-offset-2">
        How to Play?
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            How to Play Cross Club
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Cross Club is a football trivia game where each round challenges you to identify the common player who has played for both of two given teams.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Game Rules:</h3>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li>You'll be shown two different football clubs</li>
              <li>Your task is to find a player who has played for both teams</li>
              <li>Type the player's name and submit your answer</li>
              <li>Score points for each correct answer</li>
              <li>Try to achieve the highest score possible!</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HowToPlayModal