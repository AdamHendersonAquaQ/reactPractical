import React, { useState, useEffect } from 'react'
import './MyTable.scss'

export default function MyTable() {
  const headerCols = [
    'ID',
    'First Name',
    'Second Name',
    'GraduationYear',
    'Edit',
    'Delete'
  ]

  const [mainData, setMainData] = useState([])
  const [editingRow, setEditingRow] = useState([])
  const siteCode = 'student/'
  const myUrl = `http://localhost:8080/api/${siteCode}`
    // https://run.mocky.io/v3/713a6c1a-a5da-42d6-ae57-58f513ab838d
  useEffect(() => {
    if (mainData.length === 0) {
      console.log('I am a use effect hook')
      fetch(myUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('data recieved: ', data)
          setMainData(data)
        })
    }
  })
  const removeRow = (rowData) => {
    console.log('Removing row: ', rowData)
    console.log('filter: ', mainData.filter((row) => (row.studentId === rowData)))
    setMainData(mainData.filter((row) => (row.studentId !== rowData)))
  }
  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.studentId === rowData.studentId))
    console.log('value: ', value)
    console.log('field: ', field)
    rowToUpdate[0][field] = value
    console.log(rowToUpdate[0])
  }
  return (
    <div className="tableDiv">
      <table className="tbl">
        <thead className="tbl-header">
          <tr>
            {headerCols.map((col) => (
              <td>
                {col}
              </td>
            ))}
          </tr>
        </thead>
        <tbody className="tbl-content">
          {mainData.map((data) => (
            <tr key={data.studentId}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  contentEditable={data.studentId === editingRow}
                  field={prop}
                  onBlur={(event) => {
                    updateRow(event.target.innerHTML, data, prop)
                  }}
                >
                  {value}
                </td>
              ))}
              <td>
                <button type="button" onClick={() => { setEditingRow(data.studentId) }}>
                  Edit Row
                </button>
              </td>
              <td>
                <button type="button" onClick={() => { removeRow(data.studentId) }}>
                  Delete Row
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
