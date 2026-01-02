import { createContext, type ReactNode, useContext } from 'react'

/**
 * ユーザー情報の型定義
 */
export interface User {
  /** ユーザーID */
  id: string
  /** 表示名 */
  displayName: string
  /** アバターアイコンURL */
  avatarUrl: string | null
  /** ゲストかどうか */
  isGuest: boolean
}

/**
 * ユーザー情報を管理するためのインターフェース
 * プラットフォーム側（xrift-frontend）が実装を注入する
 */
export interface UsersContextValue {
  /** ローカルユーザー（自分） */
  localUser: User | null
  /** リモートユーザー（他の参加者） */
  remoteUsers: User[]
}

/**
 * デフォルト実装: Context未設定時は空の状態として動作
 * 開発時やテスト時に使用される
 */
const createDefaultImplementation = (): UsersContextValue => ({
  localUser: null,
  remoteUsers: [],
})

/**
 * ユーザー情報を管理するContext
 * ワールド作成者はこのContextを通じてユーザー情報にアクセスする
 */
export const UsersContext = createContext<UsersContextValue>(
  createDefaultImplementation()
)

interface Props {
  /**
   * プラットフォーム側が提供する実装
   * 未指定の場合はデフォルト実装（空の状態）が使用される
   */
  implementation?: UsersContextValue
  children: ReactNode
}

/**
 * ユーザー情報を提供するContextProvider
 * プラットフォーム側（xrift-frontend）が実装を注入するために使用
 *
 * @example
 * // プラットフォーム側での使用例
 * <UsersProvider implementation={usersImplementation}>
 *   <WorldComponent />
 * </UsersProvider>
 */
export const UsersProvider = ({ implementation, children }: Props) => {
  const value = implementation ?? createDefaultImplementation()

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  )
}

/**
 * ユーザー情報を取得するhook
 * ワールド作成者が現在のユーザー情報（自分＋他の参加者）を取得するために使用
 *
 * @example
 * const { localUser, remoteUsers } = useUsers()
 *
 * // localUser: { id, displayName, avatarUrl, isGuest }
 * // remoteUsers: [{ id, displayName, avatarUrl, isGuest }, ...]
 */
export const useUsers = (): UsersContextValue => {
  return useContext(UsersContext)
}
