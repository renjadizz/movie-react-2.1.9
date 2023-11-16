import React from 'react'
import debounce from 'lodash/debounce'
import { Input } from 'antd'
import './Search.css'

export default class Search extends React.Component {
  searchOnChange = (e) => {
    this.props.changeSearch(e.target.value)
  }
  debouncedSearch = debounce(this.searchOnChange, 500)
  render() {
    return <Input placeholder="Search Movie" onChange={this.debouncedSearch} className="search" />
  }
}
