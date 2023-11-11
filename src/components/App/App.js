import { Layout } from 'antd'
import React from 'react'

import MovieApiService from '../../utils/MovieApiService'

import styles from './App.module.css'

const { Header, Footer, Content } = Layout

class App extends React.Component {
  state = {
    movies: [],
  }
  componentDidMount() {
    this.populateAllMovies()
  }
  async populateAllMovies() {
    const data = new MovieApiService()
    await data.getAllMovies().then((results) => {
      const movies = results.map((movie) => {
        return {
          id: movie.id,
          gendreIds: [...movie.genre_ids],
          title: movie.title,
          poster: movie.poster_path,
          votes: movie.vote_average,
          overview: movie.overview,
        }
      })
      this.setState({
        movies: movies,
      })
    })
  }
  render() {
    return (
      <Layout className={styles.main}>
        <Header className={styles.header}>header</Header>
        <Layout>
          <Content>main content</Content>
        </Layout>
        <Footer>footer</Footer>
      </Layout>
    )
  }
}

export default App
