import React from 'react'
import Header from '../header/Header'
import MyTable from '../Table/MyTable'
import './main.scss'

function Main() {
  return (
    <div>
      <Header myHeader="This is a header" />
      <MyTable />
    </div>
  )
}

export default Main
