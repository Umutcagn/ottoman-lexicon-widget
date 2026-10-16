import { LocalNotifications } from '@capacitor/local-notifications'
import { words } from './words'
import { currentSlot, getDailyWordIndex } from './app-store'

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const status = await LocalNotifications.checkPermissions()
    if (status.display === 'granted') {
      return true
    }
    const res = await LocalNotifications.requestPermissions()
    return res.display === 'granted'
  } catch (e) {
    console.warn('Notification permission check failed:', e)
    return false
  }
}

/**
 * 📅 Schedule 24-Hour Recurring Daily Word Notification
 */
export async function scheduleDailyNotification(): Promise<void> {
  try {
    const granted = await requestNotificationPermission()
    if (!granted) return

    // Clear existing daily notifications first
    const pending = await LocalNotifications.getPending()
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending)
    }

    // Get today's word slot
    const slot = currentSlot(24)
    const idx = getDailyWordIndex(slot, words.length)
    const word = words[idx]

    // Set notification for 9:00 AM tomorrow or 24h cycle
    const now = new Date()
    const scheduledTime = new Date()
    scheduledTime.setDate(now.getDate() + 1)
    scheduledTime.setHours(9, 0, 0, 0) // 09:00 AM every day

    await LocalNotifications.schedule({
      notifications: [
        {
          title: `📖 Günün Osmanlıca Kelimesi: ${word.tr} (${word.ottoman})`,
          body: `Anlamı: ${word.meaning}`,
          id: 1001,
          schedule: {
            at: scheduledTime,
            every: 'day',
            allowWhileIdle: true,
          },
          sound: undefined,
          actionTypeId: '',
          extra: {
            wordId: word.id,
          },
        },
      ],
    })
  } catch (e) {
    console.warn('Daily notification schedule failed:', e)
  }
}

/**
 * 🔔 Send an Instant Test Notification immediately (1-tap test)
 */
export async function sendInstantTestNotification(): Promise<boolean> {
  try {
    const granted = await requestNotificationPermission()
    if (!granted) return false

    const slot = currentSlot(24)
    const idx = getDailyWordIndex(slot, words.length)
    const word = words[idx]


    await LocalNotifications.schedule({
      notifications: [
        {
          title: `📖 Günün Osmanlıca Kelimesi: ${word.tr} (${word.ottoman})`,
          body: `Anlamı: ${word.meaning}`,
          id: Math.floor(Math.random() * 10000) + 2000,
          schedule: { at: new Date(Date.now() + 1000) }, // 1 sec delay
        },
      ],
    })
    return true
  } catch (e) {
    console.warn('Instant notification failed:', e)
    return false
  }
}
