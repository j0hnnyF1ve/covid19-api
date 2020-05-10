const dataReader = require('./dataReader');
const batchWriter = require('./batchWriter');

const run = async () => {
    let startFetch, startWrite, endWrite;

    try {
        startFetch = Date.now();
        let json = await dataReader.fetchDailyJson();

        startWrite = Date.now();
        console.log('before batch write');
        let transactions = await batchWriter({ json, pastRecords: 2 });
        console.log('after batch write');
        endWrite = Date.now();

        console.log('');
        console.log(`Fetch: ${startWrite - startFetch}ms (${(startWrite - startFetch)/1000}s) elapsed`);
        console.log(`Write: ${endWrite - startWrite}ms (${(endWrite - startWrite)/1000}s) elapsed`);
        console.log(`Total transactions written: ${transactions.length}`);
    }
    catch(e) {
        console.log('Error (run)', e);
    }
};
run();

