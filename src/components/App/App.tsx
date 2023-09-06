import React from 'react'
import { ConfigProvider, Tabs } from 'antd'

import Search from '../Search'
import Rated from '../Rated'

import './app.css'

interface Props {}

interface State {
  genreNames: { [index: number]: string }
}

const App = class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      genreNames: {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western',
      },
    }
  }

  override render() {
    const { genreNames } = this.state

    const tabs = [
      {
        label: 'Search',
        key: '0',
        children: <Search genreNames={genreNames} />,
      },
      {
        label: 'Rated',
        key: '1',
        children: <Rated />,
      },
    ]

    return (
      <ConfigProvider theme={{ token: { fontFamily: 'Inter' } }}>
        <Tabs className="container" centered defaultActiveKey="0" items={tabs} />
      </ConfigProvider>
    )
  }
}

export default App
