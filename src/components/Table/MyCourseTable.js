/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { string } from 'prop-types'
import errorDiv from './Shared/Error'
import LinkButton from './Shared/LinkButton'
import NavButton from './Shared/NavButton'
import './MyTable.scss'

export default function MyTable({ id }) {
  const headerCols = [
    { label: 'ID', accesor: 'courseId' },
    { label: 'Course Name', accesor: 'courseName' },
    { label: 'Subject Area', accesor: 'subjectArea' },
    { label: 'Credit Amount', accesor: 'creditAmount' },
    { label: 'Student Capacity', accesor: 'studentCapacity' },
    { label: 'Semester Code', accesor: 'semesterCode' }
  ]

  const [mainData, setMainData] = useState([])
  const [editingRow, setEditingRow] = useState([])
  const [runEffect, setRunEffect] = useState(true)

  const [sortType, setSortType] = useState('courseId')
  const [sortOrder, setSortOrder] = useState('ASC')
  const [sortEffect, setSortEffect] = useState(false)

  const siteCode = 'course/'
  const [filterCode, setFilterCode] = useState('')
  const myUrl = `http://localhost:8080/api/${siteCode}${filterCode}`

  const [myFilter, setMyFilter] = useState('id')
  const [entry1, setEntry1] = useState('')
  const [semesterEntry, setSemesterEntry] = useState('')

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

  const [semData, setSemData] = useState([])

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
    if (runEffect) {
      setRunEffect(false)
      fetch((id === 'noId') ? myUrl : `http://localhost:8080/api/${siteCode}id/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Course data recieved: ', data)
          if (Object.hasOwn(data, 'status')) {
            setMainData('error')
            setDataError(data.message)
          } else {
            let sorted = []
            if (sortType.slice(-2) === 'Id' || sortType === 'creditAmount' || sortType === 'studentCapacity') {
              sorted = [...Object.entries(data)]
                .sort((a, b) => a[1].studentId - b[1].studentId)
                .sort((a, b) => a[1][sortType] - b[1][sortType] * (sortOrder === 'ASC' ? 1 : -1))
            } else {
              sorted = [...Object.entries(data)]
                .sort((a, b) => a[1].studentId - b[1].studentId)
                .sort((a, b) => a[1][sortType].toString().localeCompare(b[1][sortType].toString()) * (sortOrder === 'ASC' ? 1 : -1))
            }
            const objSorted = []
            sorted.forEach((item) => {
              [, objSorted[sorted.indexOf(item)]] = item
            })
            fetch(`http://localhost:8080/api/${siteCode}capacity`)
              .then((response) => response.json())
              .then((caps) => {
                console.log('Capacity data recieved: ', caps)
                caps.forEach((x) => {
                  objSorted.forEach((y, i) => {
                    if (y.courseId === x.courseId) { objSorted[i].studentCapacity = `${x.capacityCount}/${y.studentCapacity}` }
                  })
                })
                setMainData(objSorted)
                setDataError('')
              })
            if (myFilter === 'semester') {
              data.forEach((x) => { if (!semData.includes(x.semesterCode))semData.push(x.semesterCode) })
            } else setSemData([])
          }
        })
    } else if (sortEffect) {
      if (mainData.length !== 0) {
        setSortEffect(false)
        let sorted = []
        if (sortType.slice(-2) === 'Id' || sortType === 'creditAmount') {
          sorted = [...Object.entries(mainData)]
            .sort((a, b) => a[1].studentId - b[1].studentId)
            .sort((a, b) => (a[1][sortType] - b[1][sortType]) * (sortOrder === 'ASC' ? 1 : -1))
        } else if (sortType === 'studentCapacity') {
          sorted = [...Object.entries(mainData)]
            .sort((a, b) => a[1].studentId - b[1].studentId)
            .sort(
              (a, b) => (parseInt(a[1].studentCapacity.toString().split('/')[1], 10) - parseInt(b[1].studentCapacity.toString().split('/')[1], 10))
              * (sortOrder === 'ASC' ? 1 : -1)
            )
        } else {
          sorted = [...Object.entries(mainData)]
            .sort((a, b) => a[1].studentId - b[1].studentId)
            .sort((a, b) => a[1][sortType].toString().localeCompare(b[1][sortType].toString()) * (sortOrder === 'ASC' ? 1 : -1))
        }
        const objSorted = []
        sorted.forEach((item) => {
          [, objSorted[sorted.indexOf(item)]] = item
        })
        setMainData(objSorted)
      }
    } else if (mainData.length === 0) setSortEffect(true)
  }, [mainData, runEffect, myUrl, filterCode, id, sortType, sortOrder, sortEffect, myFilter, semData])

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
          setMainData(mainData.filter((row) => (row.courseId !== rowData)))
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
    previous.current = rowToUpdate[0][field]
    if (field === 'studentCapacity' && (String(previous.current.toString().split('/')[1]) === String(value))) {
      setEditingRow([])
      rowToUpdate[0][field] = `${previous.current} `
    } else if ((String(previous.current) !== String(value))) {
      if (window.confirm('Are you sure you want to make these changes?')) {
        rowToUpdate[0][field] = value
        let cap =""
        if(rowToUpdate[0].studentCapacity.toString().includes('/')) {
          cap = rowToUpdate[0].studentCapacity.toString().split('/')[0]
          rowToUpdate[0].studentCapacity=rowToUpdate[0].studentCapacity.toString().split('/')[1]
        }
        console.log(rowToUpdate[0])
        fetch(`${myUrl}update/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(rowToUpdate[0])
        }).then((response) => response.json())
          .then((data) => {
            if (data.status !== 200) {
              rowToUpdate[0][field] = `${previous.current} `
              window.alert(`Update failed: ${data.message}`)
            }
            console.log(data)
            setEditingRow([])
          }).catch(() => {
            if(cap!="") rowToUpdate[0].studentCapacity = `${cap}/${rowToUpdate[0].studentCapacity}`
            if (field === 'studentCapacity') rowToUpdate[0][field] = `${previous.current.toString().split('/')[0]}/${rowToUpdate[0][field]}`
            console.log('Update successful')
            setEditingRow([])
          })
      } else {
        setEditingRow([])
        rowToUpdate[0][field] = `${previous.current} `
      }
    } else setEditingRow([])
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
          console.log('Register data: ', data)
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
    if ((myFilter !== 'studentId' && entry1 !== '') || (myFilter === 'studentId' && entry1 !== '' && semesterEntry !== '')) {
      if ((myFilter === 'id' || myFilter === 'studentId') && Number.isNaN(parseInt(entry1, 10))) {
        setSearchError('Error: Id field must be an integer.')
      } else {
        if (myFilter === 'studentId') setFilterCode(`studentSemester/?studentId=${entry1}&semesterCode=${semesterEntry}`)
        else setFilterCode(`${myFilter}/${entry1}`)
        setRunEffect(true)
      }
    } else if (myFilter === 'studentId' && entry1 === '' && semesterEntry === '') {
      clearData()
    } else if (myFilter === 'studentId' && (entry1 === '' || semesterEntry === '')) {
      setSearchError('Error: Must give ID and Semester Code.')
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
    <div className="filterBox">
      <div className="selectDiv">
        Sort by:
        <select className="filterSelect" value={myFilter} onChange={filterChange}>
          <option value="id">Id</option>
          <option value="name">Name</option>
          <option value="subject">Subject Area</option>
          <option value="semester">Semester Code</option>
          <option value="studentId">Student Semester</option>
        </select>
      </div>
      <div className="inputDiv" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="input1">
          {`Enter ${myFilter[0].toUpperCase() + myFilter.substring(1)}:`}
          {myFilter !== 'semester' ? (
            <input
              type="text"
              className="inputEntry"
              name="entry1"
              value={entry1}
              onClick={() => setEntry1('')}
              onChange={textChange}
              onKeyPress={handleKeypress}
            />
          )
            : (
              <select className="filterSelect" value={entry1} onChange={(e) => { setEntry1(e.target.value) }}>
                <option key="blank" value=""> </option>
                {semData.map((data) => (<option key={data} value={data}>{data}</option>))}
              </select>
            )}
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
    </div>
    {errorDiv(searchError)}
    </div>

  )
  const inputFields = (
    <>
      <td key="courseName">
        <input size="1" className="rowInput" type="text" value={inputCourseName} onChange={(e) => setCourseName(e.target.value)} />
      </td>
      <td key="subjArea">
        <input size="1" className="rowInput" type="text" value={inputSubjectArea} onChange={(e) => setSubjectArea(e.target.value)} />
      </td>
      <td key="creditAmount">
        <input
          size="1"
          className="rowInput"
          type="number"
          min="0"
          max="20"
          value={inputCreditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
        />
      </td>
      <td key="studentCapacity">
        <input
          size="1"
          className="rowInput"
          type="number"
          min="0"
          max="1000"
          value={inputStudentCapacity}
          onChange={(e) => setStudentCapacity(e.target.value)}
        />
      </td>
      <td key="semesterCode">
        <input size="1" className="rowInput" type="text" value={inputSemesterCode} onChange={(e) => setSemCode(e.target.value)} />
      </td>
      <td className="editDeleteTd" key="register">
        <button size="1" className="tableButtonRegister" type="submit" onClick={() => { register() }}>Register</button>
      </td>
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
            setInputError('')
          }}
        >
          {showInput ? '-' : '+'}
        </button>
      </td>
      {showInput && inputFields}
    </tr>
  )
  const adjustCapacity = (data, prop, value) => (
    (editingRow === data.courseId && prop === 'studentCapacity') ? value.toString().split('/')[1] : value
  )
  return (
    <div className="tableDiv">
      {id === 'noId' && NavButton(true)}
      <h2>{ id === 'noId' ? 'View All Courses' : `Course: ${id}`}</h2>
      { id === 'noId' && filter}
      <table className="tbl">
        <thead className="table-header">
          <tr key="headers">
            {headerCols.map((col) => (
              <td key={col.label}>
                {id === 'noId' ? (
                  <button className="headerButton" onClick={() => setSort(col.accesor)} type="button">
                    {col.label}
                    {sortType === col.accesor ? <img src={sortOrder === 'ASC' ? '\\.\\up_arrow.png' : '\\.\\down_arrow.png'} alt="Sort Arrow" />
                      : <img src="\.\default.png" alt="Sort Arrow" />}
                  </button>
                )
                  : col.label}
              </td>
            ))}
          </tr>
        </thead>
        <tbody className="table-content">
          { (mainData !== 'error') && mainData.map((data) => (
            <tr className={editingRow === data.courseId ? 'editRow' : 'regRow'} key={data.courseId}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  key={prop}
                  className={prop === 'courseId' ? 'studentIdTd' : 'regularTd'}
                  contentEditable={(data.courseId === editingRow && prop !== 'courseId')}
                  suppressContentEditableWarning="true"
                  onDoubleClick={() => { setEditingRow(data.courseId) }}
                  onBlur={(e) => { if (prop !== 'courseId') updateRow(e.target.innerHTML, data, prop) }}
                >
                  {prop !== 'courseId' ? adjustCapacity(data, prop, value) : LinkButton(prop, value, 'course')}
                </td>
              ))}
              <td className="editDeleteTd" key="edit">
                <button className="tableButtonEdit" type="button" onClick={() => { setEditingRow(data.courseId) }}>Edit</button>
                <button className="tableButtonDelete" type="button" onClick={() => { removeRow(data.courseId) }}>Delete</button>
              </td>
            </tr>
          ))}
          {(filterCode === '' && id === 'noId') && inputRow}
        </tbody>
      </table>
      {errorDiv(inputError)}
      {errorDiv(dataError)}
      {id === 'noId' && NavButton(false)}
    </div>
  )
}

MyTable.propTypes = {
  id: string
}

MyTable.defaultProps = {
  id: 'noId'
}
