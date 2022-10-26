import React from 'react'

export default function header(headerCols) {
  return (
    <thead className="table-header">
      <tr key="headers">
        {headerCols.map((col) => (
          <td key={col}>
            {col}
          </td>
        ))}
      </tr>
    </thead>
  )
}
