const fs = require('fs');
const path = require('path');

function mkdirDeep(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return true;
    }
    if (mkdirDeep(path.dirname(filePath))) {
      fs.mkdirSync(filePath);
      return true;
    }
  } catch (e) {
    console.error('mkdir', e);
  }
  return false;
}

module.exports = {
  fileExists(filePath) {
    let res = false;
    try {
      res = fs.statSync(filePath).isFile();
    } catch (err) {
      // console.log('fileExists error', err)
    }
    return res;
  },
  rmFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error('removeFile', e);
    }
  },
  writeFile(distFilePath, content) {
    try {
      mkdirDeep(path.dirname(distFilePath));
      fs.writeFileSync(distFilePath, content);
    } catch (e) {
      console.error('writeFile', e);
    }
  },
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      console.error('readFile', e);
    }
  },
  copyFile(filePath, distFilePath) {
    try {
      fs.writeFileSync(distFilePath, fs.readFileSync(filePath));
    } catch (e) {
      console.error('copyFile', e);
    }
  },
  mkdir(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
        return true;
      }
    } catch (e) {
      console.error('mkdir', e);
    }
    return false;
  },
  rmdir(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.rmdirSync(filePath);
      }
    } catch (e) {
      console.error('mkdir', e);
    }
  },
  mkdirDeep,
};
