import type { ReactNode } from 'react'

export interface Props {
  /** オブジェクトの一意なID */
  id: string
  /** オブジェクトの種類 */
  type?: 'button'
  /** インタラクション時のコールバック（オブジェクトのIDが渡される） */
  onInteract: (id: string) => void
  /** インタラクション時に表示するテキスト */
  interactionText?: string
  /** インタラクション可能かどうか */
  enabled?: boolean
  /** 子要素（3Dオブジェクト） */
  children: ReactNode
}
