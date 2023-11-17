import ResourceError from './ResourceError'

export default class MovieApiService {
  _moviePopularUrl = 'https://api.themoviedb.org/3/'
  _movieGenresUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
  _guestSessionUrl = 'https://api.themoviedb.org/3/authentication/guest_session/new'
  _options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjRhYThjMWY5M2Y2NTUyYzkwZWM1NWQ4ZDkyODI2YSIsInN1YiI6IjY1NGU0OWUzNDFhNTYxMzM2ODg3MDA2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yyIOsm-pcTOBNaCQa1mXH-ZcBGEMCDhn-zbj0YDXqUI',
    },
    withCredentials: true,
  }
  async getAllMovies(pageNumber = 1, search = '') {
    try {
      let movieUrl = this._moviePopularUrl
      if (search !== '') {
        movieUrl += `search/movie?query=${search}&language=en-US&page=`
      }
      if (search === '') {
        movieUrl += 'movie/popular?language=en-US&page='
      }
      const res = await fetch(movieUrl + pageNumber, this._options)
      if (!res.ok) {
        throw new ResourceError('Error number is ' + res.status)
      }
      const resJson = await res.json()
      return resJson
    } catch (error) {
      return error
    }
  }
  async getMovieGenres() {
    try {
      const res = await fetch(this._movieGenresUrl, this._options)
      if (!res.ok) {
        throw new ResourceError('Error number is ' + res.status)
      }
      const resJson = await res.json()
      return resJson.genres
    } catch (error) {
      return error
    }
  }
  async createGuestSession() {
    try {
      const res = await fetch(this._guestSessionUrl, this._options)
      if (!res.ok) {
        throw new ResourceError('Error number is ' + res.status)
      }
      const resJson = await res.json()
      return resJson
    } catch (error) {
      return error
    }
  }
  async getGuestMovies(pageNumber = 1, id) {
    try {
      const res = fetch(
        `https://api.themoviedb.org/3/guest_session/${id}/rated/movies?language=en-US&page=${pageNumber}`,
        this._options
      )
      if (!res.ok) {
        throw new ResourceError('Error number is ' + res.status)
      }
      const resJson = await res.json()
      return resJson
    } catch (error) {
      return error
    }
  }
}
