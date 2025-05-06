
import * as React from "react"

// Define breakpoints for different devices
export const BREAKPOINTS = {
  MOBILE: 640, // sm in Tailwind
  TABLET: 768, // md in Tailwind
  LAPTOP: 1024, // lg in Tailwind
  DESKTOP: 1280, // xl in Tailwind
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsTablet(width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.LAPTOP)
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isTablet
}

export function useDevice() {
  const [device, setDevice] = React.useState<'mobile' | 'tablet' | 'laptop' | 'desktop'>('laptop')

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.MOBILE) {
        setDevice('mobile')
      } else if (width < BREAKPOINTS.LAPTOP) {
        setDevice('tablet')
      } else if (width < BREAKPOINTS.DESKTOP) {
        setDevice('laptop')
      } else {
        setDevice('desktop')
      }
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return device
}
