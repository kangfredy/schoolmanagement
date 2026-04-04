import { UserMenu } from '@/screens/UserMenu'
import { ReminderSPP } from '@/screens/ReminderSPP'
import { ReminderSeragam } from '@/screens/ReminderSeragam'

export function useDataAdministrasiController() {
  const menu = [
    { label: 'User menu', content: UserMenu },
    { label: 'Pengingat SPP', content: ReminderSPP },
    { label: 'Pengingat Seragam', content: ReminderSeragam },
  ]
  return { menu }
}
