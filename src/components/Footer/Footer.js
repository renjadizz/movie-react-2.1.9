import React from 'react'
import { Pagination } from 'antd'

export default class Footer extends React.Component {
  render() {
    const onChangePage = (page) => {
      this.props.changePage(page)
    }
    const { totalMovies } = this.props
    return <Pagination defaultCurrent={1} total={totalMovies} pageSize={20} onChange={onChangePage} />
  }
}
