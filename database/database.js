const fs = require('fs-extra');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');

function loadDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeJsonSync(dbPath, { users: {}, groups: {}, settings: {} });
  }
  return fs.readJsonSync(dbPath);
}

function saveDB(data) {
  fs.writeJsonSync(dbPath, data, { spaces: 2 });
}

module.exports = { loadDB, saveDB };
