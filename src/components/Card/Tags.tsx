import React from 'react'
import { Tag } from 'antd'

import type { GenreNames } from '../../model/types'

interface Props {
  className?: string
  tagClassName?: string
  genres?: number[]
  genreNames: GenreNames
}

const Tags: React.FC<Props> = ({ className, tagClassName, genreNames, genres }) => {
  const genreElements = genres
    ? genres
        .map((genreId) => ({ id: genreId, text: genreNames[genreId] }))
        .filter((genreObj) => genreObj.text !== undefined)
        .map((genreObj) => (
          <Tag key={genreObj.id} className={tagClassName}>
            {genreObj.text}
          </Tag>
        ))
    : []

  return <ul className={className}>{genreElements}</ul>
}

export default Tags
