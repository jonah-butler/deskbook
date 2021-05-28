function formatDatesForDatePickers(date) {
  if(date instanceof Date){
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  } else {
    return new Error('invalid date param, use Date class');
  }
}

export default { formatDatesForDatePickers };
