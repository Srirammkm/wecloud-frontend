'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const apps = [
  { name: 'Google Drive', icon: '/google-drive.png' },
  { name: 'Google Photos', icon: '/google-photos.png' },
  { name: 'Gmail', icon: '/google-gmail.png' },
  { name: 'Google Classroom', icon: '/google-classroom.png' },
  { name: 'Google Sheets', icon: '/google-sheets.png' },
  { name: 'Google Images', icon: '/google-images.png' },
  { name: 'Google Meet', icon: '/google-meet.png' },
  { name: 'Google Play', icon: '/google-play.png' },
]

export function GoogleAppsAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const animateIcons = () => {
      const icons = container.children
      for (let i = 0; i < icons.length; i++) {
        const icon = icons[i] as HTMLElement
        icon.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'
        icon.style.transform = `translateY(${Math.sin(Date.now() / 1000 + i) * 10}px)`
        icon.style.opacity = `${0.5 + Math.sin(Date.now() / 1000 + i) * 0.5}`
      }
      requestAnimationFrame(animateIcons)
    }

    const animation = requestAnimationFrame(animateIcons)

    return () => cancelAnimationFrame(animation)
  }, [])

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center items-center gap-4 my-8">
      {apps.map((app) => (
        <div key={app.name} className="w-12 h-12 md:w-16 md:h-16 transition-transform hover:scale-110">
          <Image src={app.icon} alt={app.name} width={64} height={64} />
        </div>
      ))}
    </div>
  )
}
