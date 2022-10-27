/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import header from './Shared/Header'
import errorDiv from './Shared/Error'
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
  const [semesterEntry, setSemesterEntry] = useState('')
  const [runEffect, setRunEffect] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [inputError, setInputError] = useState('')
  const [dataError, setDataError] = useState('')

  const [inputCourseName, setCourseName] = useState('')
  const [inputSubjectArea, setSubjectArea] = useState('')
  const [inputCreditAmount, setCreditAmount] = useState('')
  const [inputStudentCapacity, setStudentCapacity] = useState('')
  const [inputSemesterCode, setSemesterCode] = useState('')
  const [showInput, setShowInput] = useState(true)

  const clearData = () => {
    setEntry1('')
    setSemesterEntry('')
    setFilterCode('')
    setRunEffect(true)
  }
  const filterChange = (event) => {
    clearData()
    setMyFilter(event.target.value)
    setSearchError('')
  }
  const textChange = (event) => {
    setInputError('')
    setEntry1(event.target.value)
  }
  const semesterTextChange = (event) => {
    setInputError('')
    setSemesterEntry(event.target.value)
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
  }, [mainData.length, runEffect, myUrl, filterCode])
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
      if (response.ok) setMainData(mainData.filter((row) => (row.studentId === rowData)))
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
    if (inputCourseName !== '' && inputSubjectArea !== '') {
      const jsonData = {
        courseName: inputCourseName,
        subjectArea: inputSubjectArea,
        creditAmount: inputCreditAmount,
        studentCapacity: inputStudentCapacity,
        semesterCode: inputSemesterCode
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
          if (!Object.hasOwn(data, 'message')) {
            setRunEffect(true)
            setCourseName('')
            setSubjectArea('')
            setCreditAmount('')
            setStudentCapacity('')
            setSemesterCode('')
          } else setInputError(data.message)
        })
    } else setInputError('Fields cannot be left blank')
  }
  const resetTable = () => {
    clearData()
    setShowInput(true)
  }
  const handleSubmit = () => {
    setSearchError('')
    if (entry1 !== '') {
      if ((myFilter === 'id' || myFilter === 'semester') && Number.isNaN(parseInt(entry1, 10))) {
        setSearchError('Error: Id field must be an integer.  ')
      } else {
        if (myFilter === 'studentId') {
          setFilterCode(`studentSemester/?studentId=${entry1}&semesterCode=${semesterEntry}`)
        } else {
          setFilterCode(`${myFilter}/${entry1}`)
        }
        setRunEffect(true)
      }
    } else resetTable()
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
          <option value="name">Name</option>
          <option value="semester">Semester Code</option>
          <option value="subject">Subject Area</option>
          <option value="studentId">Student Semester</option>
        </select>
      </div>
      <div className="inputDiv" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="input1">
          {`Enter ${myFilter}:`}
          <input type="text" name="entry1" value={entry1} onChange={textChange} onKeyPress={handleKeypress} />
        </div>
        {myFilter === 'studentId' && (
          <div className="input2">
            Enter Semester code
            <input type="text" name="semesterEntry" value={semesterEntry} onChange={semesterTextChange} onKeyPress={handleKeypress} />
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
      <td><input key="courseName" className="rowInput" type="text" value={inputCourseName} onChange={courseNameChange} /></td>
      <td><input key="subjectArea" className="rowInput" type="text" value={inputSubjectArea} onChange={subjectAreaChange} /></td>
      <td>
        <input key="creditAmount" className="rowInput" type="number" min="0" max="20" value={inputCreditAmount} onChange={creditAmountChange} />
      </td>
      <td>
        <input key="studentCapacity" className="rowInput" type="number" min="0" value={inputStudentCapacity} onChange={studentCapacityChange} />
      </td>
      <td><input key="semesterCode" className="rowInput" type="text" value={inputSemesterCode} onChange={semesterCodeChange} /></td>
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
        {header(headerCols)}
        <tbody className="table-content">
          { (mainData !== 'error') && mainData.map((data) => (
            <tr key={data.courseId}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  key={prop}
                  contentEditable={data.courseId === editingRow}
                  onBlur={(event) => {
                    const rowToUpdate = mainData.filter((row) => (row.courseId === data.courseId))
                    const ogVal = rowToUpdate[0][prop]
                    if (window.confirm('Are you sure you want to make these changes?')) {
                      updateRow(event.target.innerHTML, data, prop)
                    } else {
                      setEditingRow([])
                      rowToUpdate[0][prop] = `${ogVal} `
                    }
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
