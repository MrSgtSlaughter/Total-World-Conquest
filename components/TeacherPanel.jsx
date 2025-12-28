import React, { useState, useEffect } from 'react'
import { useGameStore } from '../lib/store'
import { supabase } from '../lib/supabase'
import { UNIT_INFO } from '../data/countries'
import { BattleAnimation, BattleResult, UnitEffectAnimation } from './BattleAnimation'
import { DiceRollAnimation } from './DiceRoll'
import { executeBattle, getBattleNarrative } from '../lib/diceroller'
import '../styles/retro.css'
import '../styles/animations.css'
import '../styles/diceroll.css'

export function TeacherPanel() {
  const { classes, territories, inventory } = useGameStore()
  const [selectedClass, setSelectedClass] = useState(null)
  const [stampsToAward, setStampsToAward] = useState({})
  const [battleQueue, setBattleQueue] = useState([])
  const [pollResults, setPollResults] = useState({})
  const [showBattleExecutor, setShowBattleExecutor] = useState(false)
  const [showDiceRoll, setShowDiceRoll] = useState(false)
  const [showBattleAnimation, setShowBattleAnimation] = useState(false)
  const [showOutcomeAnimation, setShowOutcomeAnimation] = useState(false)
  const [animationType, setAnimationType] = useState('battle')
  const [battleResult, setBattleResult] = useState(null)
  const [unitEffect, setUnitEffect] = useState(null)
  const [battleState, setBattleState] = useState({
    attacker: null,
    defender: null,
    territory: null,
    attackerModifiers: 0,
    defenderModifiers: 0,
    attackerRoll: 0,
    defenderRoll: 0
  })

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0])
    }
  }, [classes, selectedClass])

  useEffect(() => {
    // Fetch daily poll results
    const fetchPolls = async () => {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('daily_polls')
        .select('*')
        .eq('date', today)

      const results = {}
      classes.forEach(c => {
        const classPolls = data?.filter(p => p.class_id === c.id) || []
        const represented = classPolls.filter(p => p.feels_represented).length
        const likes = classPolls.filter(p => p.likes_leader).length
        results[c.id] = {
          totalRespondents: classPolls.length,
          feelRepresented: represented,
          likeLeader: likes
        }
      })
      setPollResults(results)
    }

    if (classes.length > 0) {
      fetchPolls()
    }
  }, [classes])

  const handleAwardStamps = async (studentId, amount) => {
    if (selectedClass) {
      await supabase
        .from('stamp_transactions')
        .insert([
          {
            student_id: studentId,
            class_id: selectedClass.id,
            amount,
            reason: 'Territory conquest/defense',
            timestamp: new Date().toISOString()
          }
        ])
      setStampsToAward(prev => ({
        ...prev,
        [studentId]: 0
      }))
    }
  }

  const handleUseUnit = async (classId, unitType) => {
    await supabase
      .from('class_inventory')
      .update({ quantity: -1 })
      .eq('class_id', classId)
      .eq('unit_type', unitType)
  }
    // Use AI dice roller with modifiers
    const battleOutcome = executeBattle(
      battleState.attackerModifiers,
      battleState.defenderModifiers
    )

    // Store full result
    setBattleState(prev => ({
      ...prev,
      attackerRoll: battleOutcome.attackerRoll,
      defenderRoll: battleOutcome.defenderRoll,
      battleOutcome: battleOutcome.outcome
    }))

    // Start the sequence
    setShowDiceRoll(true)
  }

  const handleDiceRollComplete = () => {
    // Dice roll animation done, start battle animation
    setShowDiceRoll(false)
    setTimeout(() => {
      setAnimationType('battle')
      setShowBattleAnimation(true)
    }, 300)
  }

  const handleBattleAnimationComplete = () => {
    // Battle animation done, show win/lose animation based on actual rolls
    setShowBattleAnimation(false)
    
    const battleOutcome = executeBattle(
      battleState.attackerModifiers,
      battleState.defenderModifiers
    )

    // Show outcome animation based on actual result
    const outcomeType = battleOutcome.outcome === 'attacker_wins' ? 'win' : 'lose'
    setAnimationType(outcomeType)
    setShowOutcomeAnimation(true)
  }

  const handleOutcomeAnimationComplete = () => {
    // Outcome animation done, show results
    setShowOutcomeAnimation(false)
    
    const battleOutcome = executeBattle(
      battleState.attackerModifiers,
      battleState.defenderModifiers
    )

    const attackerTotal = battleState.attackerRoll + battleState.attackerModifiers
    const defenderTotal = battleState.defenderRoll + battleState.defenderModifiers

    setBattleResult({
      attacker: battleState.attacker,
      defender: battleState.defender,
      territory: battleState.territory,
      result: battleOutcome.outcome,
      rolls: { attacker: battleState.attackerRoll, defender: battleState.defenderRoll },
      modifiers: { attacker: battleState.attackerModifiers, defender: battleState.defenderModifiers },
      totals: { attacker: attackerTotal, defender: defenderTotal },
      narrative: getBattleNarrative(battleOutcome)
    })
  }

  const handleUseSpecialUnit = (unitType) => {
    // Show special unit animation
    setAnimationType(unitType === 'civil_unrest' ? 'civilUnrest' : unitType)
    setUnitEffect(unitType)
    
    // Auto-clear after animation
    setTimeout(() => {
      setUnitEffect(null)
    }, 3000)
  }

  const handleBattleAnimationComplete = () => {
    setShowAnimation(false)
  }

  const handleBattleResultClose = () => {
    setBattleResult(null)
    setShowBattleExecutor(false)
  }

  return (
    <div className="retro-container teacher-panel">
      <div className="retro-header">
        <h1>👨‍🏫 TEACHER CONTROL PANEL 👨‍🏫</h1>
      </div>

      <div className="teacher-grid">
        {/* Class Selection */}
        <div className="retro-panel">
          <h2>SELECT CLASS</h2>
          <div className="class-buttons">
            {classes.map(c => (
              <button
                key={c.id}
                className={`class-btn ${selectedClass?.id === c.id ? 'active' : ''}`}
                onClick={() => setSelectedClass(c)}
              >
                Period {c.period}
              </button>
            ))}
          </div>
        </div>

        {/* Stamp Ledger */}
        {selectedClass && (
          <>
            <div className="retro-panel">
              <h2>📋 STAMP LEDGER - Period {selectedClass.period}</h2>
              <div className="ledger-info">
                <p>Quick Stamp Awards:</p>
                <div className="stamp-buttons">
                  <button className="stamp-btn" onClick={() => {
                    // Open modal to select student
                  }}>
                    Award +1 Stamp
                  </button>
                  <button className="stamp-btn" onClick={() => {
                    // Open modal to select student
                  }}>
                    Award +5 Stamps
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Manager */}
            <div className="retro-panel">
              <h2>🎖️ INVENTORY MANAGER</h2>
              <div className="inventory-manager">
                {inventory
                  .filter(inv => inv.class_id === selectedClass.id)
                  .map(inv => (
                    <div key={inv.id} className="inventory-control">
                      <span className="unit-label">
                        {UNIT_INFO[inv.unit_type]?.name}
                      </span>
                      <div className="control-group">
                        <span className="quantity">×{inv.quantity}</span>
                        <button
                          className="use-btn"
                          onClick={() => handleUseUnit(selectedClass.id, inv.unit_type)}
                          disabled={inv.quantity === 0}
                        >
                          USE
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Poll Results */}
            <div className="retro-panel">
              <h2>📊 TODAY'S POLL RESULTS</h2>
              <div className="poll-results">
                {pollResults[selectedClass.id] ? (
                  <>
                    <p>Respondents: {pollResults[selectedClass.id].totalRespondents}</p>
                    <p>
                      Feel Represented: {pollResults[selectedClass.id].feelRepresented}/{pollResults[selectedClass.id].totalRespondents}
                    </p>
                    <p>
                      Like Leader: {pollResults[selectedClass.id].likeLeader}/{pollResults[selectedClass.id].totalRespondents}
                    </p>
                  </>
                ) : (
                  <p>No poll data yet</p>
                )}
              </div>
            </div>

            {/* Battle Executor */}
            <div className="retro-panel">
              <h2>⚔️ BATTLE EXECUTOR</h2>
              <div className="battle-controls">
                <p>Execute a battle:</p>
                <button
                  className="retro-button battle-roll"
                  onClick={() => setShowBattleExecutor(true)}
                >
                  ⚔️ START BATTLE
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Battle Executor Modal */}
      {showBattleExecutor && (
        <BattleExecutorModal
          classes={classes}
          battleState={battleState}
          setBattleState={setBattleState}
          onExecute={handleExecuteBattle}
          onClose={() => setShowBattleExecutor(false)}
        />
      )}

      {/* Dice Roll Animation */}
      {showDiceRoll && (
        <DiceRollAnimation
          attackerRoll={battleState.attackerRoll}
          defenderRoll={battleState.defenderRoll}
          attackerName={battleState.attacker}
          defenderName={battleState.defender}
          onComplete={handleDiceRollComplete}
        />
      )}

      {/* Battle Animation */}
      {showBattleAnimation && (
        <BattleAnimation
          animationType={animationType}
          onComplete={handleBattleAnimationComplete}
        />
      )}

      {/* Outcome Animation (Win/Lose) */}
      {showOutcomeAnimation && (
        <BattleAnimation
          animationType={animationType}
          onComplete={handleOutcomeAnimationComplete}
        />
      )}

      {/* Battle Result */}
      {battleResult && (
        <BattleResult
          attacker={battleResult.attacker}
          defender={battleResult.defender}
          result={battleResult.result}
          territory={battleResult.territory}
          rolls={battleResult.rolls}
          modifiers={battleResult.modifiers}
          totals={battleResult.totals}
          onClose={handleBattleResultClose}
        />
      )}

      {/* Unit Effect Animation */}
      {unitEffect && (
        <UnitEffectAnimation unitType={unitEffect} />
      )}
    </div>
  )
}

function BattleExecutorModal({ classes, battleState, setBattleState, onExecute, onClose }) {
  const [step, setStep] = useState(1) // Step 1: Select combatants, Step 2: Set modifiers

  const handleAttackerSelect = (classId) => {
    setBattleState(prev => ({ ...prev, attacker: classId }))
  }

  const handleDefenderSelect = (classId) => {
    setBattleState(prev => ({ ...prev, defender: classId }))
  }

  const handleTerritorySelect = (territory) => {
    setBattleState(prev => ({ ...prev, territory }))
  }

  const handleModifierChange = (type, value) => {
    setBattleState(prev => ({
      ...prev,
      [type]: Math.min(Math.max(value, 0), 10) // Enforce +10 cap
    }))
  }

  const isStep1Complete = battleState.attacker && battleState.defender && battleState.territory
  const isStep2Complete = isStep1Complete

  return (
    <div className="retro-modal">
      <div className="retro-modal-content" style={{ maxWidth: '600px' }}>
        <h2>⚔️ BATTLE EXECUTOR ⚔️</h2>

        {step === 1 ? (
          <>
            <div className="battle-sequence">
              <div className="battle-sequence-step">
                <h3>SELECT ATTACKER</h3>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {classes.map(c => (
                    <button
                      key={c.id}
                      className={`class-btn ${battleState.attacker === c.id ? 'active' : ''}`}
                      onClick={() => handleAttackerSelect(c.id)}
                    >
                      Period {c.period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="battle-sequence-step">
                <h3>SELECT DEFENDER</h3>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {classes
                    .filter(c => c.id !== battleState.attacker)
                    .map(c => (
                      <button
                        key={c.id}
                        className={`class-btn ${battleState.defender === c.id ? 'active' : ''}`}
                        onClick={() => handleDefenderSelect(c.id)}
                      >
                        Period {c.period}
                      </button>
                    ))}
                </div>
              </div>

              <div className="battle-sequence-step">
                <h3>SELECT TERRITORY</h3>
                <input
                  type="text"
                  placeholder="Territory name (e.g., France)"
                  value={battleState.territory || ''}
                  onChange={(e) => handleTerritorySelect(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '10px',
                    fontSize: '1em',
                    fontFamily: 'Courier New',
                    backgroundColor: '#0a0e27',
                    color: '#00ff00',
                    border: '2px solid #00ff00'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="retro-button"
                onClick={() => setStep(2)}
                disabled={!isStep1Complete}
              >
                NEXT →
              </button>
              <button className="retro-button secondary" onClick={onClose}>
                CANCEL
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="battle-sequence">
              <div className="battle-sequence-step">
                <h3>PERIOD {battleState.attacker} MODIFIERS</h3>
                <div style={{ margin: '10px 0' }}>
                  <label>Bonus to attack roll (0-10): </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={battleState.attackerModifiers}
                      onChange={(e) => handleModifierChange('attackerModifiers', parseInt(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <div className="roll-number">{battleState.attackerModifiers}</div>
                  </div>
                </div>
              </div>

              <div className="battle-sequence-step">
                <h3>PERIOD {battleState.defender} MODIFIERS</h3>
                <div style={{ margin: '10px 0' }}>
                  <label>Bonus to defense roll (0-10): </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={battleState.defenderModifiers}
                      onChange={(e) => handleModifierChange('defenderModifiers', parseInt(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <div className="roll-number">{battleState.defenderModifiers}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="retro-button secondary" onClick={() => setStep(1)}>
                ← BACK
              </button>
              <button
                className="retro-button battle-roll"
                onClick={onExecute}
              >
                🎲 ROLL DICE
              </button>
              <button className="retro-button secondary" onClick={onClose}>
                CANCEL
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
