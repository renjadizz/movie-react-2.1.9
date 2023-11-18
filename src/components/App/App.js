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
    needUpdate: false,
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
    if (prevState.guestPage !== this.state.guestPage) {
      this.populateRatedMovies(this.state.guestPage, this.state.guestSessionId)
    }
    if (prevState.search !== this.state.search) {
      this.populateAllMovies(this.state.page, this.state.search)
    }
    if (prevState.guestSessionId !== this.state.guestSessionId) {
      this.populateRatedMovies(this.state.guestPage, this.state.guestSessionId)
    }
    if (this.state.needUpdate !== false) {
      const movieId = this.state.needUpdate[0]
      let movie = this.state.movies.find((element) => element.id === movieId)
      movie['votes'] = this.state.needUpdate[1]
      if (this.state.guestMovies.find((element) => element.id === movieId)) {
        const updateMovie = this.state.guestMovies.map((movie) => {
          if (movie.id !== movieId) {
            return movie
          } else {
            return {
              ...movie,
              votes: this.state.needUpdate[1],
            }
          }
        })
        this.setState({ guestMovies: updateMovie, needUpdate: false })
      } else {
        this.setState({ guestMovies: [...this.state.guestMovies, movie], needUpdate: false })
      }
    }
  }
  truncateText(text) {
    text = text.trim()
    let words = text.split(' ')
    return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : text
  }
  data = new MovieApiService()
  createGuestSession() {
    this.data.createGuestSession().then((results) => {
      if (results.success)
        this.setState({ guestSessionId: results.guest_session_id, guestSessionExpires: results.expires_at })
    })
  }
  getRatedMovies(pageNumber, guestId) {
    const ratedMovies = this.data
      .getGuestMovies(pageNumber, guestId)
      .then((results) => {
        if (results instanceof Error) throw new Error(results.message)
        const movies = results.results.map((movie) => {
          return {
            id: movie.id,
            gendreIds: [...movie.genre_ids],
            title: movie.title,
            poster: movie.poster_path,
            votes: movie.rating,
            overview: this.truncateText(movie.overview),
            releaseDate: movie.release_date,
          }
        })
        const totalGuestMovies = results.total_results
        return { movies, totalGuestMovies }
      })
      .catch((error) => {
        this.setState({
          error: error,
          loading: false,
          totalGuestMovies: 0,
        })
      })
    return ratedMovies
  }
  async populateRatedMovies(pageNumber, guestId) {
    const data = await this.getRatedMovies(pageNumber, guestId)
    this.setState({
      guestMovies: data.movies,
      loading: false,
      error: null,
      totalGuestMovies: data.totalGuestMovies,
    })
  }
  populateAllMovies(pageNumber, search) {
    this.data
      .getAllMovies(pageNumber, search)
      .then((results) => {
        if (results instanceof Error) throw new Error(results.message)
        const movies = results.results.map((movie) => {
          return {
            id: movie.id,
            gendreIds: [...movie.genre_ids],
            title: movie.title,
            poster: movie.poster_path,
            overview: this.truncateText(movie.overview),
            votes: 0,
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
  populateGenres() {
    this.data
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
  changeRatedPage = (page) => {
    this.setState({
      guestPage: page,
      loading: true,
    })
  }
  changeSearch = (search) => {
    this.setState({
      search,
      loading: true,
    })
  }
  setRateValue = (id, value) => {
    this.data.postGuestMovies(id, value, this.state.guestSessionId).then((result) => {
      if (result.success === true) {
        this.setState({
          needUpdate: [id, value],
        })
      }
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
    const movies = !this.state.loading ? (
      <AppView
        movies={this.state.movies}
        genres={this.state.genres}
        guestMovie={this.state.guestMovies}
        setRateValue={this.setRateValue}
      />
    ) : null
    const guestMovies = !this.state.loading ? (
      <AppView movies={this.state.guestMovies} genres={this.state.genres} setRateValue={this.setRateValue} />
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
              <Footer defaultCurrent={1} totalMovies={this.state.totalGuestMovies} changePage={this.changeRatedPage} />
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

const AppView = ({ movies, genres, guestMovie, setRateValue }) => {
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
      let movieRate = 0
      if (!el.votes) {
        const movieRated = guestMovie.find((element) => element.id === el.id)
        if (movieRated !== undefined) {
          movieRate = movieRated.votes
        }
      } else {
        movieRate = el.votes
      }

      return (
        <Card key={el.id} movieRate={movieRate} movie={el} movieGenres={movieGenreNames} setRateValue={setRateValue} />
      )
    })
    return <Content className="card-panel">{cardData}</Content>
  }
}
