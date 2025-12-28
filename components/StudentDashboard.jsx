import React, { useState, useEffect } from 'react'
import { useGameStore } from '../lib/store'
import { supabase } from '../lib/supabase'
import { COUNTRIES, CLASS_COLORS, UNIT_INFO } from '../data/countries'
import '../styles/retro.css'

export function StudentDashboard() {
  const {
    currentUser,
    currentClass,
    currentPeriod,
    selectedCountries,
    selectCountries,
    territories,
    inventory
  } = useGameStore()

  const [countries, setCountries] = useState([])
  const [myCountries, setMyCountries] = useState(selectedCountries)
  const [earnedStamps, setEarnedStamps] = useState(0)
  const [showDailyPoll, setShowDailyPoll] = useState(false)

  useEffect(() => {
    // Fetch student stamps
    const fetchStamps = async () => {
      const { data } = await supabase
        .from('stamp_transactions')
        .select('amount')
        .eq('student_id', currentUser?.id)
      const total = data?.reduce((sum, t) => sum + t.amount, 0) || 0
      setEarnedStamps(total)
    }
    if (currentUser?.id) fetchStamps()
  }, [currentUser?.id])

  const handleCountrySelect = (countryName) => {
    setMyCountries(prev => {
      if (prev.includes(countryName)) {
        return prev.filter(c => c !== countryName)
      } else if (prev.length < 3) {
        return [...prev, countryName]
      }
      return prev
    })
  }

  const handleSaveCountries = async () => {
    await supabase
      .from('students')
      .update({ selected_countries: myCountries })
      .eq('id', currentUser?.id)
    selectCountries(myCountries)
  }

  const getTerritoryColor = (countryName) => {
    const territory = territories.find(t => t.country_name === countryName)
    if (!territory || !territory.owner_class_id) return '#333333'
    return CLASS_COLORS[territory.owner_class_id] || '#333333'
  }

  const getClassInventory = () => {
    return inventory.filter(inv => inv.class_id === currentClass?.id)
  }

  return (
    <div className="retro-container">
      <div className="retro-header">
        <h1>⚔️ TOTAL WORLD CONQUEST ⚔️</h1>
        <p>Period {currentPeriod} • {currentClass?.color.toUpperCase()} EMPIRE</p>
      </div>

      <div className="dashboard-grid">
        {/* Left Panel - Country Selector */}
        <div className="retro-panel">
          <h2>📍 SELECT YOUR 3 COUNTRIES</h2>
          <div className="country-selector">
            {COUNTRIES.map(country => (
              <div key={country.name} className="country-option">
                <input
                  type="checkbox"
                  id={country.name}
                  checked={myCountries.includes(country.name)}
                  onChange={() => handleCountrySelect(country.name)}
                  disabled={myCountries.length === 3 && !myCountries.includes(country.name)}
                />
                <label htmlFor={country.name}>
                  {country.name}
                  <span className={`region-badge ${country.region.replace(/\s/g, '')}`}>
                    {country.region}
                  </span>
                </label>
              </div>
            ))}
          </div>
          <button
            className="retro-button"
            onClick={handleSaveCountries}
            disabled={myCountries.length !== 3}
          >
            ✓ LOCK IN ({myCountries.length}/3)
          </button>
        </div>

        {/* Right Panel - Stats & Inventory */}
        <div className="retro-panel">
          <h2>📊 YOUR STATS</h2>
          <div className="stats-box">
            <div className="stat-line">
              Stamps Earned: <span className="stat-value">{earnedStamps}</span>
            </div>
            <div className="stat-line">
              Selected Countries: <span className="stat-value">{myCountries.length}/3</span>
            </div>
          </div>

          <h2>🎖️ CLASS INVENTORY</h2>
          <div className="inventory-grid">
            {getClassInventory().map(inv => (
              <div key={inv.id} className={`inventory-item ${inv.unit_type}`}>
                <div className="unit-name">{UNIT_INFO[inv.unit_type]?.name}</div>
                <div className="unit-quantity">×{inv.quantity}</div>
              </div>
            ))}
          </div>

          <h2>🗺️ YOUR COUNTRIES STATUS</h2>
          <div className="countries-status">
            {myCountries.map(country => {
              const territory = territories.find(t => t.country_name === country)
              const owner = territory?.owner_class_id
              return (
                <div key={country} className="country-status">
                  <span>{country}</span>
                  <span className={`status-indicator ${owner ? 'occupied' : 'neutral'}`}>
                    {owner ? `Period ${owner}` : 'Unclaimed'}
                  </span>
                </div>
              )
            })}
          </div>

          <button
            className="retro-button poll-button"
            onClick={() => setShowDailyPoll(true)}
          >
            📋 DAILY POLL
          </button>
        </div>
      </div>

      {showDailyPoll && <DailyPoll onClose={() => setShowDailyPoll(false)} />}
    </div>
  )
}

function DailyPoll({ onClose }) {
  const [feelsRepresented, setFeelsRepresented] = useState(null)
  const [likesLeader, setLikesLeader] = useState(null)
  const { currentUser, currentClass } = useGameStore()

  const handleSubmit = async () => {
    await supabase
      .from('daily_polls')
      .upsert(
        {
          class_id: currentClass?.id,
          student_id: currentUser?.id,
          date: new Date().toISOString().split('T')[0],
          feels_represented: feelsRepresented,
          likes_leader: likesLeader
        },
        { onConflict: 'class_id,student_id,date' }
      )
    onClose()
  }

  return (
    <div className="retro-modal">
      <div className="retro-modal-content">
        <h2>📋 DAILY POLL</h2>
        <div className="poll-question">
          <p>Do you feel represented by your leader?</p>
          <div className="poll-options">
            <button
              className={`poll-btn yes ${feelsRepresented === true ? 'selected' : ''}`}
              onClick={() => setFeelsRepresented(true)}
            >
              👍 YES
            </button>
            <button
              className={`poll-btn no ${feelsRepresented === false ? 'selected' : ''}`}
              onClick={() => setFeelsRepresented(false)}
            >
              👎 NO
            </button>
          </div>
        </div>
        <div className="poll-question">
          <p>Do you like your leader?</p>
          <div className="poll-options">
            <button
              className={`poll-btn yes ${likesLeader === true ? 'selected' : ''}`}
              onClick={() => setLikesLeader(true)}
            >
              ❤️ YES
            </button>
            <button
              className={`poll-btn no ${likesLeader === false ? 'selected' : ''}`}
              onClick={() => setLikesLeader(false)}
            >
              💔 NO
            </button>
          </div>
        </div>
        <button
          className="retro-button"
          onClick={handleSubmit}
          disabled={feelsRepresented === null || likesLeader === null}
        >
          SUBMIT
        </button>
        <button className="retro-button secondary" onClick={onClose}>
          CANCEL
        </button>
      </div>
    </div>
  )
}
