export default function getCanvasMouseCoords(evt, canvas) {
  const rect = canvas.getBoundingClientRect()
  const x = evt.clientX - rect.left
  const y = evt.clientY - rect.top
  return {
    x,
    y
  }
}
