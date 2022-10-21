import { Outlet, Link, useParams } from 'react-router-dom'
import { string } from 'prop-types'
import React from 'react'

import './Layout.scss'

function HeaderLink({ page }) {
  const newPage = (page === 'home') ? '' : page
  const title = page.charAt(0).toUpperCase() + page.slice(1)
  return (
    <Link to={`/${newPage}`} className="headerlink-title">
      {title}
    </Link>
  )
}

HeaderLink.propTypes = {
  page: string
}

HeaderLink.defaultProps = {
  page: ''
}
export default function Layout() {
  return (
    <div className="header">
      <HeaderLink page="home" />
      <HeaderLink page="students" />
      <HeaderLink page="courses" />
      <Outlet />
    </div>
  )
}
