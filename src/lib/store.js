import { create } from 'zustand'
import { supabase } from './supabase'

export const useGameStore = create((set, get) => ({
  // User state
  currentUser: null,
  currentPeriod: null,
  currentClass: null,
  
  // Game state
  classes: [],
  students: [],
  territories: [],
  inventory: {},
  battles: [],
  
  // UI state
  selectedCountries: [],
  gamePhase: 'login', // login, dashboard, teacher-panel, battle
  
  // Initialize game
  initialize: async (period) => {
    set({ currentPeriod: period, gamePhase: 'dashboard' })
    
    const classes = await supabase.from('classes').select('*')
    const currentClass = classes.data?.find(c => c.period === period)
    set({ currentClass, classes: classes.data || [] })
    
    const students = await supabase.from('students').select('*').eq('period', period)
    set({ students: students.data || [] })
    
    const territories = await supabase.from('territories').select('*')
    set({ territories: territories.data || [] })
    
    if (currentClass) {
      const inventory = await supabase.from('class_inventory').select('*').eq('class_id', currentClass.id)
      set({ inventory: inventory.data || [] })
    }
  },
  
  // Set current user
  setCurrentUser: (user) => set({ currentUser: user }),
  
  // Select countries for the day
  selectCountries: (countries) => set({ selectedCountries: countries }),
  
  // Add unit to inventory
  addUnit: (classId, unitType) => set((state) => {
    const updated = state.inventory.map(inv => 
      inv.class_id === classId && inv.unit_type === unitType
        ? { ...inv, quantity: inv.quantity + 1 }
        : inv
    )
    return { inventory: updated }
  }),
  
  // Use unit from inventory
  useUnit: (classId, unitType) => set((state) => {
    const updated = state.inventory.map(inv => 
      inv.class_id === classId && inv.unit_type === unitType && inv.quantity > 0
        ? { ...inv, quantity: inv.quantity - 1 }
        : inv
    )
    return { inventory: updated }
  }),
  
  // Record battle outcome
  recordBattle: (battle) => set((state) => ({
    battles: [...state.battles, battle]
  })),
  
  // Switch game phase
  setGamePhase: (phase) => set({ gamePhase: phase }),
  
  // Subscribe to real-time updates
  subscribeToUpdates: () => {
    const { currentClass } = get()
    if (!currentClass) return
    
    // Subscribe to territory changes
    supabase
      .from('territories')
      .on('*', payload => {
        const { territories } = get()
        if (payload.eventType === 'UPDATE') {
          set({
            territories: territories.map(t => 
              t.id === payload.new.id ? payload.new : t
            )
          })
        } else if (payload.eventType === 'INSERT') {
          set({ territories: [...territories, payload.new] })
        }
      })
      .subscribe()
    
    // Subscribe to inventory changes
    supabase
      .from('class_inventory')
      .on('UPDATE', payload => {
        const { inventory } = get()
        set({
          inventory: inventory.map(i =>
            i.id === payload.new.id ? payload.new : i
          )
        })
      })
      .subscribe()
  }
}))
