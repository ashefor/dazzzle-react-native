import MutualLikes from '@/components/MutualLikes';
import MyDislikes from '@/components/MyDislikes';
import MyLikes from '@/components/MyLikes';
import WhoLikesMe from '@/components/WhoLikesMe';
import { Stack } from 'expo-router';
import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, NavigationState, Route, SceneRendererProps, TabBar, TabDescriptor } from 'react-native-tab-view';


const LazyPlaceholder = ({ route }: { route: { title: string } }) => (
    <View style={styles.scene}>
        <Text>Loading {route.title}…</Text>
    </View>
);

const renderTabBar = (props: SceneRendererProps & {
    navigationState: NavigationState<Route>;
    options: Record<string, TabDescriptor<Route>> | undefined;
}) => (
    <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: '#DD3FE5' }}
        style={{ backgroundColor: 'transparent', borderBottomWidth: 0, borderBottomColor: '#E4E4E7' }}
        activeColor='#DD3FE5'
        inactiveColor='white'
    />
);

const Likes = () => {

    const [index, setIndex] = React.useState(0);
    const [pageDetails, setPageDetails] = React.useState({
        title: 'View My Likes',
        description: 'Displays a list of users you have liked',
    });

    const [routes] = React.useState([
        { key: 'first', title: 'Likes' },
        { key: 'second', title: 'Mutual' },
        { key: 'third', title: 'Likes Me' },
        { key: 'fourth', title: 'Dislikes' },
    ]);

    const _handleIndexChange = (index: number) => {
        setIndex(() => {
            if (index === 0) {
                setPageDetails({
                    title: 'View My Likes',
                    description: 'Displays a list of users you have liked',
                }); 
            } else if (index === 1) {
                setPageDetails({
                    title: 'View My Mutual Likes',
                    description: 'Shows users who have liked you back after you liked them',
                }); 
            } else if (index === 2) {
                setPageDetails({
                    title: 'View Who Likes Me',
                    description: "Lists users who have liked you whom you haven't liked yet or have liked back",
                });
            } else if (index === 3) {
                setPageDetails({
                    title: 'View My Dislikes',
                    description: 'Shows users you have disliked or swiped left on',
                });
            } else {
                setPageDetails({
                    title: 'View My Likes',
                    description: 'Displays a list of users you have liked',
                });
            }
            return index;
        });
    };

    const _renderLazyPlaceholder = ({ route }: any) => <LazyPlaceholder route={route} />;

    return (
        <>
        <Stack.Screen
                    options={{
                       headerTitle: pageDetails.title,
                       headerTitleAlign: 'left',
                       headerShadowVisible: false,
                       headerStyle: {
                        backgroundColor: '#1A1A1A',
                       },
                    }}
                />
                {/* <View className='p-4 bg-[#1A1A1A]'>
                <Text className='text-white font-firaregular'>{pageDetails.description}</Text>
                </View> */}
                <TabView
            lazy
            navigationState={{ index, routes }}
            renderScene={SceneMap({
                first: MyLikes,
                second: MutualLikes,
                third: WhoLikesMe,
                fourth: MyDislikes
            })}
            renderLazyPlaceholder={_renderLazyPlaceholder}
            onIndexChange={_handleIndexChange}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={renderTabBar}
            className='bg-[#1A1A1A] shadow-none'
            style={styles.container}
        />
        </>
    )
}

export default Likes

const styles = StyleSheet.create({
    container: {
        // marginTop: StatusBar.currentHeight,
    },
    scene: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});