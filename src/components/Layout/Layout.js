import { Outlet, Link, useLocation } from 'react-router-dom'
import { bool, string } from 'prop-types'
import React from 'react'

import './Layout.scss'

function HeaderLink({ page, selected }) {
  const title = page.charAt(0).toUpperCase() + page.slice(1)
  return (
    <Link to={`/${page}`} className={selected ? 'headerlink-title-selected' : 'headerlink-title'}>
      {title}
    </Link>
  )
}

HeaderLink.propTypes = {
  page: string,
  selected: bool
}

HeaderLink.defaultProps = {
  page: '',
  selected: false
}
export default function Layout() {
  const location = useLocation()
  return (
    <div className="header">
      <HeaderLink page="students" selected={location.pathname.substring(0, 8) === '/student'} />
      <HeaderLink page="courses" selected={location.pathname === '/courses'} />
      <HeaderLink page="enrollment" selected={location.pathname === '/enrollment'} />
      <Outlet />
    </div>
  )
}
