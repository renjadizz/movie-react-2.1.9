import React from 'react'
import './Card.css'
import { format } from 'date-fns'
import { Rate } from 'antd'
export default class Card extends React.Component {
  setRateValue = (value) => {
    this.props.setRateValue(this.props.movie.id, value)
  }
  render() {
    const movie = this.props.movie
    const imgPath = 'https://image.tmdb.org/t/p/w500/'
    let movieDate = movie.releaseDate !== '' ? format(new Date(movie.releaseDate), 'MMMM d, yyyy') : ''
    const movieGenres = this.props.movieGenres
    const movieGenresSpan = movieGenres.map((el) => {
      if (el !== '') {
        return (
          <span className="card-desktop__text__genre" key={el + movie.id}>
            {el}
          </span>
        )
      }
    })
    const movieRate = this.props.movieRate
    let movieRateDesktop = null
    if (movieRate > 0 && movieRate < 3) {
      movieRateDesktop = (
        <p className="card-desktop__text__votes card-desktop__text__votes--border-color-low">{movieRate}</p>
      )
    } else if (movieRate >= 3 && movieRate < 5) {
      movieRateDesktop = (
        <p className="card-desktop__text__votes card-desktop__text__votes--border-color-med">{movieRate}</p>
      )
    } else if (movieRate >= 5 && movieRate < 7) {
      movieRateDesktop = (
        <p className="card-desktop__text__votes card-desktop__text__votes--border-color-high">{movieRate}</p>
      )
    } else if (movieRate >= 7) {
      movieRateDesktop = (
        <p className="card-desktop__text__votes card-desktop__text__votes--border-color-top">{movieRate}</p>
      )
    }
    const movieRateMobile =
      movieRate !== 0 ? <p className="card-desktop__text__votes card-mobile__top__text__votes">{movieRate}</p> : null

    return (
      <>
        <div className="card-desktop">
          <div>
            <img src={imgPath + movie.poster} className="card-desktop__image" />
          </div>
          <div className="card-desktop__text">
            <div className="card-desktop__text__header">
              <p className="card-desktop__text__title">{movie.title}</p>
              {movieRateDesktop}
            </div>
            <p className="card-desktop__text__date">{movieDate}</p>
            <div>{movieGenresSpan}</div>
            <p className="card-desktop__text__overview">{movie.overview}</p>
            <div className="card-desktop__text__stars">
              <Rate
                className="card-desktop__text__stars--font-size"
                allowHalf
                defaultMovie={0}
                onChange={this.setRateValue}
                value={Number(movieRate)}
                count={10}
              />
            </div>
          </div>
        </div>
        <div className="card-mobile">
          <div className="card-mobile__top">
            <img src={imgPath + movie.poster} className="card-mobile__image" />
            <div className="card-mobile__top__text">
              <p className="card-mobile__top__text__title">{movie.title}</p>
              <p className="card-desktop__text__date card-mobile__top__text__date">{movieDate}</p>
              <div className="card-mobile__top__text__genres card-mobile__top__text__genres">{movieGenresSpan}</div>
            </div>
            <div>{movieRateMobile}</div>
          </div>
          <div className="card-mobile__text">
            <p className="card-desktop__text__overview">{movie.overview}</p>
          </div>
          <div className="card-mobile__stars">
            <Rate
              className="card-desktop__text__stars--font-size"
              allowHalf
              defaultMovie={0}
              onChange={this.setRateValue}
              value={Number(movieRate)}
              count={10}
            />
          </div>
        </div>
      </>
    )
  }
}
