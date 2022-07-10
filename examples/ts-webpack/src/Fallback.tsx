import React, { into } from 'react';

export const makeFallback = (error: Error) =>
  into(<div className="error-message">{error.toString()}</div>);