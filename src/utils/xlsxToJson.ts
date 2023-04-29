import * as excelToJson from 'convert-excel-to-json';
export const xlsxToJson = (sourceFile: string): any[] => {
  try {
    const data = excelToJson({
      sourceFile,
      header: {
        rows: 1,
      },
      columnToKey: {
        '*': '{{columnHeader}}',
      },
    });
    return data?.['Entities'];
  } catch (err) {
    console.log(err);
  }
};
