// build.js
"use strict";
const fs = require("fs");
const co = require("co");
const marked = require("marked");

// public フォルダを作成し、docsの内容をコピーする。
// その際、markdownファイルの場合はmarkedでHTMLに変換した後
// ejsでtemplateに埋め込んで同名のhtmlファイルを作成する。

const Util = {
  read: function(filepath, opts) {
    // option組み立て
    const defaultOptions = { encoding: "utf-8" };
    let options = opts || {};
    options = Object.assign(options, defaultOptions);

    return new Promise(function(resolve, reject) {
      fs.readFile(filepath, options, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  write: function(filepath, data, opts) {
    // option組み立て
    const defaultOptions = { encoding: "utf-8" };
    let options = opts || {};
    options = Object.assign(options, defaultOptions);

    return new Promise(function(resolve, reject) {
      fs.writeFile(filepath, data, options, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(filepath);
        }
      });
    });
  }
};


co(function*(){
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true
  });

  // read file
  const data = yield Util.read("README.md");
  // markdown -> html
  const html = marked(data);
  // write file
  yield Util.write("about.html", html);

}).catch(function(err) {
  console.error(err.stack);
});
