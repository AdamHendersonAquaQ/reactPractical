import React from 'react'
import { Link } from 'react-router-dom'
import './Home.scss'

export default function Home() {
  return (
    <>
      <h1 className="welcomeHeader">
        Welcome to the SEGA Student Enrollment Service!
      </h1>
      <div className="homeDiv">
        <Link to="/students" style={{ textDecoration: 'none' }}>
          <button type="button" className="homeButton">
            <img className="icon" src="studentsIcon.png" alt="Students Icon" />
            Students
          </button>
        </Link>
        <Link to="/courses" style={{ textDecoration: 'none' }}>
          <button type="button" className="homeButton">
            <img className="icon" src="coursesIcon.png" alt="Courses Icon" />
            Courses
          </button>
        </Link>
        <Link to="/enrollment" style={{ textDecoration: 'none' }}>
          <button type="button" className="homeButton">
            <img className="icon" src="enrollmentIcon.png" alt="Enrollment Icon" />
            Enrollment
          </button>
        </Link>
      </div>
    </>
  )
}
