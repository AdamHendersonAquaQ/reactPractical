import React from 'react'
import { useParams } from 'react-router-dom'
import MyEnrollmentTable from '../Table/MyEnrollmentTable'
import MyStudentTable from '../Table/MyStudentTable'

export default function Student() {
  const { number } = useParams()
  return (
    <div>
      {number !== '' && (
        <div>
          <MyStudentTable id={number} />
          <MyEnrollmentTable id={number} />
        </div>
      )}
    </div>
  )
}
