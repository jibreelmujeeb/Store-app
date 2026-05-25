import { Component } from "react";
import { ErrorState } from "./ui/state";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-50 p-6">
          <ErrorState error={this.state.error} title="The app failed to render" />
        </div>
      );
    }
    return this.props.children;
  }
}
