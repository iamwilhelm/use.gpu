export const mount = async () => {
 
  await mountGPU();

  const el = document.querySelector('#use-gpu');
}

export const mountGPU = async () => {
  if (!navigator.gpu) throw new Error("WebGPU not supported in browser");

  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: "high-performance",
  });

  console.log({adapter});
  console.dir(adapter);

  const device = await adapter.requestDevice();
  //const device = adapter.requestDevice()
}