// @flow
import {Wrap} from 'unmutable-lite';

export const gapiSheetValues = () => {
    let values = Wrap(gapi)
        .getIn(['client','sheets','spreadsheets','values'])
        .done();

    if(!values) {
        throw new Error(`gapi global variable (api v4) and gapi.sheets must be loaded`);
    }
    return values;
};

export const rowToObject = (row: Array<*>, keys: Array<string>): Object => {
    return row
        .reduce((obj, value, key) => {
            let columnName = keys[key];
            if(columnName) {
                obj[columnName] = value;
            }
            return obj;
        }, {});
};

export const rowFromObject = (obj: Object, keys: Array<string>): Array<*> => {
    return keys.map(ii => obj[ii]);
};

export const addNewId = (obj: Object): Object => ({
    ...obj,
     _id: generateId()
});

export const generateId = () => {
    return new Date().valueOf().toString(36) + Math.random().toString(36).substr(2);
};
