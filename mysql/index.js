const express = require("express");
const mysql = require("mysql2");
const { faker } = require('@faker-js/faker');
let app = express();
let path = require("path");
let port = 8080;
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true })); //
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.listen(port,()=>{
    console.log("server created at port number",port);
});


app.use((req,res,next)=>{
console.log("request received");
next();
});

// function createRandomUser() {
//   return [faker.string.uuid(),faker.internet.username(),faker.internet.email(),faker.internet.password()];
// }

const connectionn = mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"dalta",
    password:"ilma@123"
});


// let user=[];
// for(let i=0;i<100;i++) {
//     user.push( createRandomUser());
// }
// let user =[ [105,'gulzar-ahmad','gulzar2@gmail.com','gulzar4562'], [106,'zuni','zuni@gmail.com','zuni4562']];


app.get("/users",(req,res)=>{
    let q = "select * from users";
try {
    connectionn.query(q,(err,result)=>{
        if(err) throw err;
res.render("home.ejs",{result});
});
}catch(err) {
    console.log("error",err);
}
});

app.get("/users/new",(req,res)=>{
res.render("new.ejs");
});

app.post("/users",(req,res)=>{
let {id,username,password,email} = req.body;
console.log(id,username,password,email);
let user= [id,username,email,password];
let q = "insert into users values (?,?,?,?)";
try {
    connectionn.query(q,user,(err,insert)=>{
        if(err) throw err;
        res.redirect("/users");
    });
}catch(err) {
   res.send("database error");
}
});

app.get("/users/:id",(req,res)=>{
    let {id} = req.params;
    let {userpassword} = req.params;
   let q2 = `SELECT * FROM users WHERE id = '${id}'`;
    try {
    connectionn.query(q2,(err,result)=>{
        if(err) throw err;
        console.log(result);
          console.log(userpassword);
res.render("edit.ejs",{result:result});
});
}catch(err) {
    console.log("error",err);
}
});

app.patch("/users/:id", (req, res) => {
    const { id } = req.params;
    const { username, userpassword } = req.body;

    const q1 = "SELECT password FROM users WHERE id = ?";

    connectionn.query(q1, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
     console.log(result);
        if (result.length === 0) {
            return res.send("User not found");
        }

        if (userpassword === result[0].password) {

            const q2 = "UPDATE users SET username = ? WHERE id = ?";

            connectionn.query(q2, [username, id], (err, updateResult) => {
                if (err) {
                    console.log(err);
                    return res.send("Update failed");
                }

                res.redirect("/users");
            });

        } else {
            res.send("Password not matched");
        }
    });
});

app.delete("/users/:id", (req, res) => {
    let { id } = req.params;

    const q = "DELETE FROM users WHERE id = ?";

    connectionn.query(q, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        console.log(result);
        res.redirect("/users");
    });
});
