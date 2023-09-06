import React from 'react'
import { format } from 'date-fns'
import { Rate, Tag } from 'antd'

import './card.css'
import { calculateScoreColor, limitText } from '../../util'
import { IMAGE_BASE_URL } from '../../consts'
import type { MovieData } from '../../model/types'

interface Props extends MovieData {
  genreNames: { [index: number]: string }
}

const Card: React.FC<Props> = ({
  genreNames,
  posterPath,
  title,
  overview,
  releaseDate,
  genres,
  score,
}) => {
  const genreElements = genres
    ? genres
        .map((genreId) => ({ id: genreId, text: genreNames[genreId] }))
        .filter((genreObj) => genreObj.text !== undefined)
        .map((genreObj) => (
          <Tag key={genreObj.id} className="card__genre">
            {genreObj.text}
          </Tag>
        ))
    : []

  const formattedDate = releaseDate
    ? format(releaseDate, 'MMMM d, yyyy')
    : 'Date N/A'

  const overviewText = overview ? limitText(overview, 200) : 'Overview not available'

  const scoreColor = calculateScoreColor(score ?? 0)
  const scoreColorText = `rgb(${scoreColor.r} ${scoreColor.g} ${scoreColor.b})`

  const imgSrc = posterPath ? `${IMAGE_BASE_URL}original${posterPath}` : undefined

  return (
    <div className="card">
      <img className="card__poster" alt="Movie poster" src={imgSrc} />
      <h1 className="card__title">{title}</h1>
      <h2 className="card__date">{formattedDate}</h2>
      <ul className="card__genres">{genreElements}</ul>
      <p className="card__overview">{overviewText}</p>
      <div className="card__score" style={{ borderColor: scoreColorText }}>
        {(score ?? 0).toFixed(1)}
      </div>
      <Rate className="card__rate" allowHalf count={10} />
    </div>
  )
}

export default Card
