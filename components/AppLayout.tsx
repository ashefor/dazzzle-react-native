import { TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useGlobalContext } from '@/context/GlobalProvider'

const AppLayout = () => {
    const { authState } = useGlobalContext();

    return (
        <>
            {authState ? (
                authState === 'completed' ? (
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="view-user/[id]"
                            options={{
                                headerTransparent: true,
                                title: 'View User',
                            }}
                        />
                        <Stack.Screen name="my-profile"
                            options={{
                                headerTransparent: true,
                                title: 'My Profile',

                            }}
                        />
                        <Stack.Screen name="user-filter"
                            options={{
                                presentation: 'modal',
                                headerStyle: {
                                    backgroundColor: '#FFFFFF'
                                },
                                title: 'Filter Users',
                                headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center'>
                                    <Ionicons name="close" size={24} color="white" />
                                </TouchableOpacity>
                            }}
                        />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                ) : (
                    <Stack>
                        <Stack.Screen name='onboard' options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                )

            ) : (
                <Stack>
                    <Stack.Screen name='index' options={{ headerShown: false }} />
                    <Stack.Screen name='onboard' options={{ headerShown: false }} />
                    <Stack.Screen name='(auth)' options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
            )
            }
        </>
    )
}

export default AppLayout