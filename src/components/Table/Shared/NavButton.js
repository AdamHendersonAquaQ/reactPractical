import React from 'react'
import '../MyTable.scss'

export default function NavButton(down) {
  const scroll = () => {
    if (down) document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight
    else document.scrollingElement.scrollTop = 0
  }
  return (
    <div className="navHeaderDiv">
      { window.innerHeight * 1.5 < document.body.offsetHeight && (
      <button className="navigateButton" type="button" onClick={() => scroll()}>
        <img src={down ? '\\.\\down_arrow.png' : '\\.\\up_arrow.png'} className="navImage" alt="Go to Bottom" />
      </button>
      )}
    </div>
  )
}
