var mustache = require('mustache');
var fs = require('fs');
var Q = require('q');

var files = [
  { name: 'NPR Heart',      path: 'heart-track' },
  { name: 'NPR Hate',       path: 'hate-track' },
  { name: 'NPR Heart List', path: 'print-heart-list' },
  { name: 'NPR Hate List',  path: 'print-hate-list' },
];

Q.all(files.map(function(file) {
  var d = Q.defer();
  fs.readFile(file.path + '.js', 'utf-8', function(err, res) {
    if (err) {
      failure('Could not read in ' + file + '.js');
    } else {
      d.resolve({
        name: file.name,
        code: convert(res)
      });
    }
  });
  return d.promise;
})).then(function(bookmarklets) {
  fs.readFile('index.mst', 'utf-8', function(err, res) {
    if (err) {
      failure('Could not read in index.mst');
    } else {
      fs.writeFile('index.html', mustache.render(res, { bookmarklets: bookmarklets }), function(err) {
        if (err) {
          failure('Could not write index.html');
        } else {
          success("Job's finished! Serve this dir to find the bookmarklets");
        }
      });
    }
  });
});

function failure(msg) {
  console.log(msg);
  process.exit(1);
}

function success(msg) {
  console.log(msg);
  process.exit();
}

function convert(str) {
  return 'javascript:(function() { ' + str.replace(/\r?\n|\r/g, '') + '})()';
}
