import csv from 'csvtojson';

export const getCsvData = async (csvFilePath) => {
  return await csv({ checkType: true }).fromFile(csvFilePath);
}
