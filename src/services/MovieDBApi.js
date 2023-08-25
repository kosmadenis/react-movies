import { apiBaseUrl } from '../consts'

async function callApi(path, method = 'GET') {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path

  const url = apiBaseUrl + normalizedPath

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: process.env.REACT_APP_TMDB_TOKEN,
    },
  })

  if (!response.ok) {
    throw new Error(`Error fetching API: non-2xx HTTP code (${response.status})`)
  }

  const data = await response.json()

  return data
}

export async function search(query, page) {
  const data = await callApi(`search/movie?query=${query}&page=${page}`)

  const movies = data.results.map((result) => ({
    id: result.id,
    posterPath: result.poster_path,
    title: result.title,
    overview: result.overview,
    releaseDate: result.release_date ? new Date(result.release_date) : null,
    genres: result.genre_ids,
    score: result.vote_average,
  }))

  return {
    totalResults: data.total_results,
    movies,
  }
}

export async function a() {
  //
}
