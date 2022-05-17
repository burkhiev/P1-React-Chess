import classNames from 'classnames'
import React from 'react'
import { FigureNames } from '../models/enums/FigureNames'
import { ICell } from '../models/interfaces/ICell'
import { FigureComponent } from './FigureComponent'

const cellClasses = classNames(
    'border',
    'border-secondary',
    'cell'
)

interface ICellComponentProps {
    cell: ICell
}

export default function CellComponent(props: ICellComponentProps) {
    const figure = props.cell.figure
    let content = <></>
    
    if (figure) {
        content = <FigureComponent figure={figure} />
    }

    return (
        <div className={cellClasses}>
            {content}
        </div>
    )
}
