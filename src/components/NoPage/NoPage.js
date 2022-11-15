import React from 'react'
import { Link } from 'react-router-dom'
import './NoPage.scss'

export default function NoPage() {
  return (
    <div className="noPageDiv">
      <h1 className="errorHeader">404 - Page not found</h1>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button type="button" className="homeButton">
          <img className="icon" src="homeIcon.png" alt="Home Icon" />
          Return Home
        </button>
      </Link>
    </div>
  )
}
