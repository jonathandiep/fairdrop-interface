import React, { HTMLAttributes } from 'react'
import ReactDatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  isClearable?: boolean
  onChange: (date: Date) => any
  selectedDate: Date | undefined
  showPopperArrow?: boolean
}

const DatePicker = ({ selectedDate, onChange, isClearable = false, showPopperArrow = false, ...props }: Props) => {
  return (
    <ReactDatePicker
      placeholderText="MM/DD/YYYY"
      selected={selectedDate}
      onChange={onChange}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
      {...props}
    />
  )
}

export default DatePicker
