var concat = require('concat')
var minifier = require('minifier')
var fs = require('fs');


// Returns an array of all of the JS files in a directory
var getFiles = function(folder, ext) {
  var items = (fs.readdirSync(folder));
  var files = [];
  var folders = [];
  // For each item in the directory decide if it's a file or a folder
  for (var i=0; i<items.length; i++) {
    if (items[i].indexOf('.') === -1) {
      folders.push(items[i])
    } else if (items[i].indexOf(ext) >= 0) {
      files.push(folder + '/' + items[i])
    }
  }
  // For each folder call getJS. Recursion!
  for (var i=0; i<folders.length; i++) {
    files = files.concat(getFiles(folder + '/' + folders[i], ext));
  }
  return files
}

var arr = getFiles('js', '.js');

concat(arr, 'build.js', function (error) { 

  minifier.minify("./build.js")

});



concat(['style/Mazama_databrowser_base.css', 'style/Mazama_databrowser.css'], 'build.css', function (error) { 

  minifier.minify("./build.css")

});



