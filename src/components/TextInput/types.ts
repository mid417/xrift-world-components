import type { ReactNode } from 'react'

export interface Props {
  /** 入力フィールドの一意なID */
  id: string
  /** 子要素（3Dオブジェクト） */
  children: ReactNode
  /** プレースホルダーテキスト */
  placeholder?: string
  /** 最大文字数 */
  maxLength?: number
  /** 現在の値（制御コンポーネントとして使う場合） */
  value?: string
  /** 入力完了時のコールバック */
  onSubmit?: (value: string) => void
  /** インタラクション時に表示するテキスト */
  interactionText?: string
  /** 入力を無効にするか */
  disabled?: boolean
}
