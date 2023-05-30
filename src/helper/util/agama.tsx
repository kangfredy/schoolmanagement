export const checkAgama = (agamaId: number) => {
  switch (agamaId) {
    case 1:
      return 'Islam'
    case 2:
      return 'Kristen'
    case 3:
      return 'Katolik'
    case 4:
      return 'Hindu'
    case 5:
      return 'Budha'
    case 6:
      return 'Konghucu'
    default:
      return 'islam'
  }
}
