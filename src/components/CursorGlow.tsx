import { useEffect } from 'react'
export default function CursorGlow() {
  useEffect(() => {
    const move = (e: MouseEvent) => { document.documentElement.style.setProperty('--mx', `${e.clientX}px`); document.documentElement.style.setProperty('--my', `${e.clientY}px`) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <div className="cursor-glow" aria-hidden="true" />
}
