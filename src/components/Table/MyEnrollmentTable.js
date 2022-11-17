/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { string } from 'prop-types'
import errorDiv from './Shared/Error'
import LinkButton from './Shared/LinkButton'
import './MyTable.scss'

export default function MyTable({ id }) {
  const headerCols = [
    { label: 'Student ID', accesor: 'studentId' },
    { label: 'First Name', accesor: 'firstName' },
    { label: 'Last Name', accesor: 'lastName' },
    { label: 'Course ID', accesor: 'courseId' },
    { label: 'Course Name', accesor: 'courseName' }
  ]

  const [mainData, setMainData] = useState([])
  const [studentData, setStudentData] = useState([])
  const [courseData, setCourseData] = useState([])

  const siteCode = 'enrollment/'
  const [filterCode, setFilterCode] = useState('')
  const myUrl = `http://localhost:8080/api/${siteCode}${filterCode}`
  const myStudentUrl = 'http://localhost:8080/api/student/'
  const myCourseUrl = 'http://localhost:8080/api/course'

  const [runEffect, setRunEffect] = useState(false)

  const [sortType, setSortType] = useState('studentId')
  const [sortOrder, setSortOrder] = useState('ASC')
  const [sortEffect, setSortEffect] = useState(false)

  const [myFilter, setMyFilter] = useState('course')
  const [entry1, setEntry1] = useState('')

  const [searchError, setSearchError] = useState('')
  const [inputError, setInputError] = useState('')
  const [dataError, setDataError] = useState('')

  const [studentId, setStudentId] = useState('')
  const [inputFirstName, setFirstName] = useState('')
  const [inputLastName, setLastName] = useState('')
  const [courseId, setCourseId] = useState('')
  const [inputCourseName, setCourseName] = useState('')

  const [showInput, setShowInput] = useState(false)

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
  useEffect(() => {
    if (id === 'noId') {
      if (mainData.length === 0 || runEffect) {
        setRunEffect(false)
        fetch(myUrl)
          .then((response) => response.json())
          .then((data) => {
            console.log('Enrollment data recieved: ', data)
            if (Object.hasOwn(data, 'status')) {
              setMainData('error')
              setDataError(data.message)
            } else {
              const sorted = [...Object.entries(data)]
                .sort((a, b) => a[1].studentId.toString().localeCompare(b[1].studentId.toString()))
                .sort((a, b) => a[1][sortType].toString().localeCompare(b[1][sortType].toString()) * (sortOrder === 'ASC' ? 1 : -1))
              const objSorted = []
              sorted.forEach((item) => {
                [, objSorted[sorted.indexOf(item)]] = item
              })
              setMainData(objSorted)
              setDataError('')
            }
          })
      } else if (studentData.length === 0) {
        fetch(myStudentUrl)
          .then((response) => response.json())
          .then((data) => {
            console.log('Student data recieved: ', data)
            if (Object.hasOwn(data, 'status')) {
              setStudentData('error')
            } else {
              setStudentData(data)
            }
          })
      }
    } else if (mainData.length === 0 || runEffect) {
      setRunEffect(false)
      console.log('I am a use effect hook')
      let url = ''
      if (filterCode !== '') url = `http://localhost:8080/api/${siteCode}record/?studentId=${id}&${filterCode.replace('/', 'Id=')}`
      else { url = `${myUrl}student/${id}` }
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log('Enrollment data recieved: ', data)
          if (Object.hasOwn(data, 'status')) {
            setMainData('error')
            setDataError(data.message)
          } else {
            setMainData(data)
            setDataError('')
            setStudentId(id)
          }
        })
    }
    if (mainData.length !== 0 && (id !== 'noId' || studentData.length !== 0) && courseData.length === 0) {
      fetch(myCourseUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('Course data recieved: ', data)
          if (Object.hasOwn(data, 'status')) setCourseData('error')
          else setCourseData(data)
        })
    } else if (sortEffect) {
      setSortEffect(false)
      const sorted = [...Object.entries(mainData)]
        .sort((a, b) => a[1].studentId.toString().localeCompare(b[1].studentId.toString()))
        .sort((a, b) => a[1][sortType].toString().localeCompare(b[1][sortType].toString()) * (sortOrder === 'ASC' ? 1 : -1))
      const objSorted = []
      sorted.forEach((item) => {
        [, objSorted[sorted.indexOf(item)]] = item
      })
      setMainData(objSorted)
    }
  }, [runEffect, myUrl, filterCode, studentData.length, courseData.length, id, mainData, sortEffect, sortType, sortOrder])

  const studentIdChange = (event) => {
    if (studentData !== 'error' && event.target.value !== '') {
      const rowToUpdate = studentData.filter((row) => (row.studentId === parseInt(event.target.value, 10)))
      setFirstName(rowToUpdate[0].firstName)
      setLastName(rowToUpdate[0].lastName)
    } else {
      setFirstName('')
      setLastName('')
    }
    setInputError('')
    setStudentId(event.target.value)
  }
  const courseIdChange = (event) => {
    if (courseData !== 'error' && event.target.value !== '') {
      const rowToUpdate = courseData.filter((row) => (row.courseId === parseInt(event.target.value, 10)))
      setCourseName(rowToUpdate[0].courseName)
    } else setCourseName('')
    setInputError('')
    setCourseId(event.target.value)
  }
  const removeRow = (studentIdData, courseIdData) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      console.log('Removing row: ', studentIdData, courseIdData)
      fetch(`${myUrl}?studentId=${studentIdData}&courseId=${courseIdData}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }).then((response) => {
        console.log('response received: ', response)
        if (response.ok) setMainData(mainData.filter((row) => (row.studentId !== studentIdData || row.courseId !== courseIdData)))
        else {
          console.log('Row not removed')
          window.alert('Delete failed')
        }
      })
    }
  }
  const register = () => {
    if ((courseId !== '' && studentId !== '')) {
      fetch(`${myUrl}?studentId=${studentId}&courseId=${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json())
        .then((data) => {
          console.log('Register data received: ', data)
          setInputError(data.message)
        })
        .catch((error) => {
          if (error.toString().substring(0, 46) === ('SyntaxError: Unexpected token \'S\', "Student ha')) {
            console.log('Student added succesfully')
            setRunEffect(true)
            setInputError('')
            setStudentId('')
            setCourseId('')
            setFirstName('')
            setLastName('')
            setCourseName('')
            setShowInput(false)
          }
        })
    } else setInputError('Please select a courseId and studentId')
  }
  const handleSubmit = () => {
    setSearchError('')
    if (entry1 !== '') {
      if (Number.isNaN(parseInt(entry1, 10))) setSearchError('Error: Id field must be an integer.  ')
      else {
        setFilterCode(`${myFilter}/${entry1}`)
        setRunEffect(true)
      }
    } else clearData()
  }
  const setSort = (col) => {
    if (mainData !== 'error') {
      if (sortType === col) {
        if (sortOrder === 'ASC') setSortOrder('DESC')
        else setSortOrder('ASC')
      } else {
        setSortType(col)
        setSortOrder('ASC')
      }
      setSortEffect(true)
    }
  }
  const handleKeypress = (e) => { if (e.charCode === 13) handleSubmit() }

  const filter = (
    <div className="filterDiv">
      <div className="selectDiv">
        Sort by:
        <select className="filterSelect" value={(id !== 'noId') ? 'course' : myFilter} onChange={filterChange} disabled={id !== 'noId'}>
          <option value="course">CourseID</option>
          <option value="student">StudentID</option>
        </select>
      </div>
      <div className="inputDiv" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="input1">
          {`Enter ${myFilter[0].toUpperCase() + myFilter.substring(1)} ID:`}
          <input
            type="text"
            name="entry1"
            className="inputEntry"
            value={entry1}
            onClick={() => setEntry1('')}
            onChange={(e) => setEntry1(e.target.value)}
            onKeyPress={handleKeypress}
          />
        </div>
      </div>
      <button className="inputButton" type="button" onClick={handleSubmit}>Search</button>
      {errorDiv(searchError)}
    </div>
  )
  const inputRow = (
    <tr className={inputError !== '' ? 'inputRowError' : 'inputRow'} key="input">
      <td>
        {studentData !== 'error' && (
        <select size="1" className="inputSelectEnrollment" value={studentId} disabled={id !== 'noId'} onChange={studentIdChange}>
          <option value="" />
          {studentData.map((data) => (
            <option key={data.studentId} value={data.studentId}>
              {`${data.studentId} - ${data.firstName} ${data.lastName}`}
            </option>
          ))}
        </select>
        )}
        {studentData === 'error' && (<input key="studentName" className="rowInput" value={studentId} onChange={studentIdChange} />)}
      </td>
      <td><input size="1" key="firstName" className="rowInput" disabled value={inputFirstName} /></td>
      <td><input size="1" key="lastName" className="rowInput" disabled value={inputLastName} /></td>
      <td>
        {courseData !== 'error' && (
        <select size="1" className="inputSelectEnrollment" value={courseId} onChange={courseIdChange}>
          <option value="" />
          {courseData.map((data) => <option key={data.courseId} value={data.courseId}>{`${data.courseId} - ${data.courseName}`}</option>)}
        </select>
        )}
        {courseData === 'error' && (<input key="courseName" className="rowInput" value={courseId} onChange={courseIdChange} />)}
      </td>
      <td><input size="1" key="courseName" className="rowInput" disabled value={inputCourseName} /></td>
      <td className="editDeleteTd" key="register">
        <button size="1" className="tableButtonRegister" type="submit" onClick={() => { register() }}>
          Register
        </button>
      </td>
    </tr>
  )
  const inputButton = (
    <tr className="inputRow" key="input">
      <td key="add"><button type="button" className="tableButtonMax" onClick={() => setShowInput(!showInput)}>+</button></td>
    </tr>
  )
  return (
    <div className="tableDiv">
      <h2>Enrollment Details</h2>
      {filter}
      <table className="tbl">
        <thead className="table-header">
          <tr key="headers">
            {headerCols.map((col) => (
              <td key={col.label}>
                <button className="headerButton" onClick={() => setSort(col.accesor)} type="button">
                  {col.label}
                  {sortType === col.accesor ? <img src={sortOrder === 'ASC' ? '\\.\\up_arrow.png' : '\\.\\down_arrow.png'} alt="Sort Arrow" />
                    : <img src="\.\default.png" alt="Sort Arrow" />}
                </button>
              </td>
            ))}
          </tr>
        </thead>
        <tbody className="table-content">
          { (mainData !== 'error') && mainData.map((data) => (
            <tr key={`${data.studentId} ${data.courseId}`}>
              {Object.entries(data).map(([prop, value]) => (
                <td className={prop.slice(-2) === 'Id' ? 'studentIdTd' : 'regularTd'} key={prop}>
                  {LinkButton(prop, value, 'student')}
                  {LinkButton(prop, value, 'course')}
                  {prop.slice(-2) !== 'Id' && value}
                </td>
              ))}
              <td className="editDeleteTd" key="delete">
                <button className="tableButtonDelete" type="button" onClick={() => { removeRow(data.studentId, data.courseId) }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filterCode === '' && (showInput ? inputRow : inputButton)}
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
