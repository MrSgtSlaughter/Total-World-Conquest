/**
 * AI Dice Roller Service
 * Generates random d20 rolls and determines battle outcomes
 */

/**
 * Roll a d20 (1-20)
 * @returns {number} Random number 1-20
 */
export function rollD20() {
  return Math.floor(Math.random() * 20) + 1
}

/**
 * Roll multiple d20s
 * @param {number} count - Number of dice to roll
 * @returns {number[]} Array of rolls
 */
export function rollMultipleD20(count = 2) {
  return Array.from({ length: count }, () => rollD20())
}

/**
 * Execute a complete battle
 * @param {number} attackerModifiers - Bonus to attacker roll (0-10)
 * @param {number} defenderModifiers - Bonus to defender roll (0-10)
 * @returns {Object} Battle result with rolls and outcome
 */
export function executeBattle(attackerModifiers = 0, defenderModifiers = 0) {
  // Roll for both sides
  const attackerRoll = rollD20()
  const defenderRoll = rollD20()

  // Calculate totals
  const attackerTotal = attackerRoll + attackerModifiers
  const defenderTotal = defenderRoll + defenderModifiers

  // Determine outcome (ties go to defense)
  const outcome = attackerTotal > defenderTotal ? 'attacker_wins' : 'defender_wins'

  return {
    attackerRoll,
    defenderRoll,
    attackerModifiers,
    defenderModifiers,
    attackerTotal,
    defenderTotal,
    outcome,
    winner: outcome === 'attacker_wins' ? 'attacker' : 'defender'
  }
}

/**
 * Calculate battle odds (for fun statistics)
 * Shows probability of different outcomes
 * @param {number} attackerModifiers - Attacker bonus
 * @param {number} defenderModifiers - Defender bonus
 * @returns {Object} Probability percentages
 */
export function calculateBattleOdds(attackerModifiers = 0, defenderModifiers = 0) {
  let attackerWins = 0
  const simulations = 10000

  for (let i = 0; i < simulations; i++) {
    const aRoll = Math.floor(Math.random() * 20) + 1
    const dRoll = Math.floor(Math.random() * 20) + 1
    const aTotal = aRoll + attackerModifiers
    const dTotal = dRoll + defenderModifiers
    if (aTotal > dTotal) attackerWins++
  }

  return {
    attackerWinChance: Math.round((attackerWins / simulations) * 100),
    defenderWinChance: Math.round(((simulations - attackerWins) / simulations) * 100)
  }
}

/**
 * Get battle description based on rolls
 * @param {Object} battleResult - Result from executeBattle()
 * @returns {string} Narrative description
 */
export function getBattleNarrative(battleResult) {
  const { attackerRoll, defenderRoll, attackerTotal, defenderTotal, outcome } = battleResult

  const narratives = {
    attacker_dominant: [
      "OVERWHELMING ATTACK! The attacker dominates completely!",
      "CRUSHING VICTORY! An unstoppable force!",
      "TOTAL DOMINATION! The defender is overwhelmed!"
    ],
    attacker_narrow: [
      "Close battle! The attacker barely wins!",
      "Hard-fought victory! Just barely succeeds!",
      "Victory by a whisker! Dramatic win!"
    ],
    defender_dominant: [
      "IMPENETRABLE DEFENSE! The territory holds strong!",
      "FORTRESS! The defender cannot be broken!",
      "UNBREAKABLE! The defense stands firm!"
    ],
    defender_narrow: [
      "Narrow defense! The attack is just repelled!",
      "Just barely holds! The territory is safe!",
      "Close call! The defense succeeds!"
    ]
  }

  let category = ''
  if (outcome === 'attacker_wins') {
    const diff = attackerTotal - defenderTotal
    category = diff >= 10 ? 'attacker_dominant' : 'attacker_narrow'
  } else {
    const diff = defenderTotal - attackerTotal
    category = diff >= 10 ? 'defender_dominant' : 'defender_narrow'
  }

  const options = narratives[category]
  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Validate battle parameters
 * @param {number} attackerMod - Attacker modifier
 * @param {number} defenderMod - Defender modifier
 * @returns {Object} Validation result with errors
 */
export function validateBattleParams(attackerMod, defenderMod) {
  const errors = []

  if (attackerMod < 0 || attackerMod > 10) {
    errors.push('Attacker modifier must be 0-10')
  }
  if (defenderMod < 0 || defenderMod > 10) {
    errors.push('Defender modifier must be 0-10')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
