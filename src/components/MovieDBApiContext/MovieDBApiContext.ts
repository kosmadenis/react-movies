import React from 'react'

import MovieDBApi from '../../services/MovieDBApi'

const { Provider: MovieDBApiProvider, Consumer: MovieDBApiConsumer } =
  React.createContext(new MovieDBApi())

export { MovieDBApiProvider, MovieDBApiConsumer }
