var express = require('express');
var router = express.Router();
const fs = require('fs');
const translate = require('translate');

function getFiles (dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
          getFiles(name, files_);
      } else {
          if(name.includes(".tsx"))
          files_.push(name);
      }
  }
  return files_;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  
  let dirCont = fs.readdirSync('/home/ducnm/Desktop/Front End');
  let files = dirCont.filter( function( elm ) {return elm.match(/.*\.(tsx?tsx)/ig);});
  files = getFiles('/home/ducnm/Desktop/Front End');
  let strings = [];
  files.forEach(file => {
    // looping code
    const str = fs.readFileSync(file, 'utf8');
    if(str == null) {
      return;
    }
    var result = str.match(/<Trans>(.*?)<\/Trans>/g);
    if(result == null) {
      return;
    }
    result.map(function(val){
      val = val.replace("<Trans>","");
      val = val.replace("<\/Trans>","");
      strings.push(val);
      
      return;
    });
  });
  strings = strings.filter(function(elem, pos) {
    return strings.indexOf(elem) == pos;
  });
  try {
    var stats = fs.statSync('result.txt');
    fs.unlinkSync('result.txt');
  }
  catch(err) {
      console.log('it does not exist');
  }
  translate.engine = 'yandex';

  translate.key = 'trnsl.1.1.20200319T085143Z.d2710a7eafd76b2f.3595dfacce2303402350097531754097276a3317';
  strings.forEach(str => {
    translate(str, { from: 'en', to: 'vi' }).then(text => {
      str = '"' + str + '"' + ':' + '"' + text + '"' + ",";
      fs.appendFileSync('result.txt', str +'\n', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    });

    
  });
  
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
