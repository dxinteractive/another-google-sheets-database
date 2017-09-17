// @flow
import {Wrap} from 'unmutable-lite';

const DEFAULT_CONFIG: Object = {
    columnLimit: 'Y'
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

    list: Function = () => {
        const {
            columnLimit,
            sheet,
            spreadsheetId
        } = this._config;

        const values = Wrap(gapi)
            .getIn(['client','sheets','spreadsheets','values'])
            .done();

        console.log()

        if(!values) {
            throw new Error(`gapi global variable (api v4) and gapi.sheets must be loaded`);
        }

        if(!sheet) {
            throw new Error(`sheet name must be set (use SheetsRequester.sheet(sheet: string))`);
        }

        console.log("?");

        return values
            .get({
                spreadsheetId,
                range: `${sheet}!A1:${columnLimit}`,
            })
            .then(
                (response) => {
                    let values = Wrap(response).getIn(['result','values']);
                    let keyLookup = values[0];

                    let keyRow = (row) => row
                        .reduce((obj, value, key) => {
                            obj[keyLookup[key]] = value;
                            return obj;
                        }, {});

                    return Wrap(values)
                        .rest() // Add rest to unmutable lite!!!
                        .map(keyRow)
                        .done();
                },
                (error) => {
                    console.log("ERROR", error);
                }
            );
    }
}
