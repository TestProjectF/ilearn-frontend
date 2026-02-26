import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <p className="text-5xl mb-4">⚠️</p>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            Có lỗi xảy ra
                        </h2>
                        <p className="text-gray-500 mb-4">
                            Vui lòng tải lại trang
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Tải lại
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}