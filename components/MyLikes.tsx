import React from 'react';
import UserList from './UserList';
const MyLikes = () => {
    
    return (
        <UserList 
            endpoint="/my-likes"
            showActionButton={true}
            actionValue="0" // 0 = Unlike
            emptyMessage="You haven't liked anyone yet."
            actionAlertTitle="Unlike User?"
            actionAlertMessage="Are you sure you want to unlike this user?"
            actionButtonText="Unlike"
            actionSuccessMessage="User unliked successfully"
        />
    );

   
}


export default MyLikes