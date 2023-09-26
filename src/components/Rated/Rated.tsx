import React, { Component } from 'react'

import GridList from '../GridList'
import type { MovieData, MovieList } from '../../model/types'

interface Props {
  apiRated: (sessionId: string, page: number) => Promise<MovieList>
  sessionId: string
  active: boolean
}

interface State {
  error: boolean
  loading: boolean
  page: number
  totalResults: number
  movies: MovieData[]
}

const Rated = class extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      error: false,
      loading: false,
      page: 1,
      totalResults: 0,
      movies: [],
    }
  }

  override componentDidMount() {
    this.fetchRated()
  }

  override componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ) {
    const { active } = this.props
    const { page } = this.state

    if (page !== prevState.page || (active && !prevProps.active)) {
      this.fetchRated()
    }
  }

  fetchRated = () => {
    const { page } = this.state

    this.setState({
      loading: true,
      error: false,
      totalResults: 0,
      movies: [],
    })

    const { apiRated, sessionId } = this.props

    apiRated(sessionId, page).then(
      (movies) => this.setState({ ...movies, loading: false }),
      () => this.setState({ error: true })
    )
  }

  onPageChange = (page: number) => {
    this.setState({ page })
  }

  override render() {
    const { error, loading, page, movies, totalResults } = this.state

    return (
      <GridList
        empty={!movies.length && 'No rated movies'}
        loading={loading}
        error={error && 'Error getting rated movies'}
        totalResults={totalResults}
        movies={movies}
        page={page}
        onPageChange={this.onPageChange}
      />
    )
  }
}

export default Rated
