import React, { PropsWithChildren, ErrorInfo } from "react";

interface ErrorBoundaryState {
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

function logErrorToMyService(error: Error, errorInfo: ErrorInfo) {
    console.log(error, '->', errorInfo);
}

export default class ErrorBoundary<P> extends React.Component<PropsWithChildren<P>, ErrorBoundaryState> {
    state: Readonly<ErrorBoundaryState> = {
        error: null,
        errorInfo: null,
    };

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI.
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        logErrorToMyService(error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.error !== null) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h3>Something went wrong: {this.state.error.toString()}</h3>
                    <p>Error Info: {this.state.errorInfo?.componentStack}</p>
                </div>
            );
        }

        return this.props.children;
    }
}
