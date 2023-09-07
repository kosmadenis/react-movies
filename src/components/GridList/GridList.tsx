import React from 'react'
import { Alert, Pagination } from 'antd'

import Card from '../Card'
import type { MovieData } from '../../model/types'

import './grid-list.css'

interface Props {
  totalResults: number
  movies: MovieData[]
  page: number
  onPageChange: (page: number) => void
}

const GridList: React.FC<Props> = ({ totalResults, movies, page, onPageChange }) => {
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
      <Card {...movie} />
    </li>
  ))

  return (
    <>
      <ul className="grid-list">{cards}</ul>
      <Pagination
        className="grid-list__pagination"
        showSizeChanger={false}
        pageSize={20}
        current={page}
        onChange={onPageChange}
        total={totalResults}
      />
    </>
  )
}

export default GridList
