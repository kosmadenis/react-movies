import React, { Component } from 'react'
import { Input, Pagination } from 'antd'
import PropTypes from 'prop-types'

import Card from '../Card'
import './search.css'
import { apiBaseUrl } from '../../consts'

class Search extends Component {
  constructor() {
    super()

    this.state = {
      movies: [],
    }
  }

  componentDidMount() {
    this.fetchSearch('return').catch(console.error)
  }

  async fetchSearch(query) {
    const response = await fetch(`${apiBaseUrl}search/movie?query=${query}`, {
      headers: {
        Accept: 'application/json',
        Authorization: process.env.REACT_APP_TMDB_TOKEN,
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching API: non-2xx HTTP code (${response.status})`)
    }

    const data = await response.json()

    const movies = data.results.map((result) => ({
      id: result.id,
      posterPath: result.poster_path,
      title: result.title,
      overview: result.overview,
      releaseDate: result.release_date ? new Date(result.release_date) : null,
      genres: result.genre_ids,
      score: result.vote_average,
    }))

    this.setState((state) => ({ ...state, movies }))
  }

  render() {
    const { movies } = this.state
    const { genreNames } = this.props

    const cards = movies.map((movie) => (
      <li key={movie.id}>
        <Card genreNames={genreNames} {...movie} />
      </li>
    ))

    return (
      <section className="search">
        <Input placeholder="Type to search..." />
        <ul className="search__grid">{cards}</ul>
        <Pagination className="search__pagination" defaultCurrent={1} total={50} />
      </section>
    )
  }
}

Search.defaultProps = {
  genreNames: {},
}

Search.propTypes = {
  genreNames: PropTypes.objectOf(PropTypes.string),
}

export default Search
