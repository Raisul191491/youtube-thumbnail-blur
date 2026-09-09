import { onMounted, ref } from 'vue'
import { readStats, summarize } from '../../utils/stats'
import type { SurfaceKey } from '../../utils/storage'

export function useStats() {
  const today = ref(0)
  const week = ref(0)
  const busiest = ref<SurfaceKey | null>(null)

  onMounted(async () => {
    const summary = summarize(await readStats())
    today.value = summary.today
    week.value = summary.week
    busiest.value = summary.busiest
  })

  return { today, week, busiest }
}
