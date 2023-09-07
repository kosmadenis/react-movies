import React from 'react'
import { ConfigProvider, Tabs } from 'antd'

import type { GenreNames } from '../../model/types'
import MovieDBApi from '../../services/MovieDBApi'
import { MovieDBApiConsumer, MovieDBApiProvider } from '../MovieDBApiContext'
import { GenreNamesProvider } from '../GenreNamesContext'
import Search from '../Search'
import Rated from '../Rated'

import './app.css'

interface Props {}

interface State {
  genreNames: GenreNames
}

const App = class extends React.Component<Props, State> {
  movieDBApi: MovieDBApi

  constructor(props: Props) {
    super(props)

    this.movieDBApi = new MovieDBApi()

    this.state = {
      genreNames: {},
    }
  }

  override componentDidMount() {
    this.movieDBApi
      .getGenreNames()
      .then((genreNames) => this.setState({ genreNames }))
      // Смысла показыввать оошибку пользователю нет - просто не будут показываться жанры
      .catch(console.error)
  }

  override render() {
    const { genreNames } = this.state

    const tabs = [
      {
        label: 'Search',
        key: '0',
        children: (
          <MovieDBApiConsumer>
            {({ search }) => <Search apiSearch={search} />}
          </MovieDBApiConsumer>
        ),
      },
      {
        label: 'Rated',
        key: '1',
        children: <Rated />,
      },
    ]

    return (
      <ConfigProvider theme={{ token: { fontFamily: 'Inter' } }}>
        <MovieDBApiProvider value={this.movieDBApi}>
          <GenreNamesProvider value={genreNames}>
            <Tabs className="container" centered defaultActiveKey="0" items={tabs} />
          </GenreNamesProvider>
        </MovieDBApiProvider>
      </ConfigProvider>
    )
  }
}

export default App
