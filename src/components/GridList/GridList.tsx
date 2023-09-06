import React from 'react'
import { Alert, Pagination } from 'antd'
import PropTypes from 'prop-types'

import Card from '../Card'

function SearchResults({ genreNames, totalResults, movies, page, onPageChange }) {
  if (movies.length === 0) {
    return (
      <Alert
        className="search__results-alert"
        showIcon
        message="No movies were found"
        type="info"
      />
    )
  }

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
        showSizeChanger={false}
        pageSize={20}
        current={page}
        onChange={onPageChange}
        total={totalResults}
      />
    </>
  )
}

SearchResults.defaultProps = {
  genreNames: {},
  totalResults: 0,
  movies: [],
  page: 1,
  onPageChange: () => {},
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
  page: PropTypes.number,
  onPageChange: PropTypes.func,
}

export default SearchResults
