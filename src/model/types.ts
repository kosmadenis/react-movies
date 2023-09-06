export interface MovieData {
  id: number
  posterPath?: string
  title?: string
  overview?: string
  releaseDate?: Date
  genres?: number[]
  score?: number
}

export interface ApiSearchResult {
  totalResults: number
  movies: MovieData[]
}
