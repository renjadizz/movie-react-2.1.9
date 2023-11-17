import { Layout, Spin, Alert, Space, Tabs } from 'antd'
import React from 'react'

import MovieApiService from '../../utils/MovieApiService'
import Card from '../Card/Card'
import Search from '../Search/Search'
import Footer from '../Footer/Footer'
import './App.css'
import NoInternetConnection from '../NoInternetConnection/NoInternetConnection'

const { Header, Footer: AntFooter, Content } = Layout
export default class App extends React.Component {
  state = {
    movies: [],
    genres: [],
    loading: true,
    error: null,
    totalMovies: 0,
    page: 1,
    search: '',
    guestSessionId: '',
    guestSessionExpires: '',
    guestMovies: [],
    totalGuestMovies: 0,
    guestPage: 1,
  }
  componentDidMount() {
    this.populateGenres()
    this.populateAllMovies()
    this.createGuestSession()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      this.populateAllMovies(this.state.page, this.state.search)
    }
    if (prevState.search !== this.state.search) {
      this.populateAllMovies(this.state.page, this.state.search)
    }
    if (prevState.guestSessionId !== this.state.guestSessionId) {
      this.populateRatedMovies(this.state.guestPage, this.state.guestSessionId)
    }
  }
  truncateText(text) {
    text = text.trim()
    let words = text.split(' ')
    return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : text
  }
  async createGuestSession() {
    const data = new MovieApiService()
    await data.createGuestSession().then((results) => {
      if (results.success)
        this.setState({ guestSessionId: results.guest_session_id, guestSessionExpires: results.expires_at })
    })
  }
  async populateRatedMovies(pageNumber, guestId) {
    const data = new MovieApiService()
    await data
      .getGuestMovies(pageNumber, guestId)
      .then((results) => {
        if (results instanceof Error) throw new Error(results.message)
        const movies = results.results.map((movie) => {
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
        const totalGuestMovies = results.total_results
        this.setState({
          guestMovies: movies,
          loading: false,
          error: null,
          totalGuestMovies,
        })
      })
      .catch((error) => {
        this.setState({
          error: error,
          loading: false,
          totalGuestMovies: 0,
        })
      })
  }
  async populateAllMovies(pageNumber, search) {
    const data = new MovieApiService()
    await data
      .getAllMovies(pageNumber, search)
      .then((results) => {
        if (results instanceof Error) throw new Error(results.message)
        const movies = results.results.map((movie) => {
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
        const totalMovies = results.total_results
        this.setState({
          movies: movies,
          loading: false,
          error: null,
          totalMovies,
        })
      })
      .catch((error) => {
        this.setState({
          error: error,
          loading: false,
          totalMovies: 0,
        })
      })
  }
  async populateGenres() {
    const data = new MovieApiService()
    await data
      .getMovieGenres()
      .then((results) => {
        if (results instanceof Error) throw new Error(results)
        const genres = results.map((genre) => {
          return {
            id: genre.id,
            name: genre.name,
          }
        })
        this.setState({
          genres: genres,
          error: null,
        })
      })
      .catch((error) => {
        this.setState({
          error: error,
        })
      })
  }
  changePage = (page) => {
    this.setState({
      page: page,
      loading: true,
    })
  }
  changeSearch = (search) => {
    this.setState({
      search,
      loading: true,
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
    const guestMovies = !this.state.loading ? (
      <AppView movies={this.state.guestMovies} genres={this.state.genres} />
    ) : null
    const error =
      this.state.error !== null ? (
        <Space align="center">
          <Alert message={this.state.error.message} type="error" closable />
        </Space>
      ) : null
    const items = [
      {
        label: 'Search',
        key: 'item-1',
        children: (
          <Content className="content-all">
            <Header className="header">
              <Search changeSearch={this.changeSearch} />
              {error}
            </Header>
            {loading}
            {movies}
            <AntFooter className="footer">
              <Footer defaultCurrent={1} totalMovies={this.state.totalMovies} changePage={this.changePage} />
            </AntFooter>
          </Content>
        ),
      },
      {
        label: 'Rated',
        key: 'item-2',
        children: (
          <Content className="content-rated">
            {loading}
            {guestMovies}
            <AntFooter className="footer">
              <Footer defaultCurrent={1} totalGuestMovies={this.state.totalGuestMovies} changePage={this.changePage} />
            </AntFooter>
          </Content>
        ),
      },
    ]
    return (
      <Layout className="main">
        <NoInternetConnection>
          <Tabs items={items} centered defaultActiveKey={1} />
        </NoInternetConnection>
      </Layout>
    )
  }
}

const AppView = ({ movies, genres }) => {
  if (movies.length === 0) {
    return (
      <Content>
        <h1 className="no-data">No Data Found</h1>
      </Content>
    )
  } else {
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
    return <Content className="card-panel">{cardData}</Content>
  }
}
