import { useEffect } from 'react'
export default function CursorGlow() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const move = (event: MouseEvent) => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mx', `${event.clientX}px`)
        document.documentElement.style.setProperty('--my', `${event.clientY}px`)
        frame = 0
      })
    }
    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
  return <div className="cursor-glow" aria-hidden="true" />
}
