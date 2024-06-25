import { existsSync, rmSync } from "fs";
import { appendFile } from "node:fs/promises";
import process from "node:process";
import mockData from './tests/MOCK_DATA.json' assert { type: "json" };

const outputFile = 'tests/MOCK_DATA_DUPLICATED.json';



const createMockDataRows = async (duplicateTimes = 500) => {
    const outputRows = `tests/MOCK_DATA_DUPLICATED_ROWS_${duplicateTimes}.json`;
    const outputExists = existsSync(outputFile);
    if (outputExists) {
        rmSync(outputRows);
    }
    await appendFile(outputRows, '[');
    for (let i = 0; i < duplicateTimes; i++) {
        console.log(i);
        for (let j = 0; j < mockData.length; j++) {
            const commaString = duplicateTimes - 1 === i && mockData.length - 1 === j ? '' : ',\n'
            const objectData = JSON.stringify({
                ...mockData[j], 
                id:(i * duplicateTimes) + (j * mockData.length) + Number(mockData[j].id)
            }) + commaString;
            await appendFile(outputRows, objectData);
        }
    }
    await appendFile(outputRows, ']');
}

console.log('START:::::::', Number(process.argv[2]));
createMockDataRows(Number(process.argv[2]) || 1000);