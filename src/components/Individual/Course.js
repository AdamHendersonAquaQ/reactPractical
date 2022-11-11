import React from 'react'
import { useParams } from 'react-router-dom'
import MyCourseTable from '../Table/MyCourseTable'

export default function Course() {
  const { number } = useParams()
  return (
    <div>
      {number !== '' && (
        <div>
          <MyCourseTable id={number} />
        </div>
      )}
    </div>
  )
}
