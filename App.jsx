import React, { useState, useEffect } from 'react'
import { useGameStore } from './lib/store'
import { StudentDashboard } from './components/StudentDashboard'
import { TeacherPanel } from './components/TeacherPanel'
import { supabase } from './lib/supabase'
import './styles/retro.css'

function App() {
  const [userType, setUserType] = useState(null) // 'student', 'teacher', or null
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  
  const { initialize, currentPeriod } = useGameStore()

  const handleStudentMode = async (period) => {
    setUserType('student')
    setSelectedPeriod(period)
    await initialize(period)
  }

  const handleTeacherMode = async () => {
    setUserType('teacher')
    await initialize(null)
  }

  if (!userType) {
    return (
      <div className="retro-container login">
        <div className="retro-header">
          <h1>⚔️ TOTAL WORLD CONQUEST ⚔️</h1>
          <p>Multiplayer Strategy Game for 7th Grade Social Studies</p>
        </div>

        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div className="retro-panel" style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h2>SELECT YOUR ROLE</h2>
            
            <div style={{ margin: '20px 0' }}>
              <h3>👨‍🎓 STUDENT</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  className="retro-button"
                  style={{ fontSize: '1.2em' }}
                  onClick={() => handleStudentMode(1)}
                >
                  Period 1<br/>🔴 RED
                </button>
                <button
                  className="retro-button"
                  style={{ fontSize: '1.2em' }}
                  onClick={() => handleStudentMode(2)}
                >
                  Period 2<br/>🟢 GREEN
                </button>
                <button
                  className="retro-button"
                  style={{ fontSize: '1.2em' }}
                  onClick={() => handleStudentMode(5)}
                >
                  Period 5<br/>🟡 YELLOW
                </button>
                <button
                  className="retro-button"
                  style={{ fontSize: '1.2em' }}
                  onClick={() => handleStudentMode(6)}
                >
                  Period 6<br/>🔵 BLUE
                </button>
              </div>
            </div>

            <hr style={{ borderColor: 'var(--color-border)', margin: '20px 0' }} />

            <div style={{ margin: '20px 0' }}>
              <h3>👨‍🏫 TEACHER</h3>
              <button
                className="retro-button"
                style={{
                  fontSize: '1.2em',
                  width: '100%',
                  padding: '15px'
                }}
                onClick={handleTeacherMode}
              >
                CONTROL PANEL
              </button>
            </div>
          </div>

          <div className="retro-panel" style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h3>📖 HOW TO PLAY</h3>
            <p style={{ textAlign: 'left', fontSize: '0.95em', lineHeight: '1.6' }}>
              🌍 <strong>Pick 3 countries</strong> each day that you want to invest in<br/>
              💰 <strong>Earn stamps</strong> when your countries are conquered or defended<br/>
              🎖️ <strong>Collect stamps</strong> to unlock powerful military units<br/>
              ⚔️ <strong>Attack or defend</strong> territories with your class leader's strategy<br/>
              📊 <strong>Vote daily</strong> on your class leadership<br/>
              🏆 <strong>Win the game</strong> when your class controls the most countries by January 31
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (userType === 'student' && selectedPeriod) {
    return <StudentDashboard />
  }

  if (userType === 'teacher') {
    return <TeacherPanel />
  }

  return <div>Loading...</div>
}

export default App
