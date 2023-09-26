export interface MovieData {
  id: number
  posterPath?: string
  title?: string
  overview?: string
  releaseDate?: Date
  genres?: number[]
  score?: number
  rating?: number
}

export interface MovieList {
  totalResults: number
  movies: MovieData[]
}

export type GenreNames = { [index: number]: string }
