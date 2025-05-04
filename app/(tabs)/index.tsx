import {  View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TinderCardSwipers from '@/components/TinderCardSwipers';
import { useGlobalContext } from '@/context/GlobalProvider';
import { WebView } from 'react-native-webview';
import { Fragment } from 'react';


export default function HomeScreen() {
    const { authState, token } = useGlobalContext();
    const authorization_url = 'https://checkout.paystack.com/luKuasMan';

    const onNavigationStateChange = (state: any) => {
 
      const { url } = state;
  console.log(state)
      if (!url) return;
  
      // if (url === callback_url) {
      //   // get transaction reference from url and verify transaction, then redirect
      //   const redirectTo = 'window.location = "' + callback_url + '"';
      //   this.webview.injectJavaScript(redirectTo);
      // }
      // if (url === cancel_url) {
      //   // handle webview removal
      //   // You can either unmount the component, or
      //   // Use a navigator to pop off the view
      //   // Run the cancel payment function if you have one
      // }
    };

  return (
   <Fragment>
     <View className='h-full bg-[#1A1A1A]'>
    <TinderCardSwipers/>
    </View>
     {/* <WebView 
     source={{ uri: authorization_url }}
     onNavigationStateChange={onNavigationStateChange }
   /> */}
   </Fragment>
  );
}
