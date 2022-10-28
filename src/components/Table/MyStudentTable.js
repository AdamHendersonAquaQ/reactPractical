/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import header from './Shared/Header'
import errorDiv from './Shared/Error'
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
  const [inputError, setInputError] = useState('')
  const [dataError, setDataError] = useState('')

  const [inputFirstName, setFirstName] = useState('')
  const [inputLastName, setLastName] = useState('')
  const [inputGraduationYear, setGraduationYear] = useState('')
  const [showInput, setShowInput] = useState(true)

  const clearData = () => {
    setEntry1('')
    setEntry2('')
    setFilterCode('')
    setRunEffect(true)
  }
  const filterChange = (event) => {
    clearData()
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
    setInputError('')
    setFirstName(event.target.value)
  }
  const lastNameChange = (event) => {
    setInputError('')
    setLastName(event.target.value)
  }
  const graduationYearChange = (event) => {
    setInputError('')
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
    clearData()
    setShowInput(true)
  }
  const handleSubmit = () => {
    setSearchError('')
    if ((entry1 !== '') || (myFilter === 'studentName' && entry2 !== '')) {
      if (myFilter === 'id' && Number.isNaN(parseInt(entry1, 10))) setSearchError('Error: Id field must be an integer.  ')
      else {
        const tempFilterCode = (myFilter !== 'studentName') ? `${myFilter}/${entry1}` : `${myFilter}/?firstName=${entry1}&lastName=${entry2}`
        setFilterCode(tempFilterCode)
        setRunEffect(true)
      }
    } else resetTable()
  }
  const register = () => {
    console.log(inputFirstName !== '')
    console.log(Number.isNaN(parseInt(inputGraduationYear, 10)))
    if (inputFirstName !== '') {
      const jsonData = {
        firstName: inputFirstName,
        lastName: inputLastName,
        graduationYear: inputGraduationYear
      }
      fetch(myUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      }).then((response) => response.json())
        .then((data) => {
          if (!Object.hasOwn(data, 'message')) {
            console.log('data received: ', data)
            setRunEffect(true)
            setFirstName('')
            setLastName('')
            setGraduationYear('')
          } else setInputError(data.message)
        })
    } else setInputError('First name cannot be left blank')
  }
  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmit()
    }
  }

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
      {errorDiv(searchError)}
    </div>
  )

  const inputRow = (
    <tr className={inputError !== '' ? 'inputRowError' : 'inputRow'} key="input">
      <td key="id" />
      <td><input key="firstName" className="rowInput" type="text" value={inputFirstName} onChange={firstNameChange} /></td>
      <td><input key="lastName" className="rowInput" type="text" value={inputLastName} onChange={lastNameChange} /></td>
      <td>
        <input
          key="graduationYear"
          className="rowInput"
          type="number"
          min={new Date().getFullYear()}
          value={inputGraduationYear}
          onChange={graduationYearChange}
        />
      </td>
      <td key="register">
        <button className="tableButton" type="submit" onClick={() => { register() }}>
          Register
        </button>
      </td>
    </tr>
  )

  return (
    <div className="tableDiv">
      <h2>Student Table</h2>
      {filter}
      <table className="tbl">
        {header(headerCols)}
        <tbody className="table-content">
          { (mainData !== 'error') && mainData.map((data) => (
            <tr key={data.studentId}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  key={prop}
                  contentEditable={data.studentId === editingRow}
                  onBlur={
                    (event) => {
                      const rowToUpdate = mainData.filter((row) => (row.studentId === data.studentId))
                      const ogVal = rowToUpdate[0][prop]
                      if (window.confirm('Are you sure you want to make these changes?')) {
                        updateRow(event.target.innerHTML, data, prop)
                      } else {
                        setEditingRow([])
                        rowToUpdate[0][prop] = `${ogVal} `
                      }
                    }
                }
                >
                  {value}
                </td>
              ))}
              <td key="edit">
                <button
                  className="tableButton"
                  type="button"
                  onClick={() => { setEditingRow(data.studentId) }}
                >
                  Edit
                </button>
              </td>
              <td key="delete">
                <button
                  className="tableButton"
                  type="button"
                  onClick={() => { if (window.confirm('Are you sure you want to delete this item?')) removeRow(data.studentId) }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {showInput && inputRow}
        </tbody>
      </table>
      {errorDiv(inputError)}
      {errorDiv(dataError)}
    </div>
  )
}
