export const convertMoney = (money: number) => {
  const moneyFormatted: string = 'Rp ' + money.toLocaleString('en-US')

  return moneyFormatted
}
