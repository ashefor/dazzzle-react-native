import React from 'react'
import UserList from '@/components/UserList'

const WhoLikesMe = () => {
    return (
        <UserList
            endpoint="/who-liked-me"
            showActionButton={false}
            emptyMessage="No one has liked you yet"
        />
    );
};

export default WhoLikesMe;