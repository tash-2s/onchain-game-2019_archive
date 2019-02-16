import * as React from "react"

// most errors should be caught in Template's error handling
export class TopLevelErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: any) {
    // TODO: log error
  }

  render = () => {
    if (this.state.hasError) {
      const clickHandle = () => window.location.replace("/")
      return (
        <div>
          <p>Something went wrong on top-level.</p>

          <button onClick={clickHandle}>Reload</button>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}
