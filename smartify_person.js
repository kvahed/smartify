var fs = require('fs'),
JSONStream = require('JSONStream'),
es = require('event-stream')
data = [],
fname = "person_8b0a44048f58988b486bdd0d245b22a8.data.json",
getStream = function (fname) {
  var jsonData = fname,
      stream = fs.createReadStream(jsonData, { encoding: 'utf8' }),
      parser = JSONStream.parse('*');
  return stream.pipe(parser);
},
getStream("/home/ubuntu/new/" + fname).pipe(es.mapSync(function (d) {
  if (d.hasOwnProperty("_key")) {
    d.shard_by = d.orgId.substring(0,2);
    d._key = d.shard_by + ":" + d._key;
    data.push(d);
  }
}));

var outputStream = fs.createWriteStream(fname + ".new"),
    transformStream = JSONStream.stringify();
transformStream.pipe( outputStream );
for(var i =0; i<=data.length-1; i++) {
  transformStream.write(data.splice(0,10000));
}
transformStream.end();
outputStream.on(
  "finish",
  function handleFinish() {
    console.log("Done writing");
  }
);

