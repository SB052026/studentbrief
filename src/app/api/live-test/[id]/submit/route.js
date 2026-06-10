import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { answers, timeTaken, sessionData } = await request.json()

    const { data: questions } = await supabase
      .from('live_questions')
      .select('*')
      .eq('live_test_id', id)

    let score = 0
    questions.forEach((question) => {
      if (answers[question.id] === question.correct_option) {
        score++
      }
    })

    const { data: existingEntry } = await supabase
      .from('leaderboard')
      .select('id')
      .eq('test_id', id)
      .eq('user_id', user.id)
      .single()

    if (!existingEntry) {
      await supabase.from('leaderboard').insert({
        test_id: id,
        user_id: user.id,
        score,
        time_taken: timeTaken,
      })
    }

    if (sessionData) {
      await supabase.from('live_sessions').upsert({
        user_id: user.id,
        test_id: id,
        face_detected: sessionData.faceDetected,
        multiple_faces: sessionData.multipleFaces,
        tab_switches: sessionData.tabSwitches,
        fullscreen_exits: sessionData.fullscreenExits,
        location_start: sessionData.locationStart,
        location_change: sessionData.locationChange,
        suspicious_logs: sessionData.suspiciousLogs,
        status: sessionData.tabSwitches >= 3 ? 'flagged' : 'clean',
      })
    }

    return NextResponse.json({ success: true, score })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Submit nahi hua' }, { status: 500 })
  }
}
