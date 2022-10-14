import React from 'react'
import { string } from 'prop-types'

export default function Header(props) {
  console.log('props: ', props)
  const { myHeader } = props
  return (
    <div>
      <h1 className="brand-page-title">
        {myHeader}
      </h1>
      <div className="brand-page-name">
        Department A
      </div>
    </div>
  )
}

Header.propTypes = {
  myHeader: string
}

Header.defaultProps = {
  myHeader: 'default header'
}
