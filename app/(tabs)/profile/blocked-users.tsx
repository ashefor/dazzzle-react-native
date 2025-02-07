import { View, Text, FlatList, TouchableWithoutFeedback, ImageBackground, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { YStack } from 'tamagui';
import Images from '@/constants/images';

const BlockedUsers = () => {
  const [blockedUsers, setblockedUsers] = useState<string[]>(Array.from({ length: 20 }))

  return (
    <View className='bg-[#1A1A1A] h-full'>
      <FlatList
          className='p-1'
          // columnWrapperStyle={{ gap: 10 }}
          data={blockedUsers}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          // ItemSeparatorComponent={({ item, index }) => (
          //   <View
          //     style={{
          //       marginVertical: 5, //Add space between rows
          //     }}
          //   />
          // )}
          renderItem={
            ({ item }) => (
              <TouchableWithoutFeedback className=''>
                <View className='p-2' style={{
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                }}>
                  <View className='w-full h-full rounded-xl overflow-hidden'>
                  <ImageBackground resizeMode='cover' className='h-48 w-full rounded-xl flex-1' source={Images.coverPhoto}>
                    <View className='bg-black/[0.4] h-full flex flex-col justify-end p-4'>
                    <Text className='text-sm font-firabold text-white'>Michael Ashefor</Text>
                    <Text className='text-xs font-firamedium text-white'>32, Male</Text>
                    <Text className='text-xs font-firamedium text-white'>Lagos</Text>
                    </View>
                  </ImageBackground>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          }
        />
    </View>

  )
}

export default BlockedUsers