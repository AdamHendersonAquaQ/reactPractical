import React from 'react'
import '../MyTable.scss'

export default function errorDiv(error) {
  return (
    <div>
      {error !== '' && (
        <div className="errorDiv">
          {error}
        </div>
      )}
    </div>
  )
}
