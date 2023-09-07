import React from 'react'

import type { GenreNames } from '../../model/types'

const { Provider: GenreNamesProvider, Consumer: GenreNamesConsumer } =
  React.createContext<GenreNames>({})

export { GenreNamesProvider, GenreNamesConsumer }
