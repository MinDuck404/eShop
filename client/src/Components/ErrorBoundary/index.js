import React from "react";

// Catches render errors so a single broken component doesn't blank the whole page
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container text-center" style={{ padding: "80px 15px" }}>
          <h3>Đã xảy ra lỗi khi hiển thị trang.</h3>
          <p>Vui lòng tải lại trang hoặc thử lại sau.</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.assign("/")}
          >
            Về trang chủ
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
