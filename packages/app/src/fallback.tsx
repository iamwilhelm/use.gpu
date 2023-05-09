import React from 'react';

export const FALLBACK_MESSAGE = (error: Error) => <>
  <div className="error-message">{error.toString()}</div>
  <div className="help-message">
    <p><b>To enable WebGPU:</b></p>
    <ul>
      <li><b>Chrome 113+</b> – Windows, MacOS, ChromeOS ✅</li>
      <li><b>Chrome</b> – Linux, Android - Dev version required<br />Turn on <code>#enable-unsafe-webgpu</code> in <code>chrome://flags</code></li>
      <li><b>Firefox</b> – Nightly version required<br />Turn on <code>dom.webgpu.enabled</code> in <code>about:config</code></li>
    </ul>
    <p>See <a href="https://caniuse.com/webgpu">CanIUse.com</a> for more info.</p>
  </div>
</>;
