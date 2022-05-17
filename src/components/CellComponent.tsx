import classNames from 'classnames'
import React from 'react'
import { IFigure } from '../models/interfaces/IFigure'

const cellClasses = classNames(
    'col-1',
    'border',
    'border-secondary'
)

interface ICellComponentProps {
    figure?: IFigure
}

export default function CellComponent(props: ICellComponentProps) {
  return (
      <div className={cellClasses}>Cell</div>
  )
}
