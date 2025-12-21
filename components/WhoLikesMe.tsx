import React from 'react'

import UserList from './UserList'

const WhoLikesMe = () => {
   return (
        <UserList 
            endpoint="/who-liked-me"
            showActionButton={false} // Read only
            emptyMessage="No one has liked you yet."
        />
    );
}

export default WhoLikesMe