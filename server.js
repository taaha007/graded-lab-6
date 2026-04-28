var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (req, res) {

  if (req.method === 'GET') {
    var formHTML = fs.readFileSync(path.join(__dirname, 'protectaccess.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(formHTML);
    res.end();
  }

  if (req.method === 'POST') {
    var body = '';

    req.on('data', function (data) {
      body += data;
    });

    req.on('end', function () {

      var params = new URLSearchParams(body);
      var name = params.get('name');
      var pw = params.get('pw');
      var IDnumber = params.get('IDnumber');

      var nameValid = true;
      if (name === '') {
        nameValid = false;
      }
      if (/^\d+$/.test(name)) {
        nameValid = false;
      }
      var pwValid = true;
      if (pw.length < 10) {
        pwValid = false;
      }
      if (!/[a-zA-Z]/.test(pw)) {
        pwValid = false;
      }
      if (!/[0-9]/.test(pw)) {
        pwValid = false;
      }
      var idValid = true;
      if (/\./.test(IDnumber)) {
        idValid = false;
      }
      if (!/^(\d{3}-\d{3}-\d{3}-\d{3}|\d{12})$/.test(IDnumber)) {
        idValid = false;
      }
      var pwStars = pw.replace(/./g, '*');

      var cleanID = IDnumber.replace(/-/g, '');

      var allValid = nameValid && pwValid && idValid;

      var resultText = fs.readFileSync(path.join(__dirname, 'accessresults.txt'), 'utf8');

      res.writeHead(200, { 'Content-Type': 'text/html' });

      if (allValid) {
        res.write('<h1 style="color:green;">Successful.</h1>');
      } else {
        res.write('<h1 style="color:red;">Access Denied! Invalid data.</h1>');
      }

      res.write('<p>' + name + ', ' + pwStars + ', ' + cleanID + '</p>');
      res.write('<p>' + resultText + '</p>');
      res.end();
    });
  }

}).listen(8080);

console.log('Server running on port 8080');
