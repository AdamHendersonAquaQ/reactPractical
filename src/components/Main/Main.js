import React, { useState } from 'react'
import Header from '../header/Header'
import MyStudentTable from '../Table/MyStudentTable'
import MyCourseTable from '../Table/MyCourseTable'
import './main.scss'

function Main() {
  const [isShown, setIsShown] = useState(false)
  const handleClick = () => {
    setIsShown((current) => !current)
  }
  return (
    <div>
      <Header myHeader="Student enrollment Service" />
      {!isShown && <button className="swapButton" type="button" onClick={handleClick}>Show courses</button>}
      {isShown && <button className="swapButton" type="button" onClick={handleClick}>Show students</button>}
      {!isShown && <MyStudentTable />}
      {isShown && <MyCourseTable />}
    </div>
  )
}

export default Main
