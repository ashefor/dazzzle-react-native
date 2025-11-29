import React from 'react'
import UserList from '@/components/UserList'

const MutualLikes = () => {
    return (
        <UserList
            endpoint="/mutual-likes"
            showActionButton={true}
            actionType="dislike"
            actionAlertTitle="Unlike User?"
            actionAlertMessage="Are you sure you want to unlike this user?"
            actionButtonText="Unlike"
            actionSuccessMessage="User Disliked successfully"
            emptyMessage="No mutual likes yet"
        />
    );
};

export default MutualLikes;