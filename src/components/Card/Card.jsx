import React from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { Rate, Tag } from 'antd'

import './card.css'
import { calculateScoreColor, limitText } from '../../util'
import { IMAGE_BASE_URL } from '../../consts'

function Card({
  genreNames,

  posterPath,
  title,
  overview,
  releaseDate,
  genres,
  score,
}) {
  const genreElements = genres
    .map((genreId) => ({ id: genreId, text: genreNames[genreId] }))
    .filter((genreObj) => genreObj.text !== undefined)
    .map((genreObj) => (
      <Tag key={genreObj.id} className="card__genre">
        {genreObj.text}
      </Tag>
    ))

  const formattedDate = releaseDate
    ? format(releaseDate, 'MMMM d, yyyy')
    : 'Date N/A'

  const overviewText = limitText(overview, 200)

  const scoreColor = calculateScoreColor(score)
  const scoreColorText = `rgb(${scoreColor.r} ${scoreColor.g} ${scoreColor.b})`

  const imgSizes = posterPath ? '(max-width: 999px) 92px, 185px' : null
  const imgSrcSet = posterPath
    ? `${IMAGE_BASE_URL}w92${posterPath} 92w, ${IMAGE_BASE_URL}w185${posterPath} 185w`
    : null
  const imgSrc = posterPath ? `${IMAGE_BASE_URL}original${posterPath}` : null

  return (
    <div className="card">
      <img
        className="card__poster"
        alt="Movie poster"
        sizes={imgSizes}
        srcSet={imgSrcSet}
        src={imgSrc}
      />
      <h1 className="card__title">{title}</h1>
      <h2 className="card__date">{formattedDate}</h2>
      <ul className="card__genres">{genreElements}</ul>
      <p className="card__overview">{overviewText}</p>
      <div className="card__score" style={{ borderColor: scoreColorText }}>
        {score.toFixed(1)}
      </div>
      <Rate className="card__rate" allowHalf count={10} />
    </div>
  )
}

Card.defaultProps = {
  genreNames: {},

  posterPath: null,
  releaseDate: null,
}

Card.propTypes = {
  genreNames: PropTypes.objectOf(PropTypes.string),

  posterPath: PropTypes.string,
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  releaseDate: PropTypes.instanceOf(Date),
  genres: PropTypes.arrayOf(PropTypes.number).isRequired,
  score: PropTypes.number.isRequired,
}

export default Card
