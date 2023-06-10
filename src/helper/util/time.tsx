import moment from 'moment'

export const convertDate = (dateString: string | null) => {
  if (dateString === null) {
    return '-'
  } else {
    const cDate = moment(dateString).format('DD MMMM YYYY')

    return cDate
  }
}
