/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import header from './Shared/Header'
import errorDiv from './Shared/Error'
import './MyTable.scss'

export default function MyTable() {
  const headerCols = [
    'StudentID',
    'First Name',
    'Last Name',
    'Course ID',
    'Course Name',
    'Delete'
  ]

  const [mainData, setMainData] = useState([])
  const [studentData, setStudentData] = useState([])
  const [courseData, setCourseData] = useState([])

  const siteCode = 'enrollment/'
  const [filterCode, setFilterCode] = useState('')
  const myUrl = `http://localhost:8080/api/${siteCode}${filterCode}`
  const myStudentUrl = 'http://localhost:8080/api/student/'
  const myCourseUrl = 'http://localhost:8080/api/course'

  const [myFilter, setMyFilter] = useState('student')
  const [entry1, setEntry1] = useState('')
  const [runEffect, setRunEffect] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [inputError, setInputError] = useState('')
  const [dataError, setDataError] = useState('')

  const [studentId, setStudentId] = useState('')
  const [inputFirstName, setFirstName] = useState('')
  const [inputLastName, setLastName] = useState('')
  const [courseId, setCourseId] = useState('')
  const [inputCourseName, setCourseName] = useState('')
  const [showInput, setShowInput] = useState(true)

  const clearData = () => {
    setEntry1('')
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
    if (studentData.length === 0) {
      fetch(myStudentUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('student data recieved: ', data)
          if (Object.hasOwn(data, 'status')) {
            setStudentData('error')
          } else {
            setStudentData(data)
          }
        })
    }
    if (courseData.length === 0) {
      fetch(myCourseUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('course data recieved: ', data)
          if (Object.hasOwn(data, 'status')) {
            setCourseData('error')
          } else {
            setCourseData(data)
          }
        })
    }
  }, [mainData.length, runEffect, myUrl, filterCode, studentData.length, courseData.length])
  const studentIdChange = (event) => {
    const rowToUpdate = studentData.filter((row) => (row.studentId === parseInt(event.target.value, 10)))
    setFirstName(rowToUpdate[0].firstName)
    setLastName(rowToUpdate[0].lastName)
    setInputError('')
    setStudentId(event.target.value)
  }
  const courseIdChange = (event) => {
    const rowToUpdate = courseData.filter((row) => (row.courseId === parseInt(event.target.value, 10)))
    setCourseName(rowToUpdate[0].courseName)
    setInputError('')
    setCourseId(event.target.value)
  }
  const removeRow = (studentIdData, courseIdData) => {
    console.log('Removing row: ', studentIdData, courseIdData)
    fetch(`${myUrl}?studentId=${studentIdData}&courseId=${courseIdData}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => {
      console.log('response received: ', response)
      if (response.ok) setMainData(mainData.filter((row) => (row.studentId !== studentIdData && row.courseId !== courseIdData)))
      else console.log('Row not removed')
    })
  }
  const register = () => {
    if (courseId !== '' && studentId !== '' && !Number.isNaN(parseInt(studentId, 10) && !Number.isNaN(parseInt(courseId, 10)))) {
      fetch(`${myUrl}?studentId=${studentId}&courseId=${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json())
        .then((data) => {
          console.log('data received: ', data)
          setInputError(data.message)
        })
        .catch((error) => {
          if (error.toString().substring(0, 46) === ('SyntaxError: Unexpected token \'S\', "Student ha')) {
            console.log('Student added succesfully')
            setRunEffect(true)
            setStudentId('')
            setCourseId('')
            setFirstName('')
            setLastName('')
            setCourseName('')
          }
        })
    }
  }
  const resetTable = () => {
    clearData()
    setShowInput(true)
  }
  const handleSubmit = () => {
    setSearchError('')
    if (entry1 !== '') {
      if (Number.isNaN(parseInt(entry1, 10))) setSearchError('Error: Id field must be an integer.  ')
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

  const filter = (
    <div className="filterDiv" style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="selectDiv">
        Sort by:
        <select value={myFilter} onChange={filterChange}>
          <option value="student">StudentID</option>
          <option value="course">CourseID</option>
        </select>
      </div>
      <div className="inputDiv" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="input1">
          {`Enter ${myFilter}:`}
          <input type="text" name="entry1" value={entry1} onChange={textChange} onKeyPress={handleKeypress} />
        </div>
      </div>
      <button className="inputButton" type="button" onClick={handleSubmit}>Search</button>
      {errorDiv(searchError)}
    </div>
  )
  const inputRow = (
    <tr className={inputError !== '' ? 'inputRowError' : 'inputRow'} key="input">
      <td>
        <select className="inputSelect" value={studentId} onChange={studentIdChange}>
          <option value="" />
          {studentData.map((data) => <option key={data.studentId} value={data.studentId}>{data.studentId}</option>)}
        </select>
      </td>
      <td><input key="firstName" className="rowInput" disabled value={inputFirstName} /></td>
      <td><input key="lastName" className="rowInput" disabled value={inputLastName} /></td>
      <td>
        <select className="inputSelect" value={courseId} onChange={courseIdChange}>
          <option value="" />
          {courseData.map((data) => <option key={data.courseId} value={data.courseId}>{data.courseId}</option>)}
        </select>
      </td>
      <td><input key="courseName" className="rowInput" disabled value={inputCourseName} /></td>
      <td key="register">
        <button className="tableButton" type="submit" onClick={() => { register() }}>
          Register
        </button>
      </td>
    </tr>
  )
  return (
    <div className="tableDiv">
      <h1>Enrollment Table</h1>
      {filter}
      <table className="tbl">
        {header(headerCols)}
        <tbody className="table-content">
          { (mainData !== 'error') && mainData.map((data) => (
            <tr key={`${data.studentId} ${data.courseId}`}>
              {Object.entries(data).map(([prop, value]) => (
                <td key={prop}>
                  {value}
                </td>
              ))}
              <td key="delete">
                <button
                  className="tableButton"
                  type="button"
                  onClick={() => { if (window.confirm('Are you sure you want to delete this item?')) removeRow(data.studentId, data.courseId) }}
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
