"use strict";
// ファイルをコピーしたりする
const path = require("path");
const fs = require("fs-extra-promise");
const co = require("co");
const glob = require("glob");

// Honokaのdistフォルダ
const honoka_dist = "bower_components/Honoka/dist";
// 公開フォルダ
const public_dir = "public";

/**
 * globをPromiseで包む
 */
function globAsync(pattern, options) {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
}

/**
 * fs.stat を Promise で包み、statsが得られたら trueを返す
 */
function existsAsync(file_path) {
  return new Promise((resolve, reject) => {
    fs.stat(file_path, (err, stats) => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

/**
 * プログラムのエントリポイント
 */
(function() {
  co(function*(){
    // Honokaのdist 以下を public/lib 以下にコピー
    const files = yield globAsync("**/*", { cwd: honoka_dist });
    // コピー先
    const distPath = path.resolve(__dirname, public_dir, "lib");

    for(let i=0; i<files.length; i++) {
      const source = path.resolve(__dirname, honoka_dist, files[i]);
      const dist = path.resolve(distPath, files[i]);

      yield fs.copyAsync(source, dist);
      console.log(`${source} -> ${dist}`);
    }

  }).catch((err) => {
    console.error(err);
  });
})();
