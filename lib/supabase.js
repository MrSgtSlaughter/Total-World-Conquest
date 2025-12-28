import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gebbynwmysweeofozlse.supabase.co'
const SUPABASE_KEY = 'sb_publishable_SHCqKgpaumrKDAxjFVzwMA_P8UfskPt'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Helper functions
export const getClasses = async () => {
  const { data, error } = await supabase.from('classes').select('*')
  if (error) console.error('Error fetching classes:', error)
  return data || []
}

export const getStudents = async (period) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('period', period)
  if (error) console.error('Error fetching students:', error)
  return data || []
}

export const getTerritories = async () => {
  const { data, error } = await supabase.from('territories').select('*')
  if (error) console.error('Error fetching territories:', error)
  return data || []
}

export const getClassInventory = async (classId) => {
  const { data, error } = await supabase
    .from('class_inventory')
    .select('*')
    .eq('class_id', classId)
  if (error) console.error('Error fetching inventory:', error)
  return data || []
}

export const addStamp = async (studentId, classId, amount, reason) => {
  const { data, error } = await supabase
    .from('stamp_transactions')
    .insert([
      {
        student_id: studentId,
        class_id: classId,
        amount,
        reason,
        timestamp: new Date().toISOString()
      }
    ])
  if (error) console.error('Error adding stamp:', error)
  return data
}

export const updateStudentCountries = async (studentId, countries) => {
  const { data, error } = await supabase
    .from('students')
    .update({ selected_countries: countries })
    .eq('id', studentId)
  if (error) console.error('Error updating countries:', error)
  return data
}

export const recordBattle = async (attackerClassId, defenderClassId, territoryId, rolls, modifiers, outcome, unitsUsed) => {
  const { data, error } = await supabase
    .from('battles')
    .insert([
      {
        attacker_class_id: attackerClassId,
        defender_class_id: defenderClassId,
        territory_id: territoryId,
        attacker_roll: rolls.attacker,
        attacker_modifiers: modifiers.attacker,
        defender_roll: rolls.defender,
        defender_modifiers: modifiers.defender,
        outcome,
        units_used: unitsUsed,
        timestamp: new Date().toISOString()
      }
    ])
  if (error) console.error('Error recording battle:', error)
  return data
}

export const submitDailyPoll = async (classId, studentId, feelsRepresented, likesLeader) => {
  const { data, error } = await supabase
    .from('daily_polls')
    .upsert(
      {
        class_id: classId,
        student_id: studentId,
        date: new Date().toISOString().split('T')[0],
        feels_represented: feelsRepresented,
        likes_leader: likesLeader
      },
      { onConflict: 'class_id,student_id,date' }
    )
  if (error) console.error('Error submitting poll:', error)
  return data
}
