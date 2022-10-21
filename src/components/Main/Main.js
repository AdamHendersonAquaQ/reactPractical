import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '../header/Header'
import MyStudentTable from '../Table/MyStudentTable'
import MyCourseTable from '../Table/MyCourseTable'
import Home from '../Home'
import Layout from '../Layout/Layout'
import NoPage from '../NoPage'
import './main.scss'

function Main() {
  return (
    <div>
      <Header myHeader="Student enrollment Service" />
      <BrowserRouter>
        <Routes>
          <Route path="/:page" component={Header} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="students" element={<MyStudentTable />} />
            <Route path="courses" element={<MyCourseTable />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Main
