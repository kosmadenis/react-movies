import React from 'react'
import { format } from 'date-fns'
import { Rate } from 'antd'

import './card.css'
import { IMAGE_BASE_URL } from '../../consts'
import type { MovieData } from '../../model/types'
import EllipsizedText from '../EllipsizedText/EllipsizedText'
import { GenreNamesConsumer } from '../GenreNamesContext'

import { getScoreColor } from './util'
import Tags from './Tags'

interface Props extends MovieData {}

const Card: React.FC<Props> = ({
  posterPath,
  title,
  overview,
  releaseDate,
  genres,
  score,
}) => {
  const formattedDate = releaseDate
    ? format(releaseDate, 'MMMM d, yyyy')
    : 'Date N/A'

  const titleText = title ?? '<No title>'

  const overviewText = overview ?? 'Overview not available'

  const scoreColor = getScoreColor(score)

  const imgSrc = posterPath ? `${IMAGE_BASE_URL}original${posterPath}` : undefined

  return (
    <div className="card">
      <img className="card__poster" alt="Movie poster" src={imgSrc} />
      <h1 className="card__title">{titleText}</h1>
      <h2 className="card__date">{formattedDate}</h2>
      <GenreNamesConsumer>
        {(genreNames) => (
          <Tags
            className="card__genres"
            tagClassName="card__genre"
            genres={genres}
            genreNames={genreNames}
          />
        )}
      </GenreNamesConsumer>
      <EllipsizedText className="card__overview" text={overviewText} />
      <div className="card__score" style={{ borderColor: scoreColor }}>
        {score ? score.toFixed(1) : 'N/A'}
      </div>
      <Rate className="card__rate" allowHalf count={10} />
    </div>
  )
}

export default Card
