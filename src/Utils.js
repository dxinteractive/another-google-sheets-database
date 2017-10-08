// @flow
import {Wrap} from 'unmutable-lite';

export const gapiSheetValues = () => {
    let values = Wrap(gapi)
        .getIn(['client','sheets','spreadsheets','values'])
        .value;

    if(!values) {
        throw new Error(`gapi global variable (api v4) and gapi.sheets must be loaded`);
    }
    return values;
};

export const toSheetValue = (value: *): string|number|boolean => {
    if(['number', 'boolean', 'string'].indexOf(typeof value) === -1) {
        return `"${JSON.stringify(value)}"`;
    }
    if(typeof value === "string" && value.slice(0, 1) === '"') {
        return `"${value}"`;
    }
    return value;
};

export const fromSheetValue = (value: string|number|boolean): * => {
    if(typeof value !== "string") {
        return value;
    }
    if(value.slice(0, 1) === '"') {
        return JSON.parse(value.slice(1, -1));
    }
    return value;
}

export const fromSheetRow = (row: Array<*>, index: number, keys: Array<string>): Object => {
    return row
        .reduce((obj, value, key) => {
            let columnName = keys[key];
            if(columnName) {
                obj[columnName] = fromSheetValue(value);
            }
            return obj;
        }, {
            id: index // default the index to row number
        });
};

export const toSheetRow = (obj: Object, keys: Array<string>): Array<*> => {
    return keys.map(ii => toSheetValue(obj[ii]));
};

export const addNewId = (obj: Object): Object => ({
    ...obj,
     id: generateId()
});

export const generateId = () => {
    return Math.random().toString(36).substr(2) + new Date().valueOf().toString(36);
};
