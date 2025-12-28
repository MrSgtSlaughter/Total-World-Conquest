import React, { useState, useEffect } from 'react'
import '../styles/animations.css'

// Animation map - maps animation types to video files
const ANIMATIONS = {
  battle1: '/total-world-conquest/src/assets/animations/battleanimation.mp4',
  battle2: '/total-world-conquest/src/assets/animations/battleanimation2.mp4',
  battle3: '/total-world-conquest/src/assets/animations/battleanimation3.mp4',
  icbm: '/total-world-conquest/src/assets/animations/ICBM.mp4',
  nuke: '/total-world-conquest/src/assets/animations/nuke.mp4',
  civilUnrest: '/total-world-conquest/src/assets/animations/civilunrest.mp4',
  win: '/total-world-conquest/src/assets/animations/win.mp4',
  lose: '/total-world-conquest/src/assets/animations/lose.mp4'
}

export function BattleAnimation({ onComplete, animationType = 'battle' }) {
  const [videoSrc, setVideoSrc] = useState(null)

  useEffect(() => {
    // Select video source based on animation type
    if (animationType === 'battle') {
      // Random battle animation
      const battleAnims = ['battle1', 'battle2', 'battle3']
      const selected = battleAnims[Math.floor(Math.random() * battleAnims.length)]
      setVideoSrc(ANIMATIONS[selected])
    } else if (animationType === 'icbm') {
      setVideoSrc(ANIMATIONS.icbm)
    } else if (animationType === 'nuke') {
      setVideoSrc(ANIMATIONS.nuke)
    } else if (animationType === 'civilUnrest') {
      setVideoSrc(ANIMATIONS.civilUnrest)
    } else if (animationType === 'win') {
      setVideoSrc(ANIMATIONS.win)
    } else if (animationType === 'lose') {
      setVideoSrc(ANIMATIONS.lose)
    }
  }, [animationType])

  const handleVideoEnd = () => {
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <div className="battle-animation-overlay">
      <div className="battle-animation-container">
        {videoSrc && (
          <video
            autoPlay
            muted
            onEnded={handleVideoEnd}
            className="battle-video"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  )
}

// Simple result modal shown after animation
export function BattleResult({ attacker, defender, result, territory, rolls, modifiers, totals, narrative, onClose }) {
  return (
    <div className="retro-modal">
      <div className="retro-modal-content battle-result">
        <h2>⚔️ BATTLE RESULT ⚔️</h2>
        
        <div className="battle-info">
          <div className="combatant">
            <div className="combatant-name">Period {attacker}</div>
            <div className="combatant-role">ATTACKER</div>
          </div>
          
          <div className="vs">VS</div>
          
          <div className="combatant">
            <div className="combatant-name">Period {defender}</div>
            <div className="combatant-role">DEFENDER</div>
          </div>
        </div>

        {/* Roll Details */}
        {rolls && (
          <div className="roll-result">
            <div className="roll-column">
              <div className="roll-label">Attacker Roll</div>
              <div className="roll-number">{rolls.attacker}</div>
              <div style={{ fontSize: '0.9em', marginTop: '5px' }}>+{modifiers.attacker} mod</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px', color: 'var(--color-accent)' }}>
                = {totals.attacker}
              </div>
            </div>
            <div className="vs-indicator">vs</div>
            <div className="roll-column">
              <div className="roll-label">Defender Roll</div>
              <div className="roll-number">{rolls.defender}</div>
              <div style={{ fontSize: '0.9em', marginTop: '5px' }}>+{modifiers.defender} mod</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '5px', color: 'var(--color-accent)' }}>
                = {totals.defender}
              </div>
            </div>
          </div>
        )}

        {/* Battle Narrative */}
        {narrative && (
          <div className="battle-narrative">
            <p style={{ fontSize: '1.1em', fontWeight: 'bold', marginTop: '15px' }}>
              {narrative}
            </p>
          </div>
        )}

        <div className={`result-text ${result === 'attacker_wins' ? 'victory' : 'defeat'}`}>
          {result === 'attacker_wins' ? (
            <>
              <h3>🎉 ATTACKER WINS! 🎉</h3>
              <p>Period {attacker} conquers {territory}!</p>
            </>
          ) : (
            <>
              <h3>🛡️ DEFENDER HOLDS! 🛡️</h3>
              <p>Period {defender} successfully defended {territory}</p>
            </>
          )}
        </div>

        <button className="retro-button" onClick={onClose}>
          CLOSE
        </button>
      </div>
    </div>
  )
}

// Unit effect display (when units are used)
export function UnitEffectAnimation({ unitType, onComplete }) {
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
      if (onComplete) onComplete()
    }, 3000) // Show for 3 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  const getUnitText = () => {
    const texts = {
      infantry: { emoji: '🪖', name: 'INFANTRY', text: '+1 TO ATTACK' },
      tank: { emoji: '🛻', name: 'TANK', text: '+2 TO ATTACK' },
      drone: { emoji: '🚁', name: 'DRONE', text: 'REROLL ON LOSS' },
      icbm: { emoji: '🚀', name: 'ICBM', text: '+5 RANGE ATTACK' },
      nuke: { emoji: '💣', name: 'NUCLEAR STRIKE', text: 'DESTROY TERRITORY' },
      civilUnrest: { emoji: '👥', name: 'CIVIL UNREST', text: '-3 TO ENEMY' },
      battleship: { emoji: '🚢', name: 'BATTLESHIP', text: 'RANGE ATTACK' }
    }
    return texts[unitType] || { emoji: '⚔️', name: 'UNIT', text: 'DEPLOYED' }
  }

  const unit = getUnitText()

  if (!showAnimation) return null

  return (
    <div className="unit-effect-animation">
      <div className="unit-effect-content">
        <div className="unit-emoji">{unit.emoji}</div>
        <div className="unit-name">{unit.name}</div>
        <div className="unit-effect-text">{unit.text}</div>
      </div>
    </div>
  )
}
