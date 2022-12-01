import React from 'react'
import {BsSearch, BsThreeDotsVertical} from 'react-icons/bs'

const Search = () => {
  return (
    <div className='search'>
        <input placeholder='Search'/>
        <div className='searchIcon'>
            <BsSearch/>
        </div>
        <div className='dots'>
            <BsThreeDotsVertical/>
        </div>
    </div>
  )
}

export default Search