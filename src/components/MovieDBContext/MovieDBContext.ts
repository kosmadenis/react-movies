import React from 'react'

import MovieDBApi from '../../services/MovieDBApi'
import type { GenreNames } from '../../model/types'

export interface MovieDBContext {
  api: MovieDBApi
  genreNames: GenreNames
  sessionId: string | null
}

const { Provider: MovieDBProvider, Consumer: MovieDBConsumer } =
  React.createContext<MovieDBContext>({
    api: new MovieDBApi(),
    genreNames: {},
    sessionId: null,
  })

export { MovieDBProvider, MovieDBConsumer }
