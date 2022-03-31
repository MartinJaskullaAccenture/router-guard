import type { InferGetStaticPropsType, NextPage } from 'next'
import { useEffect } from 'react';

export const getStaticProps = async () => ({props: {heading: "Change Pin"}})
type Props = InferGetStaticPropsType<typeof getStaticProps>

// Enter http://localhost:3000/mein-sky/pin/change manually in browser bar and request is still made, but should not
const ChangePin: NextPage<Props> = (props: Props) => {
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log(json))
  }, [])
  return <h1>{props.heading}</h1>
}

export default ChangePin
