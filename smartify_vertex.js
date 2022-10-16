const Stringer = require('stream-json/jsonl/Stringer');
const {parser}   = require('stream-json/jsonl/Parser');
const {chain}    = require('stream-chain');

const fs = require('fs');
const zlib = require('zlib');

console.log(process.argv);
let inFile = process.argv[2];
let outFile = inFile.split('_')[0] + ".json.gz";

chain([
    fs.createReadStream(inFile, { highWaterMark: 1024 * 1024}),
    zlib.createGunzip(),
    parser(),
    data => {
	var d = data.value.data;
	if (d.hasOwnProperty("_key")) {
	    d.shard_by = d.orgId.substring(0,2);
	    d._key =  d.shard_by + ":" + d._key;
	    delete d._rev;
	    delete d._id;
	}
	return d;
    },
    new Stringer(),
    zlib.Gzip(),
    fs.createWriteStream(outFile)
]);
