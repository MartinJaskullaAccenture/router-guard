import type { InferGetStaticPropsType, NextPage } from 'next'
import { useEffect } from 'react';
import { firstPageAllowed } from '../../../guards/RouteGuard';

export const getStaticProps = async () => ({props: {heading: "Change Pin"}})
type Props = InferGetStaticPropsType<typeof getStaticProps>

// Enter http://localhost:3000/mein-sky/pin/change manually in browser bar to check if request is made (it should not bee made if page is forbidden)
const ChangePin: NextPage<Props> = (props: Props) => {
    useEffect(() => {
        firstPageAllowed.then(() => {
            debugger
            fetch('https://jsonplaceholder.typicode.com/todos/1')
                .then(response => response.json())
                .then(json => console.log(json))
        })
    }, [])
    return <h1>{props.heading}</h1>
}

export default ChangePin
