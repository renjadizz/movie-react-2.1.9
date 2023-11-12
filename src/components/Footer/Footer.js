import React from 'react'
import { Pagination } from 'antd'

export default class Footer extends React.Component {
  render() {
    return <Pagination defaultCurrent={1} total={50} />
  }
}
