import React, { Component } from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash-es'

import type { MovieList, MovieData } from '../../model/types'
import GridList from '../GridList'

interface Props {
  apiSearch: (query: string, page: number) => Promise<MovieList>
}

interface State {
  inputText: string
  searchText: string
  error: boolean
  loading: boolean
  page: number
  totalResults: number
  movies: MovieData[]
}

const DEBOUNCE_DELAY = 500

const Search = class extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      inputText: '',
      searchText: '',

      error: false,
      loading: false,

      page: 1,

      totalResults: 0,
      movies: [],
    }
  }

  override componentDidUpdate(prevProps: Props, prevState: State) {
    const { inputText, page, searchText } = this.state

    if (page !== prevState.page && searchText === prevState.searchText) {
      this.fetchSearchDebounce.cancel()
      this.fetchSearch()
    } else if (inputText !== prevState.inputText) {
      if (inputText === searchText) {
        this.fetchSearchDebounce.cancel()
      } else {
        this.fetchSearchDebounce()
      }
    }
  }

  override componentWillUnmount() {
    this.fetchSearchDebounce.cancel()
  }

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value
    this.setState({ inputText })
  }

  onPageChange = (page: number) => {
    this.setState({ page })
  }

  fetchSearch = () => {
    const { inputText, page, searchText } = this.state

    const hasText = !!inputText

    const newPage = inputText === searchText ? page : 1

    this.setState({
      searchText: inputText,
      page: newPage,
      loading: hasText,
      error: false,
      totalResults: 0,
      movies: [],
    })

    if (hasText) {
      const { apiSearch } = this.props
      apiSearch(inputText, newPage).then(
        (data) => this.setState({ ...data, loading: false }),
        () => this.setState({ error: true })
      )
    }
  }

  // eslint-disable-next-line react/sort-comp
  fetchSearchDebounce = debounce(this.fetchSearch, DEBOUNCE_DELAY)

  override render() {
    const { inputText, searchText, loading, error, page, movies, totalResults } =
      this.state

    return (
      <section className="search">
        <Input
          placeholder="Type to search..."
          value={inputText}
          onChange={this.onInputChange}
        />
        <GridList
          empty={!!searchText && 'No movies were found'}
          loading={loading}
          error={error && 'Error searching movies'}
          totalResults={totalResults}
          movies={movies}
          page={page}
          onPageChange={this.onPageChange}
        />
      </section>
    )
  }
}

export default Search
