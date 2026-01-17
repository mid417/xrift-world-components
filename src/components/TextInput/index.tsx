import { useCallback, useEffect, useRef, type FC } from 'react'
import type { Group } from 'three'
import { LAYERS } from '../../constants/layers'
import { useTextInputContext } from '../../contexts/TextInputContext'
import { useXRift } from '../../contexts/XRiftContext'
import type { Props } from './types'

/**
 * 3D空間内でテキスト入力を可能にするコンポーネント
 *
 * @example
 * ```tsx
 * <TextInput
 *   id="my-input"
 *   value={inputValue}
 *   onSubmit={handleSubmit}
 *   placeholder="テキストを入力..."
 * >
 *   <mesh>
 *     <boxGeometry args={[1, 0.5, 0.1]} />
 *     <meshStandardMaterial color="#333" />
 *   </mesh>
 * </TextInput>
 * ```
 */
export const TextInput: FC<Props> = ({
  id,
  children,
  placeholder,
  maxLength,
  value,
  onSubmit,
  interactionText = 'クリックして入力',
  disabled = false,
}) => {
  const { registerInteractable, unregisterInteractable } = useXRift()
  const { requestTextInput } = useTextInputContext()
  const groupRef = useRef<Group>(null)

  // インタラクション時のハンドラー
  const handleInteract = useCallback(() => {
    if (disabled) return

    requestTextInput({
      id,
      placeholder,
      maxLength,
      initialValue: value,
      onSubmit: (inputValue) => {
        onSubmit?.(inputValue)
      },
    })
  }, [id, placeholder, maxLength, value, onSubmit, disabled, requestTextInput])

  // レイヤー設定 & オブジェクト登録（マウント時のみ）
  useEffect(() => {
    const object = groupRef.current
    if (!object) return

    // レイヤーを設定（レイキャスト最適化のため）
    object.traverse((child) => {
      child.layers.enable(LAYERS.INTERACTABLE)
    })

    // インタラクト可能オブジェクトとして登録
    registerInteractable(object)

    // クリーンアップ
    return () => {
      unregisterInteractable(object)

      object.traverse((child) => {
        child.layers.disable(LAYERS.INTERACTABLE)
      })
    }
  }, [registerInteractable, unregisterInteractable])

  // userData の更新（props が変わった時）
  useEffect(() => {
    const object = groupRef.current
    if (!object) return

    Object.assign(object.userData, {
      id,
      type: 'textInput',
      onInteract: handleInteract,
      interactionText: disabled ? undefined : interactionText,
      enabled: !disabled,
    })
  }, [id, handleInteract, interactionText, disabled])

  return <group ref={groupRef}>{children}</group>
}

export type { Props as TextInputProps } from './types'
