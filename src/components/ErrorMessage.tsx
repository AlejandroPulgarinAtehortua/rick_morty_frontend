import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className }) => (
  <div className={`flex flex-col items-center justify-center text-red-500 gap-2 ${className || ''}`}>
    <span>{message}</span>
    {onRetry && (
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-1 rounded shadow"
        onClick={onRetry}
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorMessage;
