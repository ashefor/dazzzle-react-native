import React from 'react'
import UserList from './UserList'

const MutualLikes = () => {
    return (
        <UserList 
            endpoint="/mutual-likes"
            showActionButton={true}
            actionValue="0" // 0 = Unlike
            emptyMessage="No mutual likes found."
            actionAlertTitle="Unlike User?"
            actionAlertMessage="Are you sure you want to remove this match?"
            actionButtonText="Unlike"
            actionSuccessMessage="User unliked successfully"
        />
    );
}

export default MutualLikes