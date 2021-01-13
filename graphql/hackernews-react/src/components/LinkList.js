import React from 'react'
import Link from './Link'
import {useQuery, gql} from '@apollo/client'
const FEED_QUERY = gql`
{
    feed {
        count,
        links{
        id,
        url,
        description
        }
    }
}`;
const LinkList = () => {
    const {data, loading, error} = useQuery(FEED_QUERY)
    console.log(data)
    return (
        <div>
            <div>
            {loading && <h3>Loading</h3>}
            {error && <h2>Error</h2>}
            </div>
            {data && (
                <>
                {data.feed.links.map((link)=> (
                    <Link key={link.id} link={link} />
                    ))}
                </>
            )}

        </div>
    )
}
export default LinkList