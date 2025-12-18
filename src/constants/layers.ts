/**
 * Three.js レイヤー定数
 *
 * Three.jsのカメラとオブジェクトは32のレイヤー（0-31）を持ち、
 * カメラは有効化されたレイヤーに属するオブジェクトのみをレンダリングする。
 *
 * 使用例:
 * - camera.layers.enable(LAYERS.INTERACTABLE) // カメラでこのレイヤーを表示
 * - mesh.layers.set(LAYERS.FIRST_PERSON_ONLY) // メッシュをこのレイヤーのみに設定
 * - mesh.layers.enable(LAYERS.INTERACTABLE)   // メッシュにこのレイヤーを追加
 */

export const LAYERS = {
  /** デフォルトレイヤー（すべてのオブジェクトが初期状態で属する） */
  DEFAULT: 0,

  /**
   * 一人称視点のみ表示（VRMFirstPerson）
   * - ヘッドレスコピー（頭部を除いた身体）を表示
   * - VRモードで自分の身体を見る際に使用
   */
  FIRST_PERSON_ONLY: 9,

  /**
   * 三人称視点のみ表示（VRMFirstPerson）
   * - 頭部を含むオリジナルメッシュを表示
   * - 他プレイヤーから見た時、ミラーに映る時に使用
   */
  THIRD_PERSON_ONLY: 10,

  /**
   * インタラクト可能オブジェクト
   * - Raycastでインタラクション対象を検出する際に使用
   * - ボタン、ドア、アイテムなどのインタラクト可能な要素に設定
   */
  INTERACTABLE: 11,
} as const

export type LayerName = keyof typeof LAYERS
export type LayerNumber = (typeof LAYERS)[LayerName]
