import moment from 'moment'

export const convertDate = (dateString: string) => {
  const cDate = moment(dateString).format('DD MMMM YYYY')

  return cDate
}
