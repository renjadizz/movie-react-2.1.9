import React from 'react'
import './NoInternetConnection.css'

export default class NoInternetConnection extends React.Component {
  state = {
    isOnline: true,
  }
  setOnline(value) {
    this.setState({
      isOnline: value,
    })
  }

  render() {
    const internetConnection = this.state.isOnline
    window.addEventListener('online', () => {
      this.setOnline(true)
    })

    window.addEventListener('offline', () => {
      this.setOnline(false)
    })
    if (internetConnection) {
      return <>{this.props.children}</>
    } else {
      return <h1 className="no-internet">No Internet Connection. Please try again later.</h1>
    }
  }
}
