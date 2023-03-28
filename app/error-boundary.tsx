'use client'

import React, { useState, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

function ErrorBoundary({ children }: Props) {
    const [hasError, setHasError] = useState(false)

    function handleTryAgain() {
        setHasError(false)
    }

    function handleCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can use your own error logging service here
        console.log({ error, errorInfo })

        setHasError(true)
    }

    if (hasError) {
        return (
            <div>
                <h2>Oops, there is an error!</h2>
                <button
                    type="button"
                    onClick={handleTryAgain}
                >
                    Try again?
                </button>
            </div>
        )
    }

    return (
        <React.Fragment>
            {React.Children.map(children, (child) =>
                React.cloneElement(child as React.ReactElement<any>, { onError: handleCatch }),
            )}
        </React.Fragment>
    )
}

export default ErrorBoundary
