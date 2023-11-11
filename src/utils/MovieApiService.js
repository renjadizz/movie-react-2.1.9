export default class MovieApiService {
  _moviePopularUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'
  _options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjRhYThjMWY5M2Y2NTUyYzkwZWM1NWQ4ZDkyODI2YSIsInN1YiI6IjY1NGU0OWUzNDFhNTYxMzM2ODg3MDA2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yyIOsm-pcTOBNaCQa1mXH-ZcBGEMCDhn-zbj0YDXqUI',
    },
    withCredentials: true,
  }
  async getAllMovies() {
    const res = await fetch(this._moviePopularUrl, this._options)
    const resJson = await res.json()
    return resJson.results
  }
}
