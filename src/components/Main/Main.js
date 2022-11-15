import React from 'react'
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom'
import MyStudentTable from '../Table/MyStudentTable'
import Student from '../Individual/Student'
import MyCourseTable from '../Table/MyCourseTable'
import Course from '../Individual/Course'
import MyEnrollmentTable from '../Table/MyEnrollmentTable'
import Layout from '../Layout/Layout'
import NoPage from '../NoPage/NoPage'
import Home from '../Home/Home'
import './main.scss'

function Main() {
  return (
    <div className="mainDiv">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="students" element={<MyStudentTable id="noId" />} />
            <Route path="student/:number" element={<Student />} />
            <Route path="courses" element={<MyCourseTable />} />
            <Route path="course/:number" element={<Course />} />
            <Route path="enrollment" element={<MyEnrollmentTable id="noId" />} />
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
