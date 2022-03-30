import type { NextPage } from 'next'
import Link from "next/link";

const Home: NextPage = () => {
  return <>
    <h1>Home</h1>
    <ul>
      <li><Link href="/sales">Sales</Link></li>
      <li><Link href="/mein-sky">Mein Sky</Link></li>
      <li><a href="https://google.com">Google</a></li>
      <li><a href="https://google.com" target="_blank">Google New Tab</a></li>
    </ul>
  </>
}

export default Home