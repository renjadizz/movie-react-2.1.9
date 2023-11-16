import ResourceError from './ResourceError'

export default class MovieApiService {
  _moviePopularUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page='
  _movieGenresUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
  _options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjRhYThjMWY5M2Y2NTUyYzkwZWM1NWQ4ZDkyODI2YSIsInN1YiI6IjY1NGU0OWUzNDFhNTYxMzM2ODg3MDA2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yyIOsm-pcTOBNaCQa1mXH-ZcBGEMCDhn-zbj0YDXqUI',
    },
    withCredentials: true,
  }
  async getAllMovies(pageNumber = 1) {
    try {
      const res = await fetch(this._moviePopularUrl + pageNumber, this._options)
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
}
