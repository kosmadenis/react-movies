import { API_BASE_URL, IMAGE_BASE_URL } from '../consts'
import type { MovieList, GenreNames, MovieData } from '../model/types'

function parseRawMovieList(data: any): MovieList {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Api returned invalid data')
  }

  const { results } = data

  const movies: MovieData[] = []
  if (Array.isArray(results)) {
    for (const result of results) {
      const {
        id,
        poster_path: posterPath,
        title,
        overview,
        release_date: releaseDate,
        genre_ids: genres,
        vote_average: score,
        rating,
      } = result

      if (typeof id !== 'number') {
        continue
      }

      const movie: MovieData = { id }

      if (typeof posterPath === 'string') {
        movie.posterPath = posterPath
      }

      if (typeof title === 'string') {
        movie.title = title
      }

      if (typeof overview === 'string') {
        movie.overview = overview
      }

      if (typeof releaseDate === 'string') {
        const date = new Date(releaseDate)
        if (!Number.isNaN(date.valueOf())) {
          movie.releaseDate = date
        }
      }

      if (Array.isArray(genres) && genres.every((val) => typeof val === 'number')) {
        movie.genres = genres
      }

      if (typeof score === 'number') {
        movie.score = score
      }

      if (typeof rating === 'number') {
        movie.rating = rating
      }

      movies.push(movie)
    }
  }

  return {
    totalResults: typeof data.total_results === 'number' ? data.total_results : 0,
    movies,
  }
}

class MovieDBApi {
  #apiBaseUrl: string

  #imageBaseUrl: string

  constructor(apiBaseUrl?: string, imageBaseUrl?: string) {
    this.#apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.#imageBaseUrl = imageBaseUrl ?? IMAGE_BASE_URL
  }

  getImageBaseUrl = () => {
    return this.#imageBaseUrl
  }

  async #callApi(
    path: string,
    params: { [key: string]: string },
    method = 'GET',
    body?: any
  ): Promise<any> {
    let strippedPath = path.slice()
    if (this.#apiBaseUrl.endsWith('/')) {
      while (strippedPath.startsWith('/')) {
        strippedPath = strippedPath.slice(1)
      }
    }

    const allParams = {
      ...params,
      api_key: process.env.REACT_APP_TMDB_API_KEY ?? '',
    }

    const paramsString = Object.entries(allParams)
      .map((entry) => entry.map((part) => encodeURIComponent(part)).join('='))
      .join('&')

    const url = `${this.#apiBaseUrl}${strippedPath}?${paramsString}`

    const options: {
      body?: any
      method: string
      headers: { [key: string]: string }
    } = {
      method,
      headers: {
        Accept: 'application/json',
      },
    }

    if (body !== undefined) {
      options.body = JSON.stringify(body)
      options.headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`Error fetching API: non-2xx HTTP code (${response.status})`)
    }

    const data = await response.json()

    return data
  }

  search = async (query: string, page: number): Promise<MovieList> => {
    const data = await this.#callApi(`/search/movie`, {
      query,
      page: page.toString(),
    })

    return parseRawMovieList(data)
  }

  getGenreNames = async (): Promise<GenreNames> => {
    const data = await this.#callApi('/genre/movie/list', {})

    if (typeof data !== 'object' || data === null) {
      throw new Error('Api returned invalid data')
    }

    const genreNames: GenreNames = {}

    if (Array.isArray(data.genres)) {
      for (const genre of data.genres) {
        if (
          typeof genre === 'object' &&
          genre !== null &&
          typeof genre.id === 'number' &&
          typeof genre.name === 'string'
        ) {
          genreNames[genre.id] = genre.name
        }
      }
    }

    return genreNames
  }

  createGuestSession = async (): Promise<string> => {
    const data = await this.#callApi('/authentication/guest_session/new', {})

    if (typeof data !== 'object' || data === null) {
      throw new Error('Api returned invalid data')
    }

    const { success, guest_session_id: guestSessionId } = data

    if (success !== true) {
      throw new Error('Api error (unsucceful)')
    }

    if (typeof guestSessionId !== 'string') {
      throw new Error('Api returned invalid data')
    }

    return guestSessionId
  }

  addRating = async (
    sessionId: string,
    movieId: number,
    rating: number
  ): Promise<void> => {
    await this.#callApi(
      `/movie/${movieId}/rating`,
      { guest_session_id: sessionId },
      'POST',
      { value: rating }
    )
  }

  deleteRating = async (sessionId: string, movieId: number): Promise<void> => {
    await this.#callApi(
      `/movie/${movieId}/rating`,
      { guest_session_id: sessionId },
      'DELETE'
    )
  }

  getRated = async (sessionId: string, page: number): Promise<MovieList> => {
    const data = await this.#callApi(`/guest_session/${sessionId}/rated/movies`, {
      page: page.toString(),
    })
    return parseRawMovieList(data)
  }
}

export default MovieDBApi
