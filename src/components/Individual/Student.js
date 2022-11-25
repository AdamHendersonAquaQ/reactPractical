import React from 'react'
import { useParams } from 'react-router-dom'
import MyEnrollmentTable from '../Table/MyEnrollmentTable'
import MyStudentTable from '../Table/MyStudentTable'
import NavButton from '../Table/Shared/NavButton'

export default function Student() {
  const { number } = useParams()
  return (
    <div>
      {NavButton(true)}
      {number !== '' && (
        <div>
          <MyStudentTable id={number} />
          <MyEnrollmentTable id={number} />
        </div>
      )}
    {NavButton(false)}
    </div>
  )
}
