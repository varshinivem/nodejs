const http = require('http');
const fs = require('fs');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient('mongodb+srv://varshini:Password123@atlascluster.xd0yebp.mongodb.net/?retryWrites=true&w=majority');

//to handle cors
header_cors = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods': 'GET','Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept'}

//create server
const server = http.createServer(async (req, res) => {
  const requestUrl = url.parse(req.url);
  const pathname = requestUrl.pathname;

  if (pathname === '/') {
    const filePath = './public/index.html';
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to fetch the index.html.');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
        }
    });
  } else if (pathname === '/api' & req.method === 'GET' ) {
      await client.connect();
      const collection = client.db('Booksdatabase').collection('books');
        const state_details = await collection.find({}).toArray();
        const state_details_json = JSON.stringify(state_details, 'NULL', 2);
        fs.writeFile('./public/db.json', state_details_json, 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Failed to fetch the data');
          } else {
            res.writeHead(200,header_cors);
            res.end(state_details_json);
          }
        });
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port 3000`);
});
