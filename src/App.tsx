import React from 'react'
import classnames from 'classnames'

import { ErrorBoundary } from './services/ErrorBoundary'
import { ChessboardComponent } from './components/ChessboardComponent'

const classes = classnames(
    'container',
    'border',
    'border-1',
    'mt-5',
    'bg-light'
)

export const App = () => {
    return (
        <ErrorBoundary>
            <div className={classes}>
                <ChessboardComponent />
            </div>
        </ErrorBoundary>
    )
}