import React from 'react'
import UserList from './UserList'

const MyDislikes = () => {
   return (
        <UserList 
            endpoint="/disliked"
            showActionButton={false} // Currently read-only in original file
            emptyMessage="You haven't disliked anyone yet."
        />
    );
}

export default MyDislikes