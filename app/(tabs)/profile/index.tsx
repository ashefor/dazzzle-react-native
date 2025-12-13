import { Text, TouchableOpacity, ScrollView, View, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Fragment, JSX, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { signUserOut } from '@/redux/thunks/authActions';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useLoader } from '@/context/loader/LoaderProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '@/components/NavBar';
import { LinearGradient } from 'expo-linear-gradient';
import ArrowForwardIcon from '@/components/icons/ArrowForwardIcon';
import ExitIcon from '@/components/icons/ExitIcon';
import IdCardIcon from '@/components/icons/IdCardIcon';
import WalletIcon from '@/components/icons/WalletIcon';
import UserBlockIcon from '@/components/icons/UserBlockIcon';
import NotificationIcon from '@/components/icons/NotificationIcon';
import LockIcon from '@/components/icons/LockIcon';
import MailIcon from '@/components/icons/MailIcon';
import ShieldIcon from '@/components/icons/ShieldIcon';
import { fetchUserProfileData } from '@/redux/thunks/userActions';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { show, hide } = useLoader();
  const dispatch = useAppDispatch();
  const { userInfo, loggingOut } = useAppSelector(state => state.auth);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleLogOut = async () => {
    dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
  }

  useEffect(() => {
    dispatch(fetchUserProfileData());
  }, [])

  useEffect(() => {
    if (loggingOut) {
      show();
    } else {
      hide();
    }
  }, [loggingOut])

  const openPrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync('https://dazzzle.org/privacy-policy');
  };

  const openInstagram = async () => {
    await WebBrowser.openBrowserAsync('https://www.instagram.com/dazzzledating/');
  };

  const openContactUsPage = async () => {
    await WebBrowser.openBrowserAsync('https://dazzzle.org/contact');
  };


  const renderBackdrop = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      // onPress={handleBlur}
      />
    ),
    []
  );

  return (
    <Fragment>
      <View className='flex-1 bg-white' style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <NavBar
          leftItem={<Text className='text-2xl text-primary font-firasemibold'>Profile</Text>}
        />
        <ScrollView className='h-full ' contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={['#D946EF', '#A855F7']} // Pink to Purple gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientCard}
            >
              <View style={styles.profileInfo}>
                <Image
                  source={{ uri: userInfo?.profile_picture_url }} // Placeholder image
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.profileName}>{userInfo?.full_name || userInfo?.first_name + ' ' + userInfo?.last_name}</Text>
                  <Text style={styles.profileLocation}>{userInfo?.username}</Text>
                </View>
              </View>

              {/* <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>20</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>100</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
            </View> */}
            </LinearGradient>
          </View>
          <Section title="Account">
            <MenuItem onPress={() => router.push('/profile/profile-settings')} icon={<IdCardIcon stroke={"#8E8E93"} />} label="Profile Settings" />
            <MenuItem onPress={() => router.push('/profile/wallet-transactions')} icon={<WalletIcon stroke={"#8E8E93"} />} label="Wallet" />
            <MenuItem onPress={() => router.push('/profile/blocked-users')} icon={<UserBlockIcon stroke={"#8E8E93"} />} label="My Blocked List" />
            <MenuItem onPress={() => router.push('/profile/settings')} icon={<NotificationIcon width={20} height={20} color={"#8E8E93"} />} label="Notification Settings" isLast />
          </Section>
          <Section title="Security">
            <MenuItem onPress={() => router.push('/profile/change-password')} icon={<LockIcon stroke={"#8E8E93"} />} label="Change Password" />
            <MenuItem onPress={() => router.push('/profile/change-email')} icon={<MailIcon stroke={"#8E8E93"} />} label="Change Email" isLast />
          </Section>

          <Section title="Legal">
            <MenuItem onPress={openPrivacyPolicy} icon={<ShieldIcon stroke={"#8E8E93"} />} label="Privacy Policy" isLast />
          </Section>

          <Section title="More">
            <MenuItem onPress={openInstagram} icon={<AntDesign name="instagram" size={20} color="#8E8E93" />} label="Follow us on Instagram" />
            <MenuItem onPress={openContactUsPage} icon={<Feather name="help-circle" size={20} color="#8E8E93" />} label="Help" isLast />
          </Section>
          <TouchableOpacity onPress={() => bottomSheetModalRef.current?.present()} style={styles.logoutButton}>
            <ExitIcon stroke={"#FF383C"} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity className='h-[44px] w-full bg-red-600 flex items-center justify-center rounded-xl my-6'>
            <Text className='text-white text-base font-firamedium'>
              Delete My Account
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enableDynamicSizing
        enablePanDownToClose={true}
        style={{
          borderRadius: 28,
        }}
        backgroundStyle={{
          borderRadius: 28,
        }}
        backdropComponent={renderBackdrop}
      // onDismiss={() => router.back()}
      >

        <BottomSheetView>
          <View style={{ paddingBottom: insets.bottom + 10, paddingHorizontal: 16 }}>
            <View className='mb-7'>
              <Text className='text-lg font-red-500 mb-2 text-center'>
                Logout
              </Text>
              <Text className='text-base font-firaregular text-center'>
                Are you sure you want to logout?
              </Text>
            </View>
            <View className='space-y-4'>
              <TouchableOpacity onPress={handleLogOut} className='rounded-[26px] h-12 bg-white border border-primary flex items-center justify-center'>
              <Text className='text-base font-firamedium text-primary'>
                Yes, Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()} className='rounded-[26px] h-12 border bg-primary border-primary flex items-center justify-center'>
              <Text className='text-base font-firamedium text-white'>
                Cancel
              </Text>
            </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </Fragment>
  );
}

const MenuItem = ({ icon, label, isLast, onPress }: { icon: React.ReactNode; label: string; isLast?: boolean; onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} style={[styles.menuItem, isLast && styles.menuItemLast]}>
    <View style={styles.menuItemLeft}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.menuItemText}>{label}</Text>
    </View>
    <ArrowForwardIcon />

  </TouchableOpacity>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionHeader}>{title}</Text>
    <View style={styles.sectionBody}>
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#FFFFFF',
  // },
  // Card Styles
  cardContainer: {
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    // Elevation for Android
    elevation: 10,
  },
  gradientCard: {
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 15,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Onest_500Medium',
  },
  profileLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Onest_400Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingVertical: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  // Section Styles
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Onest_500Medium',
    color: '#111',
    marginBottom: 10,
    marginLeft: 5,
  },
  sectionBody: {
    backgroundColor: '#F2F2F7', // Very light grey for the group background
    borderRadius: 15,
    overflow: 'hidden',
  },
  // Menu Item Styles
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
    width: 24, // fixed width to align text even if icons differ slightly
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
    fontFamily: 'Onest_500Medium',
  },
  // Logout Styles
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Onest_500Medium',
    marginLeft: 8,
  },
});
