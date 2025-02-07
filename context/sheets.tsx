import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import UserPhotoActionSheet from '@/components/UserPhotoActionSheet';
import CountryCodePickerSheet from '@/components/CountryCodePickerSheet';

registerSheet('user-photo-action-sheet', UserPhotoActionSheet);
registerSheet('country-code-action-sheet', CountryCodePickerSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
    interface Sheets {
        'user-photo-action-sheet': SheetDefinition<{
            payload: {
                message: string
            }
            returnValue: string;
        }>;
        'country-code-action-sheet': SheetDefinition<{
            payload: {
                countryCode: string
            }
            returnValue: string;
        }>
    }
}

export { };