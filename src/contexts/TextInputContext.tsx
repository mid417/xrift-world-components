import { createContext, useContext, type ReactNode } from 'react'

/**
 * テキスト入力のリクエスト情報
 */
export interface TextInputRequest {
  /** 入力フィールドの一意なID */
  id: string
  /** プレースホルダーテキスト */
  placeholder?: string
  /** 最大文字数 */
  maxLength?: number
  /** 初期値 */
  initialValue?: string
  /** 入力完了時のコールバック */
  onSubmit: (value: string) => void
  /** キャンセル時のコールバック */
  onCancel?: () => void
}

/**
 * テキスト入力のContext値
 */
export interface TextInputContextValue {
  /**
   * テキスト入力オーバーレイを表示する
   * xrift-frontend側でオーバーレイUIを表示し、入力完了後にonSubmitが呼ばれる
   */
  requestTextInput: (request: TextInputRequest) => void
  /**
   * 現在アクティブなテキスト入力があるか
   */
  isActive: boolean
}

/**
 * デフォルトの実装（開発環境用）
 * コンソールにログを出力し、1秒後にダミー値でsubmitを呼ぶ
 */
export const createDefaultTextInputImplementation = (): TextInputContextValue => ({
  requestTextInput: (request) => {
    console.log('[TextInput] requestTextInput called:', request)
    // 開発環境ではブラウザのpromptを使用
    const value = window.prompt(request.placeholder ?? 'テキストを入力', request.initialValue ?? '')
    if (value !== null) {
      request.onSubmit(value)
    } else {
      request.onCancel?.()
    }
  },
  isActive: false,
})

/**
 * テキスト入力のContext
 */
export const TextInputContext = createContext<TextInputContextValue | null>(null)

interface Props {
  value: TextInputContextValue
  children: ReactNode
}

/**
 * テキスト入力のContextProvider
 */
export const TextInputProvider = ({ value, children }: Props) => {
  return <TextInputContext.Provider value={value}>{children}</TextInputContext.Provider>
}

/**
 * テキスト入力の機能を取得するhook
 *
 * @example
 * const { requestTextInput } = useTextInputContext()
 * requestTextInput({
 *   id: 'my-input',
 *   placeholder: '名前を入力',
 *   onSubmit: (value) => console.log('入力値:', value),
 * })
 *
 * @throws {Error} TextInputProvider の外で呼び出された場合
 */
export const useTextInputContext = (): TextInputContextValue => {
  const context = useContext(TextInputContext)

  if (!context) {
    throw new Error('useTextInputContext must be used within TextInputProvider')
  }

  return context
}
