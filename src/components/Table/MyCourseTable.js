/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import './MyTable.scss'

export default function MyTable() {
  const headerCols = [
    'ID',
    'Course Name',
    'Subject Area',
    'Credit Amount',
    'Student Capacity',
    'Semester Code',
    'Edit',
    'Delete'
  ]

  const [mainData, setMainData] = useState([])
  const [editingRow, setEditingRow] = useState([])
  const siteCode = 'course/'
  const [filterCode, setFilterCode] = useState('')
  const myUrl = `http://localhost:8080/api/${siteCode}${filterCode}`
  const [myFilter, setMyFilter] = useState('id')
  const [entry1, setEntry1] = useState('')
  const [runEffect, setRunEffect] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [dataError, setDataError] = useState('')

  const [courseName, setCourseName] = useState('')
  const [subjectArea, setSubjectArea] = useState('')
  const [creditAmount, setCreditAmount] = useState('')
  const [studentCapacity, setStudentCapacity] = useState('')
  const [semesterCode, setSemesterCode] = useState('')
  const [showInput, setShowInput] = useState(true)

  const filterChange = (event) => {
    setFilterCode('')
    setRunEffect(true)
    setEntry1('')
    setMyFilter(event.target.value)
    setSearchError('')
  }
  const textChange = (event) => {
    setEntry1(event.target.value)
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
            console.log(data)
            setMainData('error')
            setDataError(data.message)
          } else {
            setMainData(data)
            setDataError('')
          }
        })
    }
  }, [mainData.length, runEffect, myUrl])
  const courseNameChange = (event) => {
    setCourseName(event.target.value)
  }
  const subjectAreaChange = (event) => {
    setSubjectArea(event.target.value)
  }
  const creditAmountChange = (event) => {
    setCreditAmount(event.target.value)
  }
  const studentCapacityChange = (event) => {
    setStudentCapacity(event.target.value)
  }
  const semesterCodeChange = (event) => {
    setSemesterCode(event.target.value)
  }
  const removeRow = (rowData) => {
    console.log('Removing row: ', rowData)
    console.log('filter: ', mainData.filter((row) => (row.courseId === rowData)))
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
    const rowToUpdate = mainData.filter((row) => (row.courseId === rowData.courseId))
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
  const register = () => {
    if (courseName !== '' && subjectArea !== '' && !Number.isNaN(parseInt(creditAmount, 10) && !Number.isNaN(parseInt(studentCapacity, 10)))) {
      const jsonData = {
        "courseName": courseName,
        "subjectArea": subjectArea,
        "creditAmount": creditAmount,
        "studentCapacity": studentCapacity,
        "semesterCode": semesterCode
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
          setCourseName('')
          setSubjectArea('')
          setCreditAmount('')
          setStudentCapacity('')
          setSemesterCode('')
        })
    }
  }
  const resetTable = () => {
    setEntry1('')
    setFilterCode('')
    setRunEffect(true)
    setShowInput(true)
  }
  const handleSubmit = () => {
    setSearchError('')
    if (entry1 !== '') {
      if (myFilter === 'id' && Number.isNaN(parseInt(entry1, 10))) setSearchError('Error: Id field must be an integer.  ')
      else {
        setFilterCode(`${myFilter}/${entry1}`)
        setRunEffect(true)
      }
    } else resetTable()
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
          <option value="name">Name</option>
          <option value="semester">Semester Code</option>
          <option value="subject">Subject Area</option>
        </select>
      </div>
      <div className="inputDiv" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="input1">
          {`Enter ${myFilter}:`}
          <input type="text" name="entry1" value={entry1} onChange={textChange} onKeyPress={handleKeypress} />
        </div>
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
      <td><input key="courseName" className="rowInput" type="text" value={courseName} onChange={courseNameChange} /></td>
      <td><input key="subjectArea" className="rowInput" type="text" value={subjectArea} onChange={subjectAreaChange} /></td>
      <td><input key="creditAmount" className="rowInput" type="text" value={creditAmount} onChange={creditAmountChange} /></td>
      <td><input key="studentCapacity" className="rowInput" type="text" value={studentCapacity} onChange={studentCapacityChange} /></td>
      <td><input key="semesterCode" className="rowInput" type="text" value={semesterCode} onChange={semesterCodeChange} /></td>
      <td key="register">
        <button className="tableButton" type="submit" onClick={() => { register() }}>
          Register
        </button>
      </td>
    </tr>
  )
  return (
    <div className="tableDiv">
      <h1>Course Table</h1>
      {filter}
      <table className="tbl">
        {header}
        <tbody className="table-content">
          { (mainData !== 'error') && mainData.map((data) => (
            <tr key={data.courseId}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  key={prop}
                  contentEditable={data.courseId === editingRow}
                  onBlur={(event) => {
                    updateRow(event.target.innerHTML, data, prop)
                  }}
                >
                  {value}
                </td>
              ))}
              <td key="edit">
                <button className="tableButton" type="button" onClick={() => { setEditingRow(data.courseId) }}>
                  Edit
                </button>
              </td>
              <td key="delete">
                <button className="tableButton" type="button" onClick={() => { removeRow(data.courseId) }}>
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
