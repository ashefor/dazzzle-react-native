import {SafeAreaView as SafeAreaViewIOS,  StyleSheet, Text, Image, View, ImageBackground, ScrollView, TouchableOpacity, Animated, LayoutRectangle, Platform } from 'react-native';
import React, { useRef } from 'react'
import { AnimatePresence, Avatar, Button, ListItem, Popover, PopoverProps, Separator, SizableText, StackProps, styled, TabLayout, Tabs, TabsTabProps, XStack, YGroup, YStack } from 'tamagui';
import { router, Stack } from 'expo-router';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView as SafeAreaViewAndroid } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Images from '@/constants/images';
import BasicInfo from '../../components/BasicInfo';
import UserPhotos from '../../components/UserPhotos';
import UserInterests from '../../components/UserInterests';

const SafeArea = Platform.OS === 'ios' ? SafeAreaViewIOS : SafeAreaViewAndroid;

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeArea);

const User = () => {
    const scrollY = useRef(new Animated.Value(0)).current;

    // Interpolate background color based on scroll position
    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 100], // Change as per your scroll distance
        outputRange: ['transparent', '#1A1A1A'], // From white to blue
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [220, 250], // Adjust range to control when opacity starts and ends
        outputRange: [0, 1], // From invisible to fully visible
        extrapolate: 'clamp',
    });



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
            currentTab: 'profile',
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
                className='bg-transparent mt-5'
                value={currentTab}
                onValueChange={setCurrentTab}
                orientation="horizontal"
                size="$4"
                flexDirection="column"
                activationMode="manual"
                backgroundColor="$background"
                borderRadius="$4"
                position="relative"
            >
                <YStack className='w-full bg-[#5B5B5B] rounded-[50px]' justifyContent="space-between">
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
                            paddingHorizontal="$3"
                            marginVertical="$1.5"
                            marginHorizontal="$1.5"
                            value="profile"
                            flex={1}

                            onInteraction={handleOnInteraction}
                        >
                            <SizableText
                                className='text-white font-firamedium'>Profile</SizableText>
                        </Tabs.Tab>
                        <Tabs.Tab
                            unstyled
                            paddingVertical="$2"
                            paddingHorizontal="$3"
                            marginVertical="$1.5"
                            marginHorizontal="$1.5"
                            value="photos"
                            flex={1}
                            onInteraction={handleOnInteraction}
                        >
                            <SizableText
                                className='text-white font-firamedium'>Photos</SizableText>
                        </Tabs.Tab>
                        <Tabs.Tab
                            unstyled
                            paddingVertical="$2"
                            paddingHorizontal="$3"
                            marginVertical="$1.5"
                            marginHorizontal="$1.5"
                            value="interest"
                            flex={1}
                            onInteraction={handleOnInteraction}
                        >
                            <SizableText
                                className='text-white font-firamedium'>Interests</SizableText>
                        </Tabs.Tab>
                    </Tabs.List>
                </YStack>

                <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
                    <AnimatedYStack key={currentTab}>
                        <Tabs.Content value={currentTab} forceMount flex={1} className='mt-6' justifyContent="center">
                            {currentTab === 'profile' && <BasicInfo />}
                            {currentTab === 'photos' && <UserPhotos />}
                            {currentTab === 'interest' && <UserInterests />}
                        </Tabs.Content>
                    </AnimatedYStack>
                </AnimatePresence>
            </Tabs>
        )
    }


    const UserMoreActionsPopover = ({
        Icon,
        ...props
    }: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean }) => {
        return (
            <Popover size="$2" allowFlip {...props}>
                <Popover.Trigger asChild>
                    <Button unstyled>
                        <Ionicons name="ellipsis-vertical-sharp" size={24} color="#ffffff" />
                    </Button>
                </Popover.Trigger>

                <Popover.Content
                    unstyled
                    enterStyle={{ y: -10, opacity: 0 }}
                    exitStyle={{ y: -10, opacity: 0 }}
                    elevate
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                >
                    <YStack gap="$3">
                        <Popover.Close asChild>
                            <YGroup alignSelf="center" width={240} size="$4" separator={<Separator />}>
                                <YGroup.Item>
                                    <ListItem className='bg-[#5B5B5B]'>
                                        <Text className='text-base text-white'>Dislike</Text>
                                    </ListItem>
                                </YGroup.Item>
                                <YGroup.Item>
                                    <ListItem className='bg-[#5B5B5B]'>
                                        <Text className='text-base text-white'>Message</Text>
                                    </ListItem>
                                </YGroup.Item>
                                <YGroup.Item>
                                    <ListItem className='bg-[#5B5B5B]'>
                                        <Text className='text-base text-white'> Block
                                        </Text>
                                    </ListItem>
                                </YGroup.Item>
                                <YGroup.Item>
                                    <ListItem className='bg-[#5B5B5B]'>
                                        <Text className='text-base text-white'>Report</Text>
                                    </ListItem>
                                </YGroup.Item>
                            </YGroup>
                        </Popover.Close>
                    </YStack>
                </Popover.Content>
            </Popover>
        )
    }

    

    return (
        <View className='flex-1 bg-primary h-full'>
            <ScrollView className='h-full bg-primary relative'
                onScroll={
                    Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false } // For color interpolation, native driver must be false
                    )
                }
                scrollEventThrottle={16}

            >
                <Stack.Screen
                    options={{
                        headerStyle: { backgroundColor: 'red' },
                        header: (props) => <View>
                            <AnimatedSafeAreaView style={{ backgroundColor: headerBackgroundColor, }} />
                            <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
                                <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
                                    <ArrowBackIcon />
                                </TouchableOpacity>
                                <Animated.Text style={[styles.title, { opacity: headerOpacity }]} className='font-firabold text-center'>Michael Ashefor</Animated.Text>
                                <UserMoreActionsPopover
                                    placement="bottom"
                                />
                            </Animated.View>
                        </View>
                    }}
                />
                <YStack className='bg-[#1A1A1A] h-full relative pb-24' flex={1}>
                    <YStack className='h-[150px]'>
                        <ImageBackground source={Images.coverPhoto} className='w-full h-full' resizeMode='cover' >
                            <View className='h-full w-full bg-black/[0.8]'>

                            </View>
                        </ImageBackground>
                    </YStack>
                    <YStack >
                        <YStack className='py-5 px-4'>
                            <YStack gap="$5">
                                <XStack alignItems="center" gap="$4" justifyContent='center'>
                                    <View className='rounded-full'>
                                        <Avatar className='' gap="$2" circular size="$10">
                                            <Avatar.Image
                                                accessibilityLabel="Nate Wienert"
                                                src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
                                            />
                                            <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
                                        </Avatar>
                                    </View>
                                </XStack>
                                <Text className='text-lg font-firasemibold text-center text-white'>
                                    Michael Ashefor
                                </Text>
                            </YStack>
                            <TabsAdvancedBackground />
                        </YStack>

                    </YStack>
                </YStack>

            </ScrollView>
            <YStack className='absolute bottom-0 w-full py-7' alignItems='center' justifyContent='center'>
                <XStack alignItems='center' flex={1} gap="$4" justifyContent='center'>
                    <Button className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <FontAwesome name="close" size={36} color="#aeb11a" />
                    </Button>
                    <Button className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <Ionicons name="chatbox-ellipses" size={24} color="#59C526" />
                    </Button>
                    <Button className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <Ionicons name="heart" size={36} color="#EB4242" />
                    </Button>
                </XStack>
                <SafeArea />
            </YStack>
            <StatusBar style="light" />
        </View>
    )
}

export default User;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // height: Platform.OS === 'android' ? 97 : 'auto',
        // height: 97,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
    },
    iconContainer: {
        padding: 8,
    },
    title: {
        flex: 1,
        // position: 'absolute',
        // left: 0,
        // right: 0,
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 20,
        fontFamily: "FiraSans_700Bold",
        color: 'white',
    },
});