import { Text } from 'react-native';
import React from 'react';
import ActionSheet, { SheetManager, SheetProps, useSheetRef } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ListItem, Separator, YGroup, YStack } from 'tamagui';

const UserPhotoActionSheet = (props: SheetProps<"user-photo-action-sheet">) => {
  const insets = useSafeAreaInsets();
  const ref = useSheetRef();
  return (
    <ActionSheet ref={ref} containerStyle={{ backgroundColor: 'transparent', paddingHorizontal: 12 }} safeAreaInsets={insets} useBottomSafeAreaPadding drawUnderStatusBar={false}>
      <YStack gap="$2">
        <YGroup unstyled className='bg-[#F1f1f1]' alignItems='center' justifyContent='center' separator={<Separator />}>
          <YGroup.Item>
            <ListItem onPress={() => {
              SheetManager.hide(props.sheetId, {
                payload: 'DELETE',
              })
            }} unstyled className=' text-center' size={'$4.5'} justifyContent='center'>
              <Text className='text-xl font-firabold text-white text-center'>DELETE</Text>
            </ListItem>
          </YGroup.Item>
          <YGroup.Item>
            <ListItem onPress={() => {
              SheetManager.hide(props.sheetId, {
                payload: 'REPLACE',
              })
            }} unstyled className=' text-center' size={'$4.5'} justifyContent='center'>
              <Text className='text-xl font-firabold text-white'>REPLACE PHOTO</Text>
            </ListItem>
          </YGroup.Item>
        </YGroup>
        <YGroup size="$4" alignItems='center' justifyContent='center' separator={<Separator />}>
          <YGroup.Item>
            <ListItem unstyled onPress={() => ref.current?.hide()} className=' text-center' size={'$4.5'} justifyContent='center'>
              <Text className='text-base font-firabold text-white'>CANCEL</Text>
            </ListItem>
          </YGroup.Item>
        </YGroup>
      </YStack>
    </ActionSheet>
  )
}

export default UserPhotoActionSheet