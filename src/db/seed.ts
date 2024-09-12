import dayjs from 'dayjs'
import { client, db } from '.'
import { goalCompletions, goals } from './schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const goalsResult = await db
    .insert(goals)
    .values([
      {
        title: 'Acordar cedo',
        desiredWeeklyFrequency: 5,
      },
      {
        title: 'Me exercitar',
        desiredWeeklyFrequency: 3,
      },
      {
        title: 'Programar',
        desiredWeeklyFrequency: 7,
      },
    ])
    .returning()

  const startofWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    {
      goalId: goalsResult[0].id,
      createdAt: startofWeek.toDate(),
    },
    {
      goalId: goalsResult[1].id,
      createdAt: startofWeek.add(1, 'day').toDate(),
    },
  ])
}

seed().finally(() => {
  client.end()
})
