import { useMemo, useState } from "react";
import { SETTINGS_KEY } from "../constants";

const useLocalStorage = () => {
    let def = {
        uppercase: false,
        lowercase: false,
        number: false,
        special_character: false,
        length: false
    }
    const data = useMemo(() => {
        let d = window.localStorage.getItem(SETTINGS_KEY)
        if(!d) return def;
        else return JSON.parse(d);
    }, []);
    const [conditions, setConditions] = useState(() => data);
    function setItem(item:Items, value: boolean){
        let d = window.localStorage.getItem(SETTINGS_KEY);
        if(d) {
            def = JSON.parse(d);
        }
        def[item] = value;
        setConditions(() => def);
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(def));
        return true;
    }


    function getItem(item: Items){
        let d = window.localStorage.getItem(SETTINGS_KEY);
        if(!d) return null;
        return JSON.parse(d)[item];
    }
    return {
        conditions,
        setItem,
        getItem,
    }
}

export type Items = 'uppercase' | 'lowercase' | 'number' | 'special_character' | 'length';


export default useLocalStorage;