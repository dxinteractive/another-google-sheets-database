// @flow
import {Wrap} from 'unmutable-lite';
import {gapiSheetValues, rowToObject, rowFromObject, addNewId} from './Utils';

const DEFAULT_CONFIG: Object = {
    columnLimit: 'Y',
    valueInputOption: 'RAW'
};

export default class SheetsRequester {
    _config: Object;

    constructor(config: Object = {}) {
        this._config = {
            ...DEFAULT_CONFIG,
            ...config
        };
    }

    clone: Function = (newConfig: Object = {}): SheetsRequester => new SheetsRequester({
        ...this._config,
        ...newConfig
    });

    sheet: Function = (sheet: string) => this.clone({sheet});

    keys: Function = () => {
        const {
            columnLimit,
            sheet,
            spreadsheetId
        } = this._config;

        if(!sheet) {
            throw new Error(`sheet name must be set (use SheetsRequester.sheet(sheet: string))`);
        }

        return gapiSheetValues()
            .get({
                spreadsheetId,
                range: `${sheet}!A1:${columnLimit}1`
            })
            .then(
                (response) => Wrap(response)
                    .getIn(['result','values',0])
                    .done(),
                (error) => Promise.reject(error)
            );

        // todo error if _id is not a key?
    };

    list: Function = () => {
        const {
            columnLimit,
            sheet,
            spreadsheetId
        } = this._config;

        if(!sheet) {
            throw new Error(`sheet name must be set (use SheetsRequester.sheet(sheet: string))`);
        }

        return gapiSheetValues()
            .get({
                spreadsheetId,
                range: `${sheet}!A1:${columnLimit}`
            })
            .then(
                (response) => {
                    let values = Wrap(response).getIn(['result','values']);
                    let keys = values.first().done();
                    return values
                        .rest()
                        .done() // flip this once map() is in unmutable-lite
                        .map(ii => rowToObject(ii, keys));
                },
                (error) => Promise.reject(error)
            );
    };

    push: Function = (item: Object) => {
        const {
            columnLimit,
            sheet,
            spreadsheetId,
            valueInputOption
        } = this._config;

        if(!sheet) {
            throw new Error(`sheet name must be set (use SheetsRequester.sheet(sheet: string))`);
        }

        return this.keys()
            .then((keys) => {
                let row: Array<*> = rowFromObject(addNewId(item), keys);
                return gapiSheetValues()
                    .append({
                        spreadsheetId,
                        range: `${sheet}!A1:${columnLimit}`,
                        valueInputOption,
                        resource: {
                            values: [row]
                        }
                    });
;           });
    };
}
