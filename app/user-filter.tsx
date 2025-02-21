import { View, Text, LayoutRectangle, ScrollView, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { StackProps, YStack, TabLayout, TabsTabProps, Tabs, AnimatePresence, SizableText, styled, XStack, RadioGroup, SizeTokens, Label } from 'tamagui'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import UsersBasicFilter from '@/components/UsersBasicFilter';

const AnimatedYStack = styled(YStack, {
    flex: 1,
    x: 0,
    opacity: 1,

    animation: '100ms',
    variants: {
        // 1 = right, 0 = nowhere, -1 = left
        direction: {
            ':number': (direction) => ({
                enterStyle: {
                    x: direction > 0 ? -25 : 25,
                    opacity: 0,
                },
                exitStyle: {
                    zIndex: 0,
                    x: direction < 0 ? -25 : 25,
                    opacity: 0,
                },
            }),
        },
    } as const,
})

const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => {
    return (
        <YStack
            position="absolute"
            backgroundColor="$color5"
            opacity={0.7}
            animation="100ms"
            enterStyle={{
                opacity: 0,
            }}
            exitStyle={{
                opacity: 0,
            }}
            {...(active && {
                backgroundColor: '$color8',
                opacity: 0.6,
            })}
            {...props}
        />
    )
}

const TabsAdvancedBackground = () => {
    const [tabState, setTabState] = React.useState<{
        currentTab: string
        /**
         * Layout of the Tab user might intend to select (hovering / focusing)
         */
        intentAt: TabLayout | null
        /**
         * Layout of the Tab user selected
         */
        activeAt: TabLayout | null
        /**
         * Used to get the direction of activation for animating the active indicator
         */
        prevActiveAt: TabLayout | null
    }>({
        activeAt: null,
        currentTab: 'basic',
        intentAt: null,
        prevActiveAt: null,
    })

    const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
    const setIntentIndicator = (intentAt: LayoutRectangle | null) => setTabState({ ...tabState, intentAt })
    const setActiveIndicator = (activeAt: LayoutRectangle | null) =>
        setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
    const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

    // 1 = right, 0 = nowhere, -1 = left
    const direction = (() => {
        if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
            return 0
        }
        return activeAt.x > prevActiveAt.x ? -1 : 1
    })()

    const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
        if (type === 'select') {
            setActiveIndicator(layout)
        } else {
            setIntentIndicator(layout)
        }
    }

    return (
        <Tabs
            className='bg-transparent mt-5 h-full'
            value={currentTab}
            onValueChange={setCurrentTab}
            orientation="horizontal"
            width={'auto'}
            flexDirection="column"
            activationMode="manual"
            backgroundColor="$background"
            borderRadius="$4"
            position="relative"
        >
            <YStack className='w-full bg-[#5B5B5B] rounded-[50px]' alignSelf='center' justifyContent="space-between">
                <AnimatePresence>
                    {intentAt && (
                        <TabsRovingIndicator
                            className='bg-black text-white rounded-[40px]'
                            borderRadius="$4"
                            width={intentAt.width}
                            height={intentAt.height}
                            x={intentAt.x}
                            y={intentAt.y}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {activeAt && (
                        <TabsRovingIndicator
                            className='bg-black text-white rounded-[40px]'
                            theme="active"
                            width={activeAt.width}
                            height={activeAt.height}
                            x={activeAt.x}
                            y={activeAt.y}
                        />
                    )}
                </AnimatePresence>

                <Tabs.List
                    disablePassBorderRadius
                    loop={false}
                    gap="$2"
                    justifyContent="space-between"
                >
                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2"
                        paddingHorizontal="$1"
                        marginVertical="$1"
                        marginHorizontal="$1"
                        value="basic"
                        flex={1}
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText
                            className='text-white text-sm'>Personal</SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2"
                        paddingHorizontal="$1"
                        marginVertical="$1"
                        marginHorizontal="$1"
                        flex={1}
                        value="advanced"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText
                            className='text-white text-sm'>Looks</SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2"
                        paddingHorizontal="$1"
                        marginVertical="$1"
                        marginHorizontal="$1"
                        flex={1}
                        value="advanced"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText
                            className='text-white text-sm'>Personality</SizableText>
                    </Tabs.Tab>

                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2"
                        paddingHorizontal="$1"
                        marginVertical="$1"
                        marginHorizontal="$1"
                        flex={1}
                        value="advanced"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText
                            className='text-white text-sm'>Lifestyle</SizableText>
                    </Tabs.Tab>


                </Tabs.List>
            </YStack>

            <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
                <AnimatedYStack key={currentTab} className=''>
                    <Tabs.Content value={currentTab} forceMount flex={1} className=' py-6 h-full' justifyContent="center">
                        {currentTab === 'basic' && <UsersBasicFilter />}
                        {/* {currentTab === 'advanced' && <UserPhotos />} */}
                    </Tabs.Content>
                </AnimatedYStack>
            </AnimatePresence>
        </Tabs>
    )
}

const FilterUsers = () => {
    
    return (
        <View className='bg-[#1A1A1A] h-full px-4'>
            {/* <TabsAdvancedBackground /> */}
        {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
           
            <TabsAdvancedBackground />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            </ScrollView>


            </KeyboardAvoidingView> */}
        </View>

    )
}

export default FilterUsers