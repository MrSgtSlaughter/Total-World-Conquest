import React, { useState, useEffect } from 'react'
import '../styles/diceroll.css'

export function DiceRollAnimation({ 
  attackerRoll, 
  defenderRoll, 
  attackerName, 
  defenderName,
  onComplete 
}) {
  const [showAttackerDice, setShowAttackerDice] = useState(false)
  const [showDefenderDice, setShowDefenderDice] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [attackerRolling, setAttackerRolling] = useState(true)
  const [defenderRolling, setDefenderRolling] = useState(true)

  useEffect(() => {
    // Stagger the dice rolls
    const timer1 = setTimeout(() => setShowAttackerDice(true), 500)
    const timer2 = setTimeout(() => setDefenderRolling(false), 1500)
    const timer3 = setTimeout(() => setShowDefenderDice(true), 1500)
    const timer4 = setTimeout(() => setAttackerRolling(false), 2000)
    const timer5 = setTimeout(() => setShowResults(true), 2500)
    const timer6 = setTimeout(() => {
      if (onComplete) onComplete()
    }, 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
      clearTimeout(timer6)
    }
  }, [onComplete])

  return (
    <div className="dice-roll-overlay">
      <div className="dice-roll-container">
        <h2 className="dice-title">⚔️ ROLLING FOR BATTLE ⚔️</h2>

        <div className="dice-arena">
          {/* Attacker Dice */}
          {showAttackerDice && (
            <div className="dice-side attacker-side">
              <div className="combatant-label">Period {attackerName}</div>
              <div className="dice-wrapper">
                <div className={`dice d20 ${attackerRolling ? 'rolling' : 'stopped'}`}>
                  {attackerRolling ? (
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      className="dice-video"
                    >
                      <source src="/total-world-conquest/src/assets/animations/dicerolling.mp4" type="video/mp4" />
                    </video>
                  ) : (
                    <div className="dice-sprite" style={{backgroundPosition: getDicePosition(attackerRoll)}}></div>
                  )}
                </div>
              </div>
              <div className="dice-result">
                {showResults && <div className="result-number">{attackerRoll}</div>}
              </div>
            </div>
          )}

          {/* VS Indicator */}
          <div className="dice-vs">
            <div className="vs-text">VS</div>
          </div>

          {/* Defender Dice */}
          {showDefenderDice && (
            <div className="dice-side defender-side">
              <div className="combatant-label">Period {defenderName}</div>
              <div className="dice-wrapper">
                <div className={`dice d20 ${defenderRolling ? 'rolling' : 'stopped'}`}>
                  {defenderRolling ? (
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      className="dice-video"
                    >
                      <source src="/total-world-conquest/src/assets/animations/dicerolling.mp4" type="video/mp4" />
                    </video>
                  ) : (
                    <div className="dice-sprite" style={{backgroundPosition: getDicePosition(defenderRoll)}}></div>
                  )}
                </div>
              </div>
              <div className="dice-result">
                {showResults && <div className="result-number">{defenderRoll}</div>}
              </div>
            </div>
          )}
        </div>

        {showResults && (
          <div className="dice-ready">
            <p>⚡ Get ready for battle... ⚡</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Get background position for dice sprite sheet
 * Sprite sheet is 5 columns × 4 rows (1-20)
 * Each dice face is 100px × 100px
 */
function getDicePosition(number) {
  if (number < 1 || number > 20) return '0px 0px'
  
  // Convert 1-20 to grid position
  const col = ((number - 1) % 5)
  const row = Math.floor((number - 1) / 5)
  
  const x = -(col * 100)
  const y = -(row * 100)
  
  return `${x}px ${y}px`
}

// Standalone dice sprite component
export function DiceSprite({ number = 1 }) {
  return (
    <div className="dice-sprite" style={{backgroundPosition: getDicePosition(number)}}></div>
  )
}

// Animated d20 dice component (can be used standalone)
export function AnimatedDice({ value = 1, isRolling = true }) {
  return (
    <div className={`dice d20 ${isRolling ? 'rolling' : 'stopped'}`}>
      {isRolling ? (
        <video 
          autoPlay 
          loop 
          muted 
          className="dice-video"
        >
          <source src="/total-world-conquest/src/assets/animations/dicerolling.mp4" type="video/mp4" />
        </video>
      ) : (
        <DiceSprite number={value} />
      )}
    </div>
  )
}
