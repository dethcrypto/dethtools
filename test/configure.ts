import { configure } from '@testing-library/react';

configure({
  getElementError(message) {
    // Removes the huge html output from the error message
    if (message) {
      const error = new Error(message);
      error.name = 'TestingLibraryElementError';
      error.stack = undefined;
      return error;
    } else {
      return new Error();
    }
  },
});
