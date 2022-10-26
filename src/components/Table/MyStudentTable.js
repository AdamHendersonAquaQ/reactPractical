/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import './MyTable.scss'

export default function MyTable() {
  const headerCols = [
    'ID',
    'First Name',
    'Second Name',
    'Graduation Year',
    'Edit',
    'Delete'
  ]
  const [mainData, setMainData] = useState([])
  const [editingRow, setEditingRow] = useState([])
  const siteCode = 'student/'
  const [filterCode, setFilterCode] = useState('')
  const myUrl = `http://localhost:8080/api/${siteCode}${filterCode}`
  const [myFilter, setMyFilter] = useState('id')
  const [entry1, setEntry1] = useState('')
  const [entry2, setEntry2] = useState('')
  const [runEffect, setRunEffect] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [dataError, setDataError] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [showInput, setShowInput] = useState(true)

  const filterChange = (event) => {
    setFilterCode('')
    setRunEffect(true)
    setEntry1('')
    setEntry2('')
    setMyFilter(event.target.value)
    setSearchError('')
  }
  const textChange = (event) => {
    setEntry1(event.target.value)
  }
  const textChange2 = (event) => {
    setEntry2(event.target.value)
  }

  const firstNameChange = (event) => {
    setFirstName(event.target.value)
  }
  const lastNameChange = (event) => {
    setLastName(event.target.value)
  }
  const graduationYearChange = (event) => {
    setGraduationYear(event.target.value)
  }

  useEffect(() => {
    if (mainData.length === 0 || runEffect) {
      setRunEffect(false)
      console.log('I am a use effect hook')
      if (filterCode !== '') setShowInput(false)
      fetch(myUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('data recieved: ', data)
          if (Object.hasOwn(data, 'status')) {
            setMainData('error')
            setDataError(data.message)
          } else {
            setMainData(data)
            setDataError('')
          }
        })
    }
  }, [mainData.length, runEffect, myUrl, filterCode])
  const removeRow = (rowData) => {
    console.log('Removing row: ', rowData)
    console.log('filter: ', mainData.filter((row) => (row.studentId === rowData)))
    fetch(`${myUrl}id/${rowData}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => {
      console.log('response received: ', response)
      if (response.ok) setMainData(mainData.filter((row) => (row.studentId !== rowData)))
      else console.log('Row not removed')
    })
  }

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.studentId === rowData.studentId))
    console.log('value: ', value)
    console.log('field: ', field)
    const ogVal = rowToUpdate[0][field]
    rowToUpdate[0][field] = value
    console.log(rowToUpdate[0])
    fetch(`${myUrl}update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(rowToUpdate[0])
    }).then((response) => {
      if (!response.ok) rowToUpdate[0][field] = `${ogVal} `
      console.log(response)
      setEditingRow([])
    })
  }
  const resetTable = () => {
    setEntry1('')
    setEntry2('')
    setFilterCode('')
    setRunEffect(true)
    setShowInput(true)
  }
  const handleSubmit = () => {
    setSearchError('')
    if (entry1 !== '') {
      if (myFilter === 'id' && Number.isNaN(parseInt(entry1, 10))) setSearchError('Error: Id field must be an integer.  ')
      else {
        if (myFilter !== 'studentName') {
          setFilterCode(`${myFilter}/${entry1}`)
        } else {
          setFilterCode(`${myFilter}/?firstName=${entry1}&lastName=${entry2}`)
        }
        setRunEffect(true)
      }
    } else resetTable()
  }
  const register = () => {
    if (firstName !== '' && Number.isNaN(parseInt(graduationYear, 10))) {
      const jsonData = {
        "firstName": firstName,
        "lastName": lastName,
        "graduationYear": graduationYear
      }
      fetch(myUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      }).then((response) => response.json())
        .then((data) => {
          console.log('data received: ', data)
          setRunEffect(true)
          setFirstName('')
          setLastName('')
          setGraduationYear('')
        })
    }
  }
  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmit()
    }
  }
  const header = (
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

  const filter = (
    <div className="filterDiv" style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="selectDiv">
        Sort by:
        <select value={myFilter} onChange={filterChange}>
          <option value="id">Id</option>
          <option value="studentName">Name</option>
          <option value="semester">Semester Code</option>
        </select>
      </div>
      <div className="inputDiv" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="input1">
          {`Enter ${myFilter}:`}
          <input type="text" name="entry1" value={entry1} onChange={textChange} onKeyPress={handleKeypress} />
        </div>
        {myFilter === 'studentName' && (
          <div className="input2">
            Enter second name:
            <input type="text" name="entry2" value={entry2} onChange={textChange2} onKeyPress={handleKeypress} />
          </div>
        )}
      </div>
      <button className="inputButton" type="button" onClick={handleSubmit}>Search</button>
      {searchError !== '' && (
        <div className="inputSearchDiv">
          {searchError}
        </div>
      )}
    </div>
  )

  const inputRow = (
    <tr key="input">
      <td key="id" />
      <td><input key="firstName" className="rowInput" type="text" value={firstName} onChange={firstNameChange} /></td>
      <td><input key="lastName" className="rowInput" type="text" value={lastName} onChange={lastNameChange} /></td>
      <td><input key="graduationYear" className="rowInput" type="text" value={graduationYear} onChange={graduationYearChange} /></td>
      <td key="register">
        <button className="tableButton" type="submit" onClick={() => { register() }}>
          Register
        </button>
      </td>
    </tr>
  )

  return (
    <div className="tableDiv">
      <h1>Student Table</h1>
      {filter}
      <table className="tbl">
        {header}
        <tbody className="table-content">
          { (mainData !== 'error') && mainData.map((data) => (
            <tr key={data.studentId}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  key={prop}
                  contentEditable={data.studentId === editingRow}
                  onBlur={(event) => {
                    updateRow(event.target.innerHTML, data, prop)
                  }}
                >
                  {value}
                </td>
              ))}
              <td key="edit">
                <button
                  className="tableButton"
                  type="button"
                  onClick={() => {
                    setEditingRow(data.studentId)
                  }}
                >
                  Edit
                </button>
              </td>
              <td key="delete">
                <button className="tableButton" type="button" onClick={() => { removeRow(data.studentId) }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {showInput && inputRow}
        </tbody>
      </table>
      {dataError !== '' && (
        <div className="errorDiv">
          {dataError}
        </div>
      )}
    </div>
  )
}