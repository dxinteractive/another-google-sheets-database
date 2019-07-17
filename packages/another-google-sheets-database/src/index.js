// @flow
import {toString26} from './convert26';

export type GetSheetCellsParams = {
    spreadsheetId: string,
    range?: string,
    sheetName?: string,
    cellRange?: string
};

export const getSheetCells = async (params: GetSheetCellsParams): Promise<any[][]> => {

    if(!params.range && params.sheetName && params.cellRange) {
        let {sheetName, cellRange, ...rest} = params;
        params = {
            ...rest,
            range: `${sheetName}!${cellRange}`
        };
    }

    let response = await window.gapi.client.sheets.spreadsheets.values.get(params);
    if(response.statusText !== "OK") {
        return Promise.reject();
    }
    return response.result.values || [[null]];
};

export type SetSheetCellsParams = {
    spreadsheetId: string,
    range?: string,
    sheetName?: string,
    cellRange?: string,
    values: any[][]
};

export const setSheetCells = async (params: SetSheetCellsParams): Promise<any[][]> => {

    if(!params.range && params.sheetName && params.cellRange) {
        let {sheetName, cellRange, ...rest} = params;
        params = {
            ...rest,
            range: `${sheetName}!${cellRange}`
        };
    }

    let response = await window.gapi.client.sheets.spreadsheets.values.update(params);
    if(response.statusText !== "OK") {
        return Promise.reject();
    }
    return response.result.values || [[null]];
};

export type ClearSheetCellsParams = {
    spreadsheetId: string,
    range?: string,
    sheetName?: string,
    cellRange?: string
};

export const clearSheetCells = async (params: ClearSheetCellsParams): Promise<any> => {

    if(!params.range && params.sheetName && params.cellRange) {
        let {sheetName, cellRange, ...rest} = params;
        params = {
            ...rest,
            range: `${sheetName}!${cellRange}`
        };
    }

    let response = await window.gapi.client.sheets.spreadsheets.values.clear(params);
    if(response.statusText !== "OK") {
        return Promise.reject();
    }
    return;
};

export type GetSheetColumnsParams = {
    spreadsheetId: string,
    sheetName: string,
    lastColumn: string
};

export const getSheetColumns = async (params: GetSheetColumnsParams): Promise<string[]> => {
    let {
        spreadsheetId,
        sheetName,
        lastColumn
    } = params;

    let columns = (await getSheetCells({
        spreadsheetId,
        sheetName,
        cellRange: `A1:${lastColumn}1`
    }))[0];

    return columns;
};

export type GetSheetRowsParams = {
    spreadsheetId: string,
    sheetName: string
};

export const getSheetRows = async (params: GetSheetRowsParams): Promise<{columns: string[], rows: any[]}> => {
    let defaults = {
        lastColumn: 'CZ',
        lastRow: '1000',
        valueRenderOption: 'UNFORMATTED_VALUE'
    };

    let paramsWithDefaults = {...defaults, ...params};

    let {
        spreadsheetId,
        sheetName,
        lastColumn,
        lastRow,
        valueRenderOption
    } = paramsWithDefaults;

    let columns = await getSheetColumns({
        spreadsheetId,
        sheetName,
        lastColumn
    });

    let lastCell = toString26(columns.length).toUpperCase();

    let cells = await getSheetCells({
        spreadsheetId,
        sheetName,
        cellRange: `A2:${lastCell}${lastRow}`,
        valueRenderOption
    });

    let rowCellsToObject = (row: any[]): {[key: string]: any} => {
        return row.reduce((obj, value, index) => {
            obj[columns[index]] = value;
            return obj;
        }, {});
    };

    let rows = cells.map(rowCellsToObject);
    return {columns, rows};
};

export type SetSheetRowsParams = {
    spreadsheetId: string,
    sheetName: string,
    rows: Array<{[key: string]: any}>
};

export const setSheetRows = async (params: SetSheetRowsParams): Promise<any> => {
    let defaults = {
        lastColumn: 'CZ',
        lastRow: '1000'
    };

    let paramsWithDefaults = {...defaults, ...params};

    let {
        spreadsheetId,
        sheetName,
        rows,
        lastColumn,
        lastRow
    } = paramsWithDefaults;

    if(rows.length === 0) {
        return;
    }

    let columns = await getSheetColumns({
        spreadsheetId,
        sheetName,
        lastColumn
    });

    let newKeys = Object.keys(rows[0])
        .filter(key => columns.indexOf(key) === -1);

    columns = columns.concat(newKeys);

    let lastCell = toString26(columns.length).toUpperCase();
    let cellRange = `A1:${lastCell}${lastRow}`;

    let values = [
        columns,
        ...rows.map((row) => columns.map(column => row[column]))
    ];

    await clearSheetCells({
        spreadsheetId,
        sheetName,
        cellRange
    });

    await setSheetCells({
        spreadsheetId,
        sheetName,
        cellRange,
        valueInputOption: 'RAW',
        values
    });
};

export type GetJSONBlobParams = {
    spreadsheetId: string,
    sheetName: string
};

export const getJSONBlob = async (params: GetJSONBlobParams): Promise<any> => {
    let {
        spreadsheetId,
        sheetName
    } = params;

    let cells = (await getSheetCells({
        spreadsheetId,
        sheetName,
        cellRange: `A1:B2`
    }));

    let theCell = cells[0][0] || '';

    return JSON.parse(theCell);
};

export type SetJSONBlobParams = {
    spreadsheetId: string,
    sheetName: string,
    value: any
};

export const setJSONBlob = async (params: SetJSONBlobParams): Promise<any> => {
    let {
        spreadsheetId,
        sheetName,
        value
    } = params;

    let stringified = JSON.stringify(value);

    await setSheetCells({
        spreadsheetId,
        sheetName,
        cellRange: `A1:B2`,
        valueInputOption: 'RAW',
        values: [[stringified]]
    });
};
