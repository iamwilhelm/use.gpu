import React from '@use-gpu/live/jsx';
import { render } from '@use-gpu/live';

window.onload = async () => {
  const { App } = await import('./app');
  render(<App />);
}
