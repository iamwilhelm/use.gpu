import { useState } from 'react'
import { HTML, LiveCanvas } from '@use-gpu/react';
import { AutoCanvas, WebGPU } from '@use-gpu/workbench';
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React + Use.GPU!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <div className="App-canvas">
				
					<LiveCanvas>{
						(canvas: HTMLCanvasElement) => 
							<WebGPU fallback={(error: Error) => (
								<HTML>
									<div>WebGPU not available - {error.toString()}.</div>
								</HTML>
							)}>
								<AutoCanvas canvas={canvas}>
									
								</AutoCanvas>
							</WebGPU>
					}</LiveCanvas>

        </div>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
