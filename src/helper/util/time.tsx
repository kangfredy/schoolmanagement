import moment from 'moment'

export const convertDate = (dateString: string) => {
  const cDate = moment(dateString).format('YYYY-MM-DD')

  return cDate
}
