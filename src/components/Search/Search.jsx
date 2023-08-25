import React, { Component } from 'react'
import { Alert, Input, Spin } from 'antd'
import PropTypes from 'prop-types'

import * as Api from '../../services/MovieDBApi'

import './search.css'
import SearchResults from './SearchResults'

class Search extends Component {
  constructor() {
    super()

    this.state = {
      error: false,
      loading: false,
      online: window.navigator.onLine,

      totalResults: 0,
      movies: [],
    }
  }

  componentDidMount() {
    window.addEventListener('online', this.onOnline)
    window.addEventListener('offline', this.onOffline)

    this.setState({ loading: true, error: false })

    Api.search('return', 1)
      .then((data) => this.setState({ ...data, loading: false }))
      .catch(() => this.setState({ totalResults: 0, movies: [], error: true }))
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.onOnline)
    window.removeEventListener('offline', this.onOffline)
  }

  onOnline = () => {
    this.setState({ online: true })
  }

  onOffline = () => {
    this.setState({ online: false })
  }

  render() {
    const { online, loading, error, movies, totalResults } = this.state
    const { genreNames } = this.props

    const resutsData = {
      genreNames,
      totalResults,
      movies,
    }

    const showOffline = !online
    const showError = online && error
    const showLoading = online && !error && loading
    const showResults = online && !error && !loading

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

    const results = showResults ? <SearchResults {...resutsData} /> : null

    const input = online ? <Input placeholder="Type to search..." /> : null

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

Search.defaultProps = {
  genreNames: {},
}

Search.propTypes = {
  genreNames: PropTypes.objectOf(PropTypes.string),
}

export default Search
