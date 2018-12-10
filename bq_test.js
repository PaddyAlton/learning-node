// @flow
require('dotenv').load();

const {BigQuery} = require('@google-cloud/bigquery');
const fs = require('fs')

function getBigqueryClient() {
  const projectId = process.env.PROJECT_ID;
  const keyFilename = process.env.CREDENTIALS;
  return new BigQuery({projectId, keyFilename});
};

async function createNewDataset(datasetId) {

  const bq_client = getBigqueryClient();

  try {
    const results = await bq_client.createDataset(datasetId);
    const [dataset] = results;
    console.log(`Dataset ${dataset.id} created.`);
    return true;
  } catch (err) {
    console.error('ERROR:', err);
    throw err;
  };
};

async function createNewTable(datasetId, tableId, options) {
  const bq_client = getBigqueryClient();
  const dataset = bq_client.dataset(datasetId); // reference for the pre-existing dataset
  const [table] = await dataset.createTable(tableId, options);

  return table;
};

// createNewTable.then( (table) => console.log(table) )

async function writeJsonToTable(datasetId, tableId, data, metadata) {
  const bq_client = getBigqueryClient();
  const dataset = bq_client.dataset(datasetId); // reference for the pre-existing dataset

  let table = dataset.table(tableId); // reference for the pre-existing table

  const [tableExists] = await table.exists();

  if (!tableExists) {
    table = await createNewTable(datasetId, tableId);
  }

  [metadata, apiResponse] = await table.setMetadata(metadata)

  await table.insert(data);

  console.log(`Inserted ${data.length} rows`);
};

const ds_name = "testing123"

const data = [
  {
    _id: 1,
    date: "2018-12-01T13:00:28",
    animal: "monkey",
    action: "eating"
  },
  {
    _id: 2,
    date: "2018-12-02T03:10:03",
    animal: "lion",
    action: "sleeping"
  },
  {
    _id: 3,
    date: "2018-12-02T10:08:46",
    animal: "camel",
    action: "drinking"
  }
];

const metadata = {
  name: "zookeeper",
  description: "A table containing events at a zoo",
  schema: "_id:integer, date:datetime, animal:string, action:string"
};

writeJsonToTable(ds_name, "zookeeper", data, metadata).catch(console.error);
