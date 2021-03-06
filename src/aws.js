const AWS = require('aws-sdk');
const region = 'us-east-1';
// const region = 'us-west-2';
AWS.config.update({
    // region: 'us-west-2',
    // endpoint: "https://dynamodb.us-west-2.amazonaws.com"
    region: 'us-east-1',
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"

});
const docClient = new AWS.DynamoDB.DocumentClient();

const batchWrite = async items => {
    if(!items || items.length <= 0) { throw '(batchWrite) No items for batchWrite!'; }
    if(items.length > 25) { throw '(batchWrite) Maximum of 25 items can be written!'; }

    let requestItems = items.map( entry => ({
        PutRequest: {
            Item: entry
        }
    }) );

    let params = { RequestItems: {
            'covidData': requestItems
        }
    };
    return await docClient.batchWrite(params).promise();
    console.log('Items written to DynamoDB:', requestItems);
};

const queryRegionCountry = async (hashKey, secondaryKey) => {
    if(!hashKey) { throw '(query) hashKey is missing'; }

    return await docClient.query({
        TableName: 'covidData',
        KeyConditionExpression: '#hashkey = :hkey',
        ExpressionAttributeNames: { '#hashkey': 'regionCountry' },
        ExpressionAttributeValues: {
            ':hkey': hashKey
        }
    }).promise();
};

const queryTimestamp = async (hashKey, secondaryKey) => {
    if(!hashKey) { throw '(query) hashKey is missing'; }

    return await docClient.query({
        TableName: 'covidData',
        IndexName: 'timestamp-regionCountry-index',
        KeyConditionExpression: '#hashkey = :hkey',
        ExpressionAttributeNames: { 
            '#hashkey': 'timestamp'
        },
        ExpressionAttributeValues: {
            ':hkey': hashKey
        }
    }).promise();
};

module.exports = {
    batchWrite,
    queryRegionCountry,
    queryTimestamp
};