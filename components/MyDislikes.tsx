import React from 'react'
import UserList from '@/components/UserList'

const MyDislikes = () => {
    return (
        <UserList
            endpoint="/disliked"
            showActionButton={false}
            emptyMessage="You haven't disliked anyone yet"
        />
    );
};

export default MyDislikes;