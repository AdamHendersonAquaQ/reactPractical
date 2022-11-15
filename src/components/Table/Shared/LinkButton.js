import React from 'react'
import { Link } from 'react-router-dom'
import '../MyTable.scss'

export default function LinkButton(prop, value, label) {
  if (prop === `${label}Id`) {
    return (
      <Link to={`/${label}/${value}`} style={{ textDecoration: 'none' }}>
        <button type="button" className="tableButton">{value}</button>
      </Link>
    )
  }
  return (null)
}
