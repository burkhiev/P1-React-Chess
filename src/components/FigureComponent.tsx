import React from 'react'
import { Colors } from '../models/enums/Colors'
import { FigureNames } from '../models/enums/FigureNames'
import { IFigure } from '../models/interfaces/IFigure'

interface IFigureComponentProps {
    figure: IFigure
}

export const FigureComponent = (props: IFigureComponentProps) => {
    const { figure } = props
    const stringFigure = FigureNames[figure.figureName]

    return (
        <div>{stringFigure}</div>
    )
}
