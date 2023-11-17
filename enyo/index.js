
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

app.post("/insert", function (req, res) {
  var code = Math.floor(Math.random()*90000);
  const nodemailer = require("nodemailer");
  var name = req.body.name;
  var password = req.body.password;
  var email = req.body.email;
  var longitude = req.body.longitude;
  var lattitude = req.body.lattitude;
  var usertype = req.body.usertype;
  password = bcrypt.hashSync(password, salt);
    var message = "Use the following code to aunthenticate your account " + code;
    let testAccount = nodemailer.createTestAccount();
     const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'sage86@ethereal.email',
          pass: 'N5NhkJfTEaFy4RTE5U'
      }
    });
    let info = transporter.sendMail({
      from: '"Enyo" <enyo@gmail.email>', // sender address
      to: email, // list of receivers
      subject: "Verification code", // Subject line
      text: message, // plain text body
      html: "<h1 style='color:red;'>Mail through node mailer "+code+"</h1>", // html body
    });
      var sql = `insert into user(name, password, email, lattitude, longitude, usertype, code) values('${name}','${password}','${email}','${lattitude}','${longitude}','${usertype}','${code}' )`;

  conn.query(sql, function (err, results) {
    if (err) throw err;

    res.send("<h1>Data Inserted.</h1>");

  });
});

app.post("/getdata", function (req, res) {
  var email = req.body.email.toString();
  var password =req.body.password;
  var sql = `select * from user where email='${email}'`;
  var found = false;
  conn.query(sql, function (err, results) {
    if (err)
        throw err;
        if (results.length > 0) {
          console.log(results);
          res.send(results);
        } else {
          res.status(404).send("Email not found"); // Send an error status if email does not exist
        }
  });
}); 


app.post("/authenticate", function (req, res) {
  var email = req.body.email;
  var code = req.body.code;

  var sql = `SELECT * FROM user WHERE email = '${email}' AND code = '${code}'`;
  conn.query(sql, function (err, results) {
    if (err) throw err;

    if (results.length > 0) {
      // Update authenticate column to true
      var updateSql = `UPDATE user SET authenticated = true WHERE email = '${email}' AND code = '${code}'`;
      conn.query(updateSql, function (err, updateResult) {
        if (err) throw err;

        res.send(true);
      });
    } else {
      res.send(false);
    }
  });
});

app.post("/updatename", function (req, res) {
  var email = req.body.email;
  var name = req.body.name;

  var sql = `SELECT * FROM user WHERE email = '${email}'`;
  conn.query(sql, function (err, results) {
    if (err) throw err;

    if (results.length > 0) {
      var updateSql = `UPDATE user SET name = '${name}' WHERE email = '${email}'`;
      conn.query(updateSql, function (err, updateResult) {
        if (err) throw err;

        res.send(true);
      });
    } else {
      res.send(false);
    }
  });
});

app.post("/updatepassword", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var sql = `SELECT * FROM user WHERE email = '${email}'`;
  password = bcrypt.hashSync(password, salt);
  conn.query(sql, function (err, results) {
    if (err) throw err;

    if (results.length > 0) {
      var updateSql = `UPDATE user SET password = '${password}' WHERE email = '${email}'`;
      conn.query(updateSql, function (err, updateResult) {
        if (err) throw err;

        res.send(true);
      });
    } else {
      res.send(false);
    }
  });
});

app.post("/deleteUser", function (req, res) {
  var email = req.body.email;

  var sql = `Delete FROM user WHERE email = '${email}'`;
  conn.query(sql, function (err, results) {
    if (err) throw err;
        res.send(true);
    });
  });

var server = app.listen(4000, function () {
  console.log("App running on port 4000");
});
