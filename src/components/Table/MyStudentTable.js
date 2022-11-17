/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { string } from 'prop-types'
import errorDiv from './Shared/Error'
import './MyTable.scss'
import LinkButton from './Shared/LinkButton'

export default function MyTable({ id }) {
  const headerCols = [
    { label: 'ID', accesor: 'studentId' },
    { label: 'First Name', accesor: 'firstName' },
    { label: 'Last Name', accesor: 'lastName' },
    { label: 'Graduation Year', accesor: 'graduationYear' }
  ]
  const [mainData, setMainData] = useState([])
  const [editingRow, setEditingRow] = useState([])
  const [runEffect, setRunEffect] = useState(false)

  const [sortType, setSortType] = useState('studentId')
  const [sortOrder, setSortOrder] = useState('ASC')
  const [sortEffect, setSortEffect] = useState(false)

  const siteCode = 'student/'
  const [filterCode, setFilterCode] = useState('')
  const myUrl = `http://localhost:8080/api/${siteCode}${filterCode}`

  const [myFilter, setMyFilter] = useState('id')
  const [entry1, setEntry1] = useState('')
  const [entry2, setEntry2] = useState('')

  const [searchError, setSearchError] = useState('')
  const [inputError, setInputError] = useState('')
  const [dataError, setDataError] = useState('')

  const [inputFirstName, setFirstName] = useState('')
  const [inputLastName, setLastName] = useState('')
  const [inputGraduationYear, setGraduationYear] = useState('')

  const [showInput, setShowInput] = useState(false)
  const [inputClassname, setInputClassname] = useState('inputRow')
  const previous = useRef('')

  const navigate = useNavigate()

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
  }, [mainData.length, runEffect, myUrl, id, sortType, sortOrder, mainData, sortEffect])

  const removeRow = (rowData) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
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
        if (response.ok) {
          setMainData(mainData.filter((row) => (row.studentId !== rowData)))
          if (id !== 'noId') navigate('/students')
        } else {
          console.log('Row not removed')
          window.alert('Delete failed')
        }
      })
    }
  }

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.studentId === rowData.studentId))
    previous.current = rowToUpdate[0][field]
    if (String(previous.current) !== String(value)) {
      if (window.confirm('Are you sure you want to make these changes?')) {
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
      } else {
        setEditingRow([])
        rowToUpdate[0][field] = `${previous.current} `
      }
    } else setEditingRow([])
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
  const register = () => {
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
            setShowInput(false)
          } else {
            setInputError(data.message)
            setInputClassname('inputRowError')
          }
        })
    } else {
      setInputError('First name cannot be left blank')
      setInputClassname('inputRowError')
    }
  }
  const handleKeypress = (e) => { if (e.charCode === 13) handleSubmit() }

  const filter = (
    <div className="filterDiv">
      <div className="selectDiv">
        Sort by:
        <select className="filterSelect" value={myFilter} onChange={filterChange}>
          <option value="id">Id</option>
          <option value="studentName">Name</option>
          <option value="semester">Semester Code</option>
        </select>
      </div>
      <div className="inputDiv" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="input1">
          {myFilter === 'studentName' ? 'Enter First Name:' : `Enter ${myFilter[0].toUpperCase() + myFilter.substring(1)}:`}
          <input
            type="text"
            className="inputEntry"
            name="entry1"
            value={entry1}
            onClick={() => setEntry1('')}
            onChange={(e) => setEntry1(e.target.value)}
            onKeyPress={handleKeypress}
          />
        </div>
        {myFilter === 'studentName' && (
          <div className="input2">
            Enter Second name:
            <input
              type="text"
              className="inputEntry"
              name="entry2"
              value={entry2}
              onClick={() => setEntry2('')}
              onChange={(e) => setEntry2(e.target.value)}
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
        <input size="1" key="firstName" className="rowInput" type="text" value={inputFirstName} onChange={(e) => setFirstName(e.target.value)} />
      </td>
      <td><input size="1" key="lastName" className="rowInput" type="text" value={inputLastName} onChange={(e) => setLastName(e.target.value)} /></td>
      <td>
        <input
          size="1"
          key="graduationYear"
          className="rowInput"
          type="number"
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 100}
          value={inputGraduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
        />
      </td>
      <td className="editDeleteTd" key="register">
        <button size="1" className="tableButtonRegister" type="submit" onClick={() => { register() }}>
          Register
        </button>
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
            setShowInput(!showInput); setInputError(''); getInputClassname(); setFirstName(''); setLastName(''); setGraduationYear('')
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
      <h2>{ id === 'noId' ? 'View All Students' : `Student: ${id}`}</h2>
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
            <tr className={editingRow === data.studentId ? 'editRow' : 'regRow'} key={data.studentId} onClick={() => {}}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  key={prop}
                  className={prop === 'studentId' ? 'studentIdTd' : 'regularTd'}
                  contentEditable={data.studentId === editingRow && prop !== 'studentId'}
                  suppressContentEditableWarning="true"
                  onDoubleClick={() => { setEditingRow(data.studentId) }}
                  onBlur={(e) => { if (prop !== 'studentId') updateRow(e.target.innerHTML, data, prop) }}
                >
                  {prop !== 'studentId' ? value : LinkButton(prop, value, 'student')}
                </td>
              ))}
              <td className="editDeleteTd" key="edit-delete">
                <button className="tableButtonEdit" type="button" onClick={() => { setEditingRow(data.studentId) }}>
                  Edit
                </button>
                <button className="tableButtonDelete" type="button" onClick={() => { removeRow(data.studentId) }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {(filterCode === '' && (id === 'noId')) && inputRow}
        </tbody>
      </table>
      {showInput && errorDiv(inputError)}
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
