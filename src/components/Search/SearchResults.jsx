import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'

import Card from '../Card'

function SearchResults({ genreNames, totalResults, movies }) {
  const cards = movies.map((movie) => (
    <li key={movie.id}>
      <Card genreNames={genreNames} {...movie} />
    </li>
  ))

  return (
    <>
      <ul className="search__grid">{cards}</ul>
      <Pagination
        className="search__pagination"
        defaultCurrent={1}
        defaultPageSize={20}
        total={totalResults}
      />
    </>
  )
}

SearchResults.defaultProps = {
  genreNames: {},
  totalResults: 0,
  movies: [],
}

SearchResults.propTypes = {
  genreNames: PropTypes.objectOf(PropTypes.string),
  totalResults: PropTypes.number,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      posterPath: PropTypes.string,
      title: PropTypes.string.isRequired,
      overview: PropTypes.string.isRequired,
      releaseDate: PropTypes.instanceOf(Date),
      genres: PropTypes.arrayOf(PropTypes.number).isRequired,
      score: PropTypes.number.isRequired,
    })
  ),
}

export default SearchResults
