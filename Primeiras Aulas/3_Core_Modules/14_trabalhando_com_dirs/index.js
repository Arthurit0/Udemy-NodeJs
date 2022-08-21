const fs = require('fs');

if (!fs.existsSync('./minhapasta')) {
  console.log('Não existe, e será criada');
  fs.mkdirSync('minhapasta');
} else {
  console.log('Existe');
}
