import React from 'react';

interface IErrorBoundaryProps {
    children: any
}

interface IErrorBoundaryState {
    hasError: boolean
}

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: any, info: any) {
        this.setState({ hasError: true });
        console.error(info)
    }

    render() {
        if (this.state.hasError) {
            return (<h2>Что-то пошло не так ...</h2>)
        }

        return (
            <React.StrictMode>
                {this.props.children}
            </React.StrictMode>
        )
    }
}