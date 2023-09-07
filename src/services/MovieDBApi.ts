import { API_BASE_URL, IMAGE_BASE_URL } from '../consts'
import type { ApiSearchResult, MovieData } from '../model/types'

class MovieDBApi {
  #apiBaseUrl: string

  #imageBaseUrl: string

  constructor(apiBaseUrl?: string, imageBaseUrl?: string) {
    this.#apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.#imageBaseUrl = imageBaseUrl ?? IMAGE_BASE_URL
  }

  getImageBaseUrl() {
    return this.#imageBaseUrl
  }

  async callApi(path: string, method = 'GET'): Promise<any> {
    const url = this.#apiBaseUrl + path

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

  async search(query: string, page: number): Promise<ApiSearchResult> {
    const data = await this.callApi(`search/movie?query=${query}&page=${page}`)

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

        if (typeof release_date === 'string') {
          const date = new Date(release_date)
          if (!Number.isNaN(date.valueOf())) {
            movie.releaseDate = date
          }
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

        movies.push(movie)
      }
    }

    return {
      totalResults: typeof data.total_results === 'number' ? data.total_results : 0,
      movies,
    }
  }
}

export default MovieDBApi
