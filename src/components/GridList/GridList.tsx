import React from 'react'
import { Alert, Pagination, Spin } from 'antd'

import Card from '../Card'
import type { MovieData } from '../../model/types'
import { MovieDBConsumer } from '../MovieDBContext'

import './grid-list.css'

interface Props {
  empty: string | false
  error: string | false
  loading: boolean
  totalResults: number
  movies: MovieData[]
  page: number
  onPageChange: (page: number) => void
}

const GridList: React.FC<Props> = ({
  empty,
  error,
  loading,
  totalResults,
  movies,
  page,
  onPageChange,
}) => {
  const showError = error
  const showLoading = !error && loading
  const showEmpty = !error && !loading && !movies.length && !!empty
  const showCards = !error && !loading && !!movies.length

  const errorAlert = showError ? (
    <Alert
      showIcon
      message={error}
      type="error"
      className="grid-list__alert--error"
    />
  ) : null

  const loadingSpinner = showLoading ? (
    <Spin size="large" className="grid-list__spinner" />
  ) : null

  const emptyAlert = showEmpty ? (
    <Alert
      className="grid-list__alert--error"
      showIcon
      message={empty}
      type="info"
    />
  ) : null

  const indicators =
    errorAlert || loadingSpinner || emptyAlert ? (
      <div className="grid-list__center-container">
        {errorAlert}
        {loadingSpinner}
        {emptyAlert}
      </div>
    ) : null

  const content = showCards ? (
    <div className="grid-list__wrapper">
      <MovieDBConsumer>
        {({ genreNames, sessionId, api }) => (
          <ul className="grid-list">
            {movies.map((movie) => (
              <li key={movie.id}>
                <Card
                  {...movie}
                  genreNames={genreNames}
                  sessionId={sessionId}
                  api={api}
                />
              </li>
            ))}
          </ul>
        )}
      </MovieDBConsumer>
      <Pagination
        className="grid-list__pagination"
        showSizeChanger={false}
        pageSize={20}
        current={page}
        onChange={onPageChange}
        total={totalResults}
      />
    </div>
  ) : null

  return (
    <>
      {indicators}
      {content}
    </>
  )
}

export default GridList
