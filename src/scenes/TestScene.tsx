import { useState } from 'react'
import { VideoScreen } from '../components/VideoScreen'
import { RichVideoPlayer } from '../components/RichVideoPlayer'
import { LiveVideoPlayer } from '../components/LiveVideoPlayer'
import { Mirror } from '../components/Mirror'
import { Skybox } from '../components/Skybox'
import { Interactable } from '../components/Interactable'

/**
 * VideoScreenとMirrorのテストシーン
 * Triplexでコンポーネントを確認するためのシーン
 */
export function TestScene() {
  return (
    <>
      {/* 空 */}
      <Skybox />

      {/* 照明 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      {/* 床 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>

      {/* メインスクリーン（中央）- グローバル同期 */}
      {/* <VideoScreen
        id="main-screen"
        position={[0, 2, -5]}
        scale={[16 / 9 * 3, 3]}
        url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        sync="global"
      /> */}

      {/* サブスクリーン（右）- ローカルのみ */}
      {/* <VideoScreen
        id="sub-screen"
        position={[5, 1.5, -3]}
        scale={[16 / 9 * 1.5, 1.5]}
        url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        sync="local"
      /> */}

      {/* リッチビデオプレイヤー（左前） */}
      <RichVideoPlayer
        id="rich-player"
        position={[-4, 2, -2]}
        rotation={[0, Math.PI / 6, 0]}
        width={3}
        volume={0}
        playing
        url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />

      {/* ライブビデオプレイヤー（右前） */}
      <LiveVideoPlayer
        id="live-player"
        position={[4, 2, -2]}
        rotation={[0, -Math.PI / 6, 0]}
        width={3}
        volume={0}
        playing
        url="https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8"
      />

      {/* 鏡（左） */}
      <Mirror
        position={[-5, 2.5, -3]}
        size={[3, 4]}
        textureResolution={512}
      />

      {/* 小さい鏡（左奥） */}
      <Mirror
        position={[-3, 1.5, -7]}
        size={[2, 2]}
        color={0xffd700}
      />

      {/* 参照用のキューブ */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* 球体 */}
      <mesh position={[2, 1, -1]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="blue" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 円柱 */}
      <mesh position={[-2, 0.75, -1]}>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </>
  )
}
