import { memo, useMemo } from 'react'
import { Text } from '@react-three/drei'
import { Interactable } from '../Interactable'
import type { VolumeControlProps } from './types'

const SEGMENTS = 11

export const VolumeControl = memo(
  ({ id, position, size, volume, onVolumeChange }: VolumeControlProps) => {
    const barWidth = size * 3
    const barHeight = size * 0.2
    const segmentWidth = barWidth / SEGMENTS
    const volumeWidth = barWidth * Math.min(1, Math.max(0, volume))
    const volumeOffset = -barWidth / 2 + volumeWidth / 2

    const segments = useMemo(() => {
      return Array.from({ length: SEGMENTS }).map((_, i) => {
        const segmentVolume = i / (SEGMENTS - 1)
        const xPos = -barWidth / 2 + segmentWidth * (i + 0.5)
        const percent = Math.round(segmentVolume * 100)

        return {
          index: i,
          xPos,
          targetVolume: segmentVolume,
          interactionText: percent === 0 ? 'ミュート' : `音量: ${percent}%`,
        }
      })
    }, [barWidth, segmentWidth])

    return (
      <group position={position}>
        {/* スピーカーアイコン */}
        <Text
          position={[-barWidth / 2 - size * 0.3, 0, 0.01]}
          fontSize={size * 0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {volume === 0 ? '🔇' : '🔈'}
        </Text>

        {/* 背景バー */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[barWidth, barHeight]} />
          <meshBasicMaterial color="#333333" />
        </mesh>

        {/* 音量バー */}
        {volumeWidth > 0 && (
          <mesh position={[volumeOffset, 0, 0.001]}>
            <planeGeometry args={[volumeWidth, barHeight]} />
            <meshBasicMaterial color="#4aff4a" />
          </mesh>
        )}

        {/* セグメント */}
        {segments.map((segment) => (
          <Interactable
            key={segment.index}
            id={`${id}-seg-${segment.index}`}
            onInteract={() => onVolumeChange(segment.targetVolume)}
            interactionText={segment.interactionText}
          >
            <mesh position={[segment.xPos, 0, 0.002]}>
              <planeGeometry args={[segmentWidth * 0.98, barHeight * 2]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </Interactable>
        ))}
      </group>
    )
  }
)

VolumeControl.displayName = 'VolumeControl'
