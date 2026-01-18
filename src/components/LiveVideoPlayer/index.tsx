import { memo, Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { useVideoTexture } from '@react-three/drei'
import { ControlPanel } from './ControlPanel'
import type { LiveVideoPlayerProps } from './types'

export type { LiveVideoPlayerProps } from './types'

const DEFAULT_POSITION: [number, number, number] = [0, 2, -5]
const DEFAULT_ROTATION: [number, number, number] = [0, 0, 0]
const DEFAULT_WIDTH = 4

const LiveVideoPlayerInner = memo(
  ({
    id,
    position = DEFAULT_POSITION,
    rotation = DEFAULT_ROTATION,
    width = DEFAULT_WIDTH,
    url = '',
    playing: initialPlaying = true,
    volume: initialVolume = 1,
    onError,
    onUrlChange,
  }: LiveVideoPlayerProps & { url: string; onUrlChange: (url: string) => void }) => {
    const [playing, setPlaying] = useState(initialPlaying)
    const [volume, setVolume] = useState(initialVolume)
    const [isBuffering, setIsBuffering] = useState(false)

    const screenHeight = width * (9 / 16)

    const texture = useVideoTexture(url, {
      muted: false,
      loop: false,
      start: playing,
    })

    const videoRef = useRef<HTMLVideoElement>(texture.image as HTMLVideoElement)

    useEffect(() => {
      videoRef.current = texture.image as HTMLVideoElement
    }, [texture])

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      if (playing) {
        video.play().catch((err) => {
          console.error('Live video play error:', err)
          onError?.(err)
        })
      } else {
        video.pause()
      }
    }, [playing, onError])

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      video.volume = Math.max(0, Math.min(1, volume))
    }, [volume])

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      const handleWaiting = () => setIsBuffering(true)
      const handlePlaying = () => setIsBuffering(false)
      const handleCanPlay = () => setIsBuffering(false)
      const handleError = (e: Event) => {
        const error = (e.target as HTMLVideoElement).error
        if (error) {
          console.error('Live video error:', error.message)
          onError?.(new Error(error.message))
        }
      }

      video.addEventListener('waiting', handleWaiting)
      video.addEventListener('playing', handlePlaying)
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)

      return () => {
        video.removeEventListener('waiting', handleWaiting)
        video.removeEventListener('playing', handlePlaying)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    }, [texture, onError])

    useEffect(() => {
      const video = texture.image as HTMLVideoElement
      return () => {
        video.pause()
        video.src = ''
        video.load()
      }
    }, [texture])

    const handlePlayPause = useCallback(() => {
      setPlaying((prev) => !prev)
    }, [])

    const handleVolumeChange = useCallback((newVolume: number) => {
      setVolume(newVolume)
    }, [])

    return (
      <group position={position} rotation={rotation}>
        {/* 画面本体 */}
        <mesh>
          <planeGeometry args={[width, screenHeight]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        {/* コントロールパネル */}
        <ControlPanel
          id={id}
          width={width}
          screenHeight={screenHeight}
          playing={playing}
          volume={volume}
          isBuffering={isBuffering}
          currentUrl={url}
          onPlayPause={handlePlayPause}
          onVolumeChange={handleVolumeChange}
          onUrlChange={onUrlChange}
        />
      </group>
    )
  }
)

LiveVideoPlayerInner.displayName = 'LiveVideoPlayerInner'

export const LiveVideoPlayer = memo(
  ({
    id,
    position = DEFAULT_POSITION,
    rotation = DEFAULT_ROTATION,
    width = DEFAULT_WIDTH,
    url: initialUrl,
    ...props
  }: LiveVideoPlayerProps) => {
    const [currentUrl, setCurrentUrl] = useState(initialUrl)
    const screenHeight = width * (9 / 16)

    const handleUrlChange = useCallback((newUrl: string) => {
      setCurrentUrl(newUrl)
    }, [])

    if (!currentUrl) {
      return (
        <group position={position} rotation={rotation}>
          <mesh>
            <planeGeometry args={[width, screenHeight]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      )
    }

    return (
      <Suspense
        fallback={
          <group position={position} rotation={rotation}>
            <mesh>
              <planeGeometry args={[width, screenHeight]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
          </group>
        }
      >
        <LiveVideoPlayerInner
          key={currentUrl}
          id={id}
          position={position}
          rotation={rotation}
          width={width}
          url={currentUrl}
          onUrlChange={handleUrlChange}
          {...props}
        />
      </Suspense>
    )
  }
)

LiveVideoPlayer.displayName = 'LiveVideoPlayer'
