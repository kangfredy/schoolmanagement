import { UserMenu } from '@/screens/UserMenu'
import { ReminderSPP } from '@/screens/ReminderSPP'

export function useDataAdministrasiController() {
  const menu = [
    { label: 'User menu', content: UserMenu },
    { label: 'Pengingat SPP', content: ReminderSPP },
   
  ]
  return { menu }
}
