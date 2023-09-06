import { API_BASE_URL } from '../consts'
import type { ApiSearchResult, MovieData } from '../model/types'

async function callApi(path: string, method = 'GET'): Promise<any> {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path

  const url = API_BASE_URL + normalizedPath

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: process.env.REACT_APP_TMDB_TOKEN ?? '',
    },
  })

  if (!response.ok) {
    throw new Error(`Error fetching API: non-2xx HTTP code (${response.status})`)
  }

  const data = await response.json()

  return data
}

export async function search(query: string, page: number): Promise<ApiSearchResult> {
  const data = await callApi(`search/movie?query=${query}&page=${page}`)

  if (typeof data !== 'object' || data === null) {
    throw new Error('Api returned invalid data')
  }

  const { results } = data

  const movies: MovieData[] = []
  if (Array.isArray(results)) {
    for (const result of results) {
      const {
        id,
        poster_path, // eslint-disable-line @typescript-eslint/naming-convention
        title,
        overview,
        release_date, // eslint-disable-line @typescript-eslint/naming-convention
        genre_ids, // eslint-disable-line @typescript-eslint/naming-convention
        vote_average, // eslint-disable-line @typescript-eslint/naming-convention
      } = result

      if (typeof id !== 'number') {
        continue
      }

      const movie: MovieData = { id }

      if (typeof poster_path === 'string') {
        movie.posterPath = poster_path
      }

      if (typeof title === 'string') {
        movie.title = title
      }

      if (typeof overview === 'string') {
        movie.overview = overview
      }

      if (typeof release_date === 'number') {
        movie.releaseDate = new Date(release_date)
      }

      if (
        Array.isArray(genre_ids) &&
        genre_ids.every((val) => typeof val === 'number')
      ) {
        movie.genres = genre_ids
      }

      if (typeof vote_average === 'number') {
        movie.score = vote_average
      }
    }
  }

  return {
    totalResults: typeof data.total_results === 'number' ? data.total_results : 0,
    movies,
  }
}
