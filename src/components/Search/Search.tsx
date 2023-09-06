import React, { Component } from 'react'
import { Alert, Input, Spin } from 'antd'
import { debounce } from 'lodash-es'

import * as Api from '../../services/MovieDBApi'
import { DEBOUNCE_DELAY } from '../../consts'
import type { MovieData } from '../../model/types'
import GridList from '../GridList'

import './search.css'

interface Props {
  genreNames: { [index: number]: string }
}

interface State {
  inputText: string
  searchText: string
  error: boolean
  loading: boolean
  online: boolean
  page: number
  totalResults: number
  movies: MovieData[]
}

const Search = class extends Component<Props, State> {
  // eslint-disable-next-line react/sort-comp
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
      Api.search(inputText, newPage).then(
        (data) => this.setState({ ...data, loading: false }),
        () => this.setState({ error: true })
      )
    }
  }

  fetchSearchDebounce = debounce(this.fetchSearch, DEBOUNCE_DELAY)

  constructor(props: Props) {
    super(props)

    this.state = {
      inputText: '',
      searchText: '',

      error: false,
      loading: false,
      online: window.navigator.onLine,

      page: 1,

      totalResults: 0,
      movies: [],
    }
  }

  override componentDidMount() {
    window.addEventListener('online', this.onOnline)
    window.addEventListener('offline', this.onOffline)
  }

  override componentDidUpdate(prevProps: Props, prevState: State) {
    const { inputText, page, searchText } = this.state

    // Переключение страницы без изменения текста поиска
    // (вследствие взаимодействия с инпутами пагинации)
    if (page !== prevState.page && searchText === prevState.searchText) {
      this.fetchSearchDebounce.cancel()
      this.fetchSearch()
    }
    // Изменение текста ввода
    // (вследствие взаимодействия с инпутом поиска)
    else if (inputText !== prevState.inputText) {
      if (inputText === searchText) {
        this.fetchSearchDebounce.cancel()
      } else {
        this.fetchSearchDebounce()
      }
    }
  }

  override componentWillUnmount() {
    window.removeEventListener('online', this.onOnline)
    window.removeEventListener('offline', this.onOffline)

    this.fetchSearchDebounce.cancel()
  }

  onOnline = () => {
    this.setState({ online: true })
  }

  onOffline = () => {
    this.setState({ online: false })
  }

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value
    this.setState({ inputText })
  }

  onPageChange = (page: number) => {
    this.setState({ page })
  }

  override render() {
    const {
      inputText,
      searchText,
      online,
      loading,
      error,
      page,
      movies,
      totalResults,
    } = this.state

    const { genreNames } = this.props

    const { onPageChange } = this

    const resutsData = {
      onPageChange,
      page,
      genreNames,
      totalResults,
      movies,
    }

    const showOffline = !online
    const showError = online && error
    const showLoading = online && !error && loading
    const showResults = online && !error && !loading && !!searchText

    const offlineAlert = showOffline ? (
      <Alert
        showIcon
        message="Currently offline"
        type="warning"
        className="search__alert"
      />
    ) : null

    const errorAlert = showError ? (
      <Alert
        showIcon
        message="Error searching movies"
        type="error"
        className="search__alert"
      />
    ) : null

    const loadingSpinner = showLoading ? (
      <Spin size="large" className="search__spinner" />
    ) : null

    const results = showResults ? <GridList {...resutsData} /> : null

    const input = online ? (
      <Input
        placeholder="Type to search..."
        value={inputText}
        onChange={this.onInputChange}
      />
    ) : null

    return (
      <section className="search">
        {input}
        {offlineAlert}
        {errorAlert}
        {loadingSpinner}
        {results}
      </section>
    )
  }
}

export default Search
