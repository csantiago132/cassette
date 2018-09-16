const child_process = require('child_process');
const fs = require('fs');
const prettier = require('prettier');

const prettierrc = require('./.prettierrc.json');

const stagedJSFiles = child_process
  .execSync('git diff --name-only --cached --diff-filter=ACMRTUB')
  .toString()
  .split('\n')
  .map(s => s.trim())
  .filter(filepath => filepath.indexOf('.js') === filepath.length - 3);

Promise.all(
  stagedJSFiles.map(filepath => readFile(filepath)).map(dataPromise => {
    return dataPromise.then(data => {
      if (
        !prettier.check(
          data.toString(),
          Object.assign({ parser: 'babylon' }, prettierrc)
        )
      ) {
        return Promise.reject();
      }
    });
  })
).catch(() => {
  console.error('Please run prettier: `npm run prettier`\n');
  process.exit(1);
});

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
