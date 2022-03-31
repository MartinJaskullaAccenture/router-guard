import type { NextPage } from 'next'
import { useEffect } from 'react';

// Enter http://localhost:3000/mein-sky/pin/change manually in browser bar and request is still made, but should not
const ChangePin: NextPage = () => {
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log(json))
  })
  return <h1>Change Pin</h1>
}

export default ChangePin
