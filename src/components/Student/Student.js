import React from 'react'
import { useParams } from 'react-router-dom'
import MyEnrollmentTable from '../Table/MyEnrollmentTable'
import './Student.scss'

export default function Student() {
  const { number } = useParams()
  return (
    <div>
      {number !== '' && (
        <div>
          <div className="studentDiv">
            {`Student: ${number}`}
          </div>
          <MyEnrollmentTable id={number} />
        </div>
      )}
    </div>
  )
}
