import { UserSpecification } from "@/models/user";
import axiosRequest from "@/utils/axios";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useEffect } from "react";
import { Alert, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { YStack, XStack, Sheet, Form } from "tamagui";
import CustomButton from "./CustomButton";
import SelectPicker from "./SelectPicker";
import Toast from "./toast/toast";
import FormField from "./FormField";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLoader } from "@/context/loader/LoaderProvider";

const SpecificationData = ({ item, editable, onEditDone }: { item: UserSpecification, editable: boolean, onEditDone?: () => void }) => {
    const [editSpecificationModalVisible, setEditSpecificationModalVisible] = useState(false);
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [options, setOptions] = useState<any>([]);
    const [shouldUseSelector, setShouldUseSelector] = useState(item.items.some(item => item.input_type === 'select'));
    const {show, hide} = useLoader();

    const insets = useSafeAreaInsets();

    const toggleEditModal = useCallback(() => setEditSpecificationModalVisible(!editSpecificationModalVisible), [editSpecificationModalVisible]);

    useEffect(() => {
        const { items } = item
        const optionsArray = items.map(item => {
            return {
                [item.name]: Object.entries(item.options).map(([id, value]) => ({
                    id,
                    value,
                }))
            }
        })

        const options = optionsArray.reduce((acc, item) => {
            const key = Object.keys(item)[0];
            acc[key] = item[key];
            return acc;
        }, {});
        setOptions(options);

        const formItems = item.items.map(item => {
            return {
                [item.name]: item.selected_options,
            }
        })
        const form = formItems.reduce((acc, item) => {
            const key = Object.keys(item)[0];
            acc[key] = item[key];
            return acc;
        }, {});
        setFormData(form);
    }, [item.items])

    const updateForm = useCallback(<K extends keyof any>(key: K, value: any[K]) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }, [formData])

    const updateSpecificationData = async () => {
        try {
            show();
            await axiosRequest.post(`/update-profile-settings`, formData);
            hide();
            Toast.success('Profile updated successfully');
            toggleEditModal();
            onEditDone && onEditDone();
        } catch (error: any) {
            hide();
            console.log('error', error);
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to update')
        }
    }

    return (
        <>
            <YStack gap="$3" key={item.title}>
                <XStack gap="$4" justifyContent='space-between' alignItems='center'>
                    <Text className='text-sm text-white font-firamedium'>{item.title}</Text>
                    {editable && <TouchableOpacity onPress={toggleEditModal} activeOpacity={0.8}>
                        <XStack>
                            <Text className='text-sm text-[#DD3FE5] font-firaregular'>Edit</Text>
                            <Feather name="edit-3" size={16} color="#DD3FE5" />
                        </XStack>
                    </TouchableOpacity>}
                </XStack>
                <YStack gap="$3">
                    <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                        <YStack gap="$4">
                            <XStack gap="$4" flexWrap="wrap">

                                {item.items.map((data, index) => {
                                    return (
                                        <View key={data.label} className='flex-[0_0_45%] space-y-1'>
                                            <Text className='text-sm font-firamedium text-white'>{data.label} </Text>
                                            <Text className='text-white'>{data.value || "-"}</Text>
                                        </View>
                                    )
                                })}
                            </XStack>
                        </YStack>
                    </View>
                </YStack>
            </YStack>
            <Sheet
                forceRemoveScrollEnabled={editSpecificationModalVisible}
                modal={true}
                open={editSpecificationModalVisible}
                disableDrag={true}
                onOpenChange={setEditSpecificationModalVisible}
                snapPoints={[100]}
                snapPointsMode={'percent'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="medium"
            >
                <Sheet.Overlay
                    animation="medium"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame gap="$5" backgroundColor={'#1A1A1A'}>
                    <View style={{paddingTop: insets.top, paddingBottom: insets.bottom}} className='bg-[#1A1A1A] h-full'>
                        <View className='bg-[#1A1A1A] flex-row items-center justify-center px-4 py-3 relative'>
                            <TouchableOpacity onPress={() => setEditSpecificationModalVisible(false)} className='absolute z-10 left-4 items-center justify-center pr-4'>
                                <Ionicons name="close" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <Text className='font-firabold text-white text-center flex-1 mx-auto text-base'>Edit {item.title}</Text>
                        </View>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
                            <ScrollView className='px-4 py-2 h-full'>
                                <Form gap="$7">
                                    <YStack gap="$3">
                                        {Object.entries(formData).map((data, index) => {
                                            const key = data[0];
                                            const value = data[1];
                                            return (
                                                shouldUseSelector ? <SelectPicker key={index} options={options[key]} onSelectOption={(params) => updateForm(key, params)} defaultOption={value} title={key.split('_').join(' ')} />: 
                                                <FormField
                                            key={index}
                                            title={key.split('_').join(' ')}
                                            value={value}
                                            placeholder={`Enter ${key.split('_').join(' ')}`}
                                            handleChangeText={(text: string) => updateForm(key, text)}
                                        />
                                                // <FormField key={index} label={key.split('_').join(' ')} value={value} onChange={(value) => updateForm(key, value)}/>
                                            )
                                        })}
                                    </YStack>
                                    <Form.Trigger asChild>
                                        <View>
                                            <CustomButton title='Save Changes' handlePress={updateSpecificationData} />
                                            <View className='h-5' />
                                        </View>
                                    </Form.Trigger>
                                </Form>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}

export default SpecificationData