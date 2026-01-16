import { memo, Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { useVideoTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { ControlPanel } from './ControlPanel'
import type { RichVideoPlayerProps } from './types'

export type { RichVideoPlayerProps } from './types'

const DEFAULT_POSITION: [number, number, number] = [0, 2, -5]
const DEFAULT_ROTATION: [number, number, number] = [0, 0, 0]
const DEFAULT_WIDTH = 4

const VideoPlayerInner = memo(
  ({
    id,
    position = DEFAULT_POSITION,
    rotation = DEFAULT_ROTATION,
    width = DEFAULT_WIDTH,
    url = '',
    playing: initialPlaying = true,
    muted = true,
    volume: initialVolume = 1,
  }: RichVideoPlayerProps & { url: string }) => {
    const [playing, setPlaying] = useState(initialPlaying)
    const [volume, setVolume] = useState(initialVolume)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)

    const screenHeight = width * (9 / 16)

    const texture = useVideoTexture(url, {
      muted,
      loop: true,
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
          console.error('Video play error:', err)
        })
      } else {
        video.pause()
      }
    }, [playing])

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      video.volume = Math.max(0, Math.min(1, volume))
    }, [volume])

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      const handleLoadedMetadata = () => {
        setDuration(video.duration || 0)
      }

      if (video.duration) {
        setDuration(video.duration)
      }

      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }, [texture])

    useFrame(() => {
      const video = videoRef.current
      if (!video || !video.duration) return

      const currentProgress = video.currentTime / video.duration
      setProgress(currentProgress)
    })

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

    const handleSeek = useCallback((time: number) => {
      const video = videoRef.current
      if (!video) return
      video.currentTime = time
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
          progress={progress}
          duration={duration}
          volume={volume}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
        />
      </group>
    )
  }
)

VideoPlayerInner.displayName = 'VideoPlayerInner'

export const RichVideoPlayer = memo(
  ({
    id,
    position = DEFAULT_POSITION,
    rotation = DEFAULT_ROTATION,
    width = DEFAULT_WIDTH,
    url,
    ...props
  }: RichVideoPlayerProps) => {
    const screenHeight = width * (9 / 16)

    if (!url) {
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
        <VideoPlayerInner
          id={id}
          position={position}
          rotation={rotation}
          width={width}
          url={url}
          {...props}
        />
      </Suspense>
    )
  }
)

RichVideoPlayer.displayName = 'RichVideoPlayer'
