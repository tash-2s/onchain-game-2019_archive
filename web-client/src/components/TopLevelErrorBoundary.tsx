import * as React from "react"

// most errors should be caught in Template's error handling
export class TopLevelErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: any) {
    // should log error
  }

  render = () => {
    if (!this.state.hasError) {
      return this.props.children
    }

    const clickHandler = () => location.replace(location.pathname)
    return (
      <div>
        <p>Something went wrong on top-level.</p>
        <button onClick={clickHandler}>Reload</button>
      </div>
    )
  }
}
