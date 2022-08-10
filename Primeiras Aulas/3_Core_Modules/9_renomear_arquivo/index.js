const fs = require('fs');

const oldFile = 'arquivo.txt';
const newFile = 'novo.txt';

fs.rename(oldFile, newFile, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Arquivo renomeado de ${oldFile} para ${newFile}`);
});
