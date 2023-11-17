
var express = require("express");

var app = express();
var cors = require("cors");
app.use(cors());
var mysql = require("mysql");

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
app.set("view engine", "ejs");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "enyo",
});

conn.connect(function (err) {
  if (err) throw err;

  console.log("Connection Sucessful");
});



app.get("/", function (req, res) {
  res.render("insert");
});



app.post("/getdata", function (req, res) {
  var email = req.body.email.toString();
  var password =req.body.password;

  var found = false;
  var code = req.body.code;
  var sql = `Select * from user where email = '${email}' and code = '${code}'`;
  conn.query(sql, function (err, results) {
    if(results.length>0)
      res.send(true);
    else
      res.send(true);      
        
    });
  });

var server = app.listen(4000, function () {
  console.log("App running on port 4000");
});
