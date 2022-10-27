import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MyStudentTable from '../Table/MyStudentTable'
import MyCourseTable from '../Table/MyCourseTable'
import MyEnrollmentTable from '../Table/MyEnrollmentTable'
import Layout from '../Layout/Layout'
import NoPage from '../NoPage'
import './main.scss'

function Main() {
  return (
    <div>
      <div>
        <h1 className="brand-page-title">
          Student Enrollment Service
        </h1>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="students" element={<MyStudentTable />} />
            <Route path="courses" element={<MyCourseTable />} />
            <Route path="enrollment" element={<MyEnrollmentTable />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <br />
      <br />
    </div>
  )
}

export default Main
