import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { CameraView } from "../assets/components/CameraView";

const Home: NextPage = () => {
  return (
    <div>
      <CameraView />
    </div>
  )
}

export default Home
