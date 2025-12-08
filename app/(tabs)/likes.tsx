import MutualLikes from '@/components/MutualLikes';
import MyDislikes from '@/components/MyDislikes';
import MyLikes from '@/components/MyLikes';
import NavBar from '@/components/NavBar';
import WhoLikesMe from '@/components/WhoLikesMe';
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
        style={{ backgroundColor: 'transparent', elevation: 0, borderBottomWidth: 0, borderBottomColor: '#E4E4E7' }}
        activeColor='#DD3FE5'
        inactiveColor='#333'
    />
);

const Likes = () => {
    const insets = useSafeAreaInsets();
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
                    title: 'My Likes',
                    description: 'Displays a list of users you have liked',
                }); 
            } else if (index === 1) {
                setPageDetails({
                    title: 'My Mutual Likes',
                    description: 'Shows users who have liked you back after you liked them',
                }); 
            } else if (index === 2) {
                setPageDetails({
                    title: 'Who Likes Me',
                    description: "Lists users who have liked you whom you haven't liked yet or have liked back",
                });
            } else if (index === 3) {
                setPageDetails({
                    title: 'My Dislikes',
                    description: 'Shows users you have disliked or swiped left on',
                });
            } else {
                setPageDetails({
                    title: 'My Likes',
                    description: 'Displays a list of users you have liked',
                });
            }
            return index;
        });
    };

    const _renderLazyPlaceholder = ({ route }: any) => <LazyPlaceholder route={route} />;

    return (
       <View className='flex-1 bg-white' style={{ paddingTop: insets.top }}>
        <NavBar
          leftItem={<Text className='text-2xl text-primary font-firasemibold'>{pageDetails.title}</Text>}
        />
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
            className=' shadow-none'
            style={styles.container}
        />
       </View>
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