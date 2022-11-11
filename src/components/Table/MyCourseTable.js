/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { string } from 'prop-types'
import header from './Shared/Header'
import errorDiv from './Shared/Error'
import LinkButton from './Shared/LinkButton'
import './MyTable.scss'

export default function MyTable({ id }) {
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
  const [inputSemesterCode, setSemCode] = useState('')

  const [inputClassname, setInputClassname] = useState('inputRow')
  const [showInput, setShowInput] = useState(false)
  const previous = useRef('')

  const navigate = useNavigate()

  const clearData = () => {
    setEntry1('')
    setSemesterEntry('')
    setFilterCode('')
    setRunEffect(true)
  }
  const clearErrors = () => {
    setSearchError('')
    setInputError('')
  }
  const filterChange = (event) => {
    clearData()
    clearErrors()
    setMyFilter(event.target.value)
  }
  const textChange = (event) => {
    clearErrors()
    setEntry1(event.target.value)
  }
  const semesterTextChange = (event) => {
    clearErrors()
    setSemesterEntry(event.target.value)
  }
  useEffect(() => {
    if (mainData.length === 0 || runEffect) {
      setRunEffect(false)
      fetch((id === 'noId') ? myUrl : `http://localhost:8080/api/${siteCode}id/${id}`)
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
  }, [mainData.length, runEffect, myUrl, filterCode, id])

  const removeRow = (rowData) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
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
        if (response.ok) {
          setMainData(mainData.filter((row) => (row.studentId === rowData)))
          if (id !== 'noId') navigate('/courses')
        } else {
          console.log('Row not removed')
          window.alert('Delete failed')
        }
      })
    }
  }
  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.courseId === rowData.courseId))
    console.log('value: ', value)
    console.log('field: ', field)
    previous.current = rowToUpdate[0][field]
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
      if (!response.ok) {
        rowToUpdate[0][field] = `${previous.current} `
        window.alert('Update failed')
      }
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
            setSemCode('')
            setShowInput(false)
          } else {
            setInputError(data.message)
            setInputClassname('inputRowError')
          }
        })
    } else {
      setInputError('Fields cannot be left blank')
      setInputClassname('inputRowError')
    }
  }
  const handleSubmit = () => {
    setSearchError('')
    if (entry1 !== '') {
      if ((myFilter === 'id' || myFilter === 'semester') && Number.isNaN(parseInt(entry1, 10))) {
        setSearchError('Error: Id field must be an integer.  ')
      } else {
        if (myFilter === 'studentId') setFilterCode(`studentSemester/?studentId=${entry1}&semesterCode=${semesterEntry}`)
        else setFilterCode(`${myFilter}/${entry1}`)
        setRunEffect(true)
      }
    } else clearData()
  }
  const handleKeypress = (e) => { if (e.charCode === 13) handleSubmit() }

  const doOnBlur = (event, prop, data) => {
    if (prop !== 'courseId') {
      const rowToUpdate = mainData.filter((row) => (row.courseId === data.courseId))
      previous.current = rowToUpdate[0][prop]
      if (window.confirm('Are you sure you want to make these changes?')) updateRow(event.target.innerHTML, data, prop)
      else {
        setEditingRow([])
        rowToUpdate[0][prop] = `${previous.current} `
      }
    }
  }
  const filter = (
    <div className="filterDiv">
      <div className="selectDiv">
        Sort by:
        <select className="filterSelect" value={myFilter} onChange={filterChange}>
          <option value="id">Id</option>
          <option value="name">Name</option>
          <option value="semester">Semester Code</option>
          <option value="subject">Subject Area</option>
          <option value="studentId">Student Semester</option>
        </select>
      </div>
      <div className="inputDiv" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="input1">
          {`Enter ${myFilter[0].toUpperCase() + myFilter.substring(1)}:`}
          <input
            type="text"
            className="inputEntry"
            name="entry1"
            value={entry1}
            onClick={() => setEntry1('')}
            onChange={textChange}
            onKeyPress={handleKeypress}
          />
        </div>
        {myFilter === 'studentId' && (
          <div className="input2">
            Enter Semester Code:
            <input
              type="text"
              name="semesterEntry"
              className="inputEntry"
              value={semesterEntry}
              onClick={() => setSemesterEntry('')}
              onChange={semesterTextChange}
              onKeyPress={handleKeypress}
            />
          </div>
        )}
      </div>
      <button className="inputButton" type="button" onClick={handleSubmit}>Search</button>
      {errorDiv(searchError)}
    </div>
  )
  const inputFields = (
    <>
      <td>
        <input size="1" key="courseName" className="rowInput" type="text" value={inputCourseName} onChange={(e) => setCourseName(e.target.value)} />
      </td>
      <td>
        <input size="1" key="subjArea" className="rowInput" type="text" value={inputSubjectArea} onChange={(e) => setSubjectArea(e.target.value)} />
      </td>
      <td>
        <input
          size="1"
          key="creditAmount"
          className="rowInput"
          type="number"
          min="0"
          max="20"
          value={inputCreditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
        />
      </td>
      <td>
        <input
          size="1"
          key="studentCapacity"
          className="rowInput"
          type="number"
          min="0"
          max="1000"
          value={inputStudentCapacity}
          onChange={(e) => setStudentCapacity(e.target.value)}
        />
      </td>
      <td>
        <input size="1" key="semesterCode" className="rowInput" type="text" value={inputSemesterCode} onChange={(e) => setSemCode(e.target.value)} />
      </td>
      <td key="register"><button size="1" className="tableButtonRegister" type="submit" onClick={() => { register() }}>Register</button></td>
    </>
  )
  const getInputClassname = () => {
    if (!showInput) {
      if (inputError === '') setInputClassname('hideButton')
      else setInputClassname('inputRowError')
    } else setInputClassname('inputRow')
  }
  const inputRow = (
    <tr className={inputClassname} key="input" onChange={() => { if (inputError !== '') setInputError(''); getInputClassname() }}>
      <td size="1" key="add">
        <button
          type="button"
          className={showInput ? 'tableButtonMin' : 'tableButtonMax'}
          onClick={() => {
            setShowInput(!showInput)
            getInputClassname()
            setCourseName('')
            setSubjectArea('')
            setCreditAmount('')
            setStudentCapacity('')
            setSemCode('')
          }}
        >
          {showInput ? '-' : '+'}
        </button>
      </td>
      {showInput && inputFields}
    </tr>
  )
  return (
    <div className="tableDiv">
      <h2>{ id === 'noId' ? 'View All Courses' : `Course: ${id}`}</h2>
      { id === 'noId' && filter}
      <table className="tbl">
        {header(headerCols)}
        <tbody className="table-content">
          { (mainData !== 'error') && mainData.map((data) => (
            <tr key={data.courseId}>
              {Object.entries(data).map(([prop, value]) => (
                <td key={prop} contentEditable={(data.courseId === editingRow && prop !== 'courseId')} onBlur={(e) => { doOnBlur(e, prop, data) }}>
                  {prop !== 'courseId' ? value : LinkButton(prop, value, 'course')}
                </td>
              ))}
              <td key="edit">
                <button className="tableButtonEdit" type="button" onClick={() => { setEditingRow(data.courseId) }}>Edit</button>
              </td>
              <td key="delete">
                <button className="tableButtonDelete" type="button" onClick={() => { removeRow(data.courseId) }}>Delete</button>
              </td>
            </tr>
          ))}
          {(filterCode === '' && id === 'noId') && inputRow}
        </tbody>
      </table>
      {errorDiv(inputError)}
      {errorDiv(dataError)}
    </div>
  )
}

MyTable.propTypes = {
  id: string
}

MyTable.defaultProps = {
  id: 'noId'
}
