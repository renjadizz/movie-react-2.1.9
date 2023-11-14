import { Layout, Spin } from 'antd'
import React from 'react'

import MovieApiService from '../../utils/MovieApiService'
import Card from '../Card/Card'
import Search from '../Search/Search'
import Footer from '../Footer/Footer'
import './App.css'

const { Header, Footer: AntFooter, Content } = Layout

export default class App extends React.Component {
  state = {
    movies: [],
    genres: [],
    loading: true,
  }
  componentDidMount() {
    this.populateGenres()
    this.populateAllMovies()
  }
  truncateText(text) {
    text = text.trim()
    let words = text.split(' ')

    return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : text
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
          votes: movie.vote_average.toFixed(1),
          overview: this.truncateText(movie.overview),
          releaseDate: movie.release_date,
        }
      })
      this.setState({
        movies: movies,
        loading: false,
      })
    })
  }
  async populateGenres() {
    const data = new MovieApiService()
    await data.getMovieGenres().then((results) => {
      const genres = results.map((genre) => {
        return {
          id: genre.id,
          name: genre.name,
        }
      })
      this.setState({
        genres: genres,
      })
    })
  }
  render() {
    const loading = this.state.loading ? (
      <Content className="spin">
        <Spin tip="Loading" size="large">
          <div className="spin-content" />
        </Spin>
      </Content>
    ) : null
    const movies = !this.state.loading ? <AppView movies={this.state.movies} genres={this.state.genres} /> : null

    return (
      <Layout className="main">
        <Header className="header">
          <Search />
        </Header>
        {loading}
        {movies}
        <AntFooter>
          <Footer />
        </AntFooter>
      </Layout>
    )
  }
}

const AppView = ({ movies, genres }) => {
  const cardData = movies.map((el) => {
    let movieGenres = []
    for (const genreInElArr of el.gendreIds) {
      movieGenres.push(genres.find((genreEl) => genreEl.id === genreInElArr))
    }
    let movieGenreNames = movieGenres.map((i) => {
      if (i) {
        if (i.name) {
          return i.name
        }
      } else {
        return ''
      }
    })
    return <Card key={el.id} movie={el} movieGenres={movieGenreNames} />
  })
  return (
    <>
      <Content className="card-panel">{cardData}</Content>
    </>
  )
}
