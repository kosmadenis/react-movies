import React, { PureComponent } from 'react'
import { format } from 'date-fns'
import { Rate } from 'antd'

import './card.css'
import { IMAGE_BASE_URL } from '../../consts'
import type { GenreNames, MovieData } from '../../model/types'
import EllipsizedText from '../EllipsizedText/EllipsizedText'
import { ReactComponent as IconImage } from '../../images/icon-image.svg'
import type MovieDBApi from '../../services/MovieDBApi'

import Tags from './Tags'

function getScoreColor(score?: number): string {
  if (!score) {
    return '#00000033'
  }

  if (score <= 3) {
    return '#E90000'
  }

  if (score <= 5) {
    return '#E97E00'
  }

  if (score <= 7) {
    return '#E9D100'
  }

  return '#66E900'
}

interface Props extends MovieData {
  genreNames: GenreNames
  sessionId: string | null
  api: MovieDBApi
}

const Card = class extends PureComponent<Props> {
  override render() {
    const {
      id: number,
      posterPath,
      title,
      overview,
      releaseDate,
      genres,
      score,
      rating,

      genreNames,
      sessionId,
      api,
    } = this.props

    const formattedDate = releaseDate
      ? format(releaseDate, 'MMMM d, yyyy')
      : 'Date N/A'

    const titleText = title ?? '<No title>'

    const overviewText = overview ?? 'Overview not available'

    const scoreColor = getScoreColor(score)

    const img = posterPath ? (
      <img
        className="card__poster"
        alt="Movie poster"
        src={`${IMAGE_BASE_URL}original${posterPath}`}
      />
    ) : (
      <div className="card__poster card__poster--placeholder">
        <IconImage />
      </div>
    )

    return (
      <div className="card">
        {img}
        <h1 className="card__title">{titleText}</h1>
        <h2 className="card__date">{formattedDate}</h2>
        <Tags
          className="card__genres"
          tagClassName="card__genre"
          genres={genres}
          genreNames={genreNames}
        />
        <EllipsizedText className="card__overview" text={overviewText} />
        <div className="card__score" style={{ borderColor: scoreColor }}>
          {score ? score.toFixed(1) : 'N/A'}
        </div>
        <Rate
          className="card__rate"
          value={rating}
          disabled={!sessionId}
          allowClear={false}
          allowHalf
          count={10}
          onChange={(val) => sessionId && api.addRating(sessionId, number, val)}
        />
      </div>
    )
  }
}

export default Card
