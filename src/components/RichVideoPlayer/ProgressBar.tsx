import { memo, useMemo } from 'react'
import { Interactable } from '../Interactable'
import { formatTime } from './hooks'
import type { ProgressBarProps } from './types'

const SEGMENTS = 20

export const ProgressBar = memo(
  ({
    id,
    position,
    width,
    height,
    progress,
    duration,
    onSeek,
  }: ProgressBarProps) => {
    const segmentWidth = width / SEGMENTS
    const progressWidth = width * Math.min(1, Math.max(0, progress))
    const progressOffset = -width / 2 + progressWidth / 2

    const segments = useMemo(() => {
      return Array.from({ length: SEGMENTS }).map((_, i) => {
        const segmentProgress = i / (SEGMENTS - 1)
        const targetTime = duration * segmentProgress
        const xPos = -width / 2 + segmentWidth * (i + 0.5)

        return {
          index: i,
          xPos,
          targetTime,
          interactionText: targetTime === 0 ? '最初に戻る' : formatTime(targetTime),
        }
      })
    }, [duration, width, segmentWidth])

    return (
      <group position={position}>
        {/* 背景バー */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color="#333333" />
        </mesh>

        {/* 進捗バー */}
        {progressWidth > 0 && (
          <mesh position={[progressOffset, 0, 0.001]}>
            <planeGeometry args={[progressWidth, height]} />
            <meshBasicMaterial color="#4a9eff" />
          </mesh>
        )}

        {/* シーク用セグメント */}
        {segments.map((segment) => (
          <Interactable
            key={segment.index}
            id={`${id}-seg-${segment.index}`}
            onInteract={() => onSeek(segment.targetTime)}
            interactionText={segment.interactionText}
          >
            <mesh position={[segment.xPos, 0, 0.002]}>
              <planeGeometry args={[segmentWidth * 0.98, height * 2]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </Interactable>
        ))}
      </group>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'
