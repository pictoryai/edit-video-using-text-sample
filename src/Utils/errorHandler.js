import { useState } from "react";

const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
  };

  const handleClose = () => {
    setError(null);
  };

  return {
    error,
    showError,
    handleClose,
  };
};

export default useErrorHandler;
