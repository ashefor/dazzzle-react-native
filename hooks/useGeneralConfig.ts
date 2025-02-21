import { BasicAppInterface } from "@/models/general";
import { getItem } from "@/utils/asyncStorage";
import { useEffect, useState } from "react";

export function useGeneralConfig() {
    const [generalConfigSettings, setGeneralConfigSettings] = useState<BasicAppInterface>();
    useEffect(() => {
        try {
            getItem('generalConfigSettings').then((res) => {
                if (!res) {
                    throw new Error('Failed to load basic settings');
                }
                setGeneralConfigSettings(res);
            })
        } catch (error) {
            throw new Error('Failed to load basic settings');
        }
        return () => {
        };
    }, [])
    return generalConfigSettings

}