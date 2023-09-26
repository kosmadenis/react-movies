import React from 'react'
import { Alert, ConfigProvider, Tabs } from 'antd'

import type { GenreNames } from '../../model/types'
import MovieDBApi from '../../services/MovieDBApi'
import { MovieDBProvider } from '../MovieDBContext'
import Search from '../Search'
import Rated from '../Rated'

import './app.css'

interface Props {}

interface State {
  genreNames: GenreNames
  sessionId: string | null
  online: boolean
  tab: string
}

const App = class extends React.Component<Props, State> {
  movieDBApi: MovieDBApi

  constructor(props: Props) {
    super(props)

    this.movieDBApi = new MovieDBApi()

    this.state = {
      genreNames: {},
      sessionId: null,
      online: window.navigator.onLine,
      tab: '0',
    }
  }

  override componentDidMount() {
    window.addEventListener('online', this.onOnline)
    window.addEventListener('offline', this.onOffline)

    this.movieDBApi
      .getGenreNames()
      .then((genreNames) => this.setState({ genreNames }))
      .catch(() => {})

    this.movieDBApi
      .createGuestSession()
      .then((sessionId) => this.setState({ sessionId }))
      .catch(() => {})
  }

  override componentWillUnmount() {
    window.removeEventListener('online', this.onOnline)
    window.removeEventListener('offline', this.onOffline)
  }

  onOnline = () => {
    this.setState({ online: true })
  }

  onOffline = () => {
    this.setState({ online: false })
  }

  override render() {
    const { genreNames, sessionId, online, tab } = this.state

    let content

    if (!online) {
      content = (
        <Alert
          showIcon
          message="Currently offline"
          type="warning"
          className="offline-alert"
        />
      )
    } else {
      const tabs = [
        {
          label: 'Search',
          key: '0',
          children: <Search apiSearch={this.movieDBApi.search} />,
        },
        {
          label: 'Rated',
          disabled: !sessionId,
          key: '1',
          children: (
            <Rated
              apiRated={this.movieDBApi.getRated}
              sessionId={sessionId || ''}
              active={tab === '1'}
            />
          ),
        },
      ]

      const movieDBContext = {
        api: this.movieDBApi,
        genreNames,
        sessionId,
      }

      content = (
        <MovieDBProvider value={movieDBContext}>
          <Tabs
            activeKey={tab}
            className="container"
            centered
            items={tabs}
            onChange={(newTab) => this.setState({ tab: newTab })}
          />
        </MovieDBProvider>
      )
    }

    return (
      <ConfigProvider theme={{ token: { fontFamily: 'Inter' } }}>
        {content}
      </ConfigProvider>
    )
  }
}

export default App
