import React from 'react'
import UserList from '@/components/UserList'

const MyLikes = () => {
    return (
        <UserList
            endpoint="/my-likes"
            showActionButton={true}
            actionType="dislike"
            actionAlertTitle="Unlike User?"
            actionAlertMessage="Are you sure you want to unlike this user?"
            actionButtonText="Unlike"
            actionSuccessMessage="User Disliked successfully"
            emptyMessage="You haven't liked anyone yet"
        />
    );
};

export default MyLikes;