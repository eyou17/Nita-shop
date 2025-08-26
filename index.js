import express from "express";
import multer from "multer";
import fs from "fs";
import pg from "pg";
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";
import ngrok from "ngrok";

env.config();

const app = express();



app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());





app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // serve images from uploads/

const port = process.env.PORT;
const saltRound = 10;

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});


db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.set('view engine', 'ejs');
app.use(express.static('uploads')); // serve uploaded files

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });



app.get("/", async(req, res)=>{
    try{
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES}`);
        const data =result.rows;
        if(data.length !== 0){
            res.render("home.ejs",{data: data});
        }else{
            res.send("Sorry!, we ranout of stock.")
        }

    }catch(err){
        console.log(err)
    }
    
    
});

app.post("/update_user",async (req,res)=>{
 try{
    const newpassword = "customer@gmail";
    bcrypt.hash(newpassword, saltRound, async (err, hash)=>{
        if(err){console.log(err)}

        const result = await db.query(`UPDATE ${process.env.PG_TABLEC} SET password = $1 WHERE username = $2 RETURNING *`,[hash, req.body.email]);
        if(result.rows.length === 1){
            res.redirect("/admin_customer")
        }else{
            res.send("error")
        }


    })
    

 }catch(err){

 }
})



app.get("/signin", (req, res)=>{
    res.render("login.ejs")
});

app.get("/signup", (req, res)=>{
    res.render("signup.ejs")
});






app.get("/home", async (req, res)=>{
    
    if(req.isAuthenticated()){
       
       
         if(req.user[0].username === 'admin@gmail'){
            const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES}`);
                const data =result.rows;
                if(data.length !== 0){
                
                    
                     res.render("admin_home.ejs",{data: data});
                }
               
            }else{
                 const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES} WHERE shoes_quantity::int > 0`);
                const data =result.rows;
                if(data.length !== 0){
                
                    
                    res.render("customer_home.ejs",{data: data, user: req.user.username});
                }
            }
       
 
    }else{
        res.redirect("signin")
    }
});




app.get("/men", async (req, res)=>{
    
    if(req.isAuthenticated()){
       
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES} WHERE shoes_catagory = $1 AND shoes_quantity::int > 0`,['men']);
        const data =result.rows;
        if(data.length !== 0){
            
            res.render("customer_home.ejs",{data: data, user: req.user.email});
        }
 
    }else{
        res.redirect("signin")
    }
});

app.get("/women", async (req, res)=>{
    
    if(req.isAuthenticated()){
       
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES} WHERE shoes_catagory = $1 AND shoes_quantity::int > 0`,['women']);
        const data =result.rows;
        if(data.length !== 0){
            
            res.render("customer_home.ejs",{data: data, user: req.user.email});
        }
 
    }else{
        res.redirect("signin")
    }
});

app.get("/kid", async (req, res)=>{
    
    if(req.isAuthenticated()){
       
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES} WHERE shoes_catagory = $1 AND shoes_quantity::int > 0`,['kid']);
        const data =result.rows;
        if(data.length !== 0){
           
            res.render("customer_home.ejs",{data: data, user: req.user.email});
        }
 
    }else{
        res.redirect("signin")
    }
});

app.get("/admin",(req,res)=>{
    if(req.isAuthenticated()){
         res.render("admin.ejs")
    }else{
        res.redirect("/signin")
    }
   
})


app.get("/admin_home", async (req, res)=>{
    
    if(req.isAuthenticated()){
       
       
        
                 const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES}`);
                const data =result.rows;
                if(data.length !== 0){
                
                    
                    res.render("admin_home.ejs",{data: data, user: req.user.username});
                }
            
       
 
    }else{
        res.redirect("signin")
    }
});

app.get("/admin_kid", async (req, res)=>{
    
    if(req.isAuthenticated()){
       
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES} WHERE shoes_catagory = $1`,['kid']);
        const data =result.rows;
        if(data.length !== 0){
            
            res.render("admin_home.ejs",{data: data, user: req.user.email});
        }
 
    }else{
        res.redirect("signin")
    }
});
app.get("/admin_women", async (req, res)=>{
    
    if(req.isAuthenticated()){
       
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES} WHERE shoes_catagory = $1`,['women']);
        const data =result.rows;
        if(data.length !== 0){
            
            res.render("admin_home.ejs",{data: data, user: req.user.email});
        }
 
    }else{
        res.redirect("signin")
    }
});

app.get("/admin_men", async (req, res)=>{
    
    if(req.isAuthenticated()){
       
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES} WHERE shoes_catagory = $1`,['men']);
        const data =result.rows;
        if(data.length !== 0){
            
            res.render("admin_home.ejs",{data: data, user: req.user.email});
        }
 
    }else{
        res.redirect("signin")
    }
});

app.get("/signout", (req, res)=>{
    req.logout(function(err){
        if(err){console.log(err)}
        shoes = [];
        res.redirect("/");
    })
});

app.get("/account", (req, res)=>{
    if(req.isAuthenticated()){
        
    const success =  req.query.success
    
   res.render("customer_account.ejs",{email: req.user[0].username, success: success})

    }else{
        res.redirect("/signin")
    }
    })

app.post("/account", async (req, res)=>{
    const newpassword = req.body.newpassword;
    try{

        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLEC} WHERE username = $1`,[req.body.email]);
        if(result.rows.length === 1){
            bcrypt.compare(req.body.curpassword, result.rows[0].password, (err,hash1)=>{
                if(err){console.log(err)};
                if(hash1){

                     bcrypt.hash(newpassword,saltRound, async(err, hash)=>{
                        if(err){console.log(err)};
                      
                        await db.query(`UPDATE ${process.env.PG_TABLEC} SET password = $1 WHERE username = $2`,[hash, result.rows[0].username]);
                        res.redirect("/account?success=password change successfully")
                    });
                }else{
                    res.redirect("/account?success=current password is incorrect")
                }

            })
            
           
            
        }else{
            res.redirect("/account")
        }

    }catch(err){
        console.log(err)
    }
});


app.post("/check_out", async (req, res)=>{
    
    var shoess = JSON.parse(req.body.shoes);
    

    try{
        if(shoess.length > 0){
             for(var i = 0; i < shoess.length; i++){
                await db.query(`INSERT INTO  ${process.env.PG_TABLEO}(customer,shoes_id,shoes_name,shoes_price,shoes_catagory,status,quantity) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[req.body.email,`${shoess[i].id}`,shoess[i].shoes_name,Number(shoess[i].shoes_price) * Number(shoess[i].quantity),shoess[i].shoes_catagory,"Pending",shoess[i].quantity]);

              }
          shoes = [];
          res.redirect('/home')
        }else{
            res.redirect('/cart')
           }
        
    }catch(err){
        console.log(err)
    }
});

app.get("/order", async (req, res)=>{
    
if(req.isAuthenticated()){
    const result = await db.query(`SELECT * FROM ${process.env.PG_TABLEO} WHERE customer = $1 ORDER BY id DESC `,[req.user[0].username]);
    const order = result.rows;
    
    res.render("orders.ejs", {orders: order})
}else{
    res.redirect("/signin")

}
});

app.get("/admin_order", async (req, res)=>{
    
if(req.isAuthenticated()){
    const result = await db.query(`SELECT * FROM ${process.env.PG_TABLEO} ORDER BY id DESC `);
    const order = result.rows;
    
    res.render("admin_order.ejs", {orders: order})
}else{
    res.redirect("/signin")
}
});
app.get("/admin_customer", async (req, res)=>{
    if(req.isAuthenticated()){
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLEC} `);
        const customers = result.rows;
         res.render("all_customer",{customers: customers});
    }else{
        res.redirect("/signin")
    }
   
})
app.post("/sell", async (req,res)=>{
   const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES} WHERE id = $1`,[Number(req.body.shoes_id)]);
   const data = result .rows
   if(data[0].shoes_quantity > 1){
     await db.query(`UPDATE ${process.env.PG_TABLES} SET shoes_quantity = $1 WHERE id = $2`,[data[0].shoes_quantity - Number(req.body.quantity),data[0].id]);
     await db.query(`UPDATE ${process.env.PG_TABLEO} SET status = $1 WHERE id = $2`,["Approved",Number(req.body.item)]);
     res.redirect("/admin_order");
   }else{
     await db.query(`DELETE FROM ${process.env.PG_TABLES} WHERE id = $1`,[data[0].id]);
     await db.query(`UPDATE ${process.env.PG_TABLEO} SET status = $1 WHERE id = $2`,["Approved",Number(req.body.item)]);
     res.redirect("/admin_order");
   }

    
})


app.get("/update_stock", async (req, res)=>{
    if(req.isAuthenticated()){
         try{
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES}`);
        const shoes = result.rows
        res.render("all_shoes.ejs",{shoes: shoes})
    }catch(err){
        console.log("stock out")
    }
    
    }else{
        res.redirect("/signin")
    }
   
});


var shoes = [];
app.get("/cart", (req,res)=>{
    if(req.isAuthenticated()){
        if (!req.session.shoes) {
            req.session.shoes = [];
        }
        res.render("cart.ejs",{shoes: req.session.shoes, email: req.user[0].username, phone: req.user[0].phone})

    }else{
        res.redirect("/signin")
    }
    });

app.post("/cart", async(req, res)=>{
    if(req.isAuthenticated()){

    
    try{
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLES} WHERE id = $1`,[req.body.item]);
         if (!req.session.shoes) req.session.shoes = [];
        const data = result.rows;
        data[0].quantity = Number(req.body.quantity)
        req.session.shoes.push(data[0]);
        

        res.render("cart.ejs",{shoes: req.session.shoes, email: req.user[0].username, phone: req.user[0].phone})
    }catch(err){
        console.log(err)
    }
}else{
    res.redirect("/signin")
}
});

app.post("/cart_delete", async(req, res)=>{
    if(req.isAuthenticated()){
         if (!req.session.shoes) req.session.cart = [];
        const data = JSON.parse(req.body.id)
 
        let index = req.session.shoes.findIndex(item => item.id === data.id);
        if (index !== -1) {
        req.session.shoes.splice(index, 1); // removes in place
        }

        res.redirect("/cart")
    }
    
   
});



app.post("/register_shoe",upload.single("image"), async (req, res)=>{
    try{
        if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const { shoe_name, shoe_color, shoe_price, shoe_number,shoe_catagory } = req.body;
    const filePath = req.file.filename;
        const result = await db.query(`INSERT INTO ${process.env.PG_TABLES} (shoes_name, shoes_color, shoes_price, shoes_number, shoes_image,shoes_catagory)  VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,[shoe_name, shoe_color, shoe_price, shoe_number, filePath,shoe_catagory] );  

    if(result.rows.length !== 0){
            res.render("admin.ejs",{success: "added successfully"})
         }else{
          
            res.render("admin.ejs",{succes: "error"})
         }

    }catch(err){
        console.log(err)
    }
});

app.post("/delete_shoe",async (req, res)=>{
    try{

        const id = Number(req.body.item)
        const result = await db.query(`DELETE FROM ${process.env.PG_TABLES} WHERE id = $1 RETURNING *`,[id]);
         
        if(result.rows.length > 0){
            res.redirect("/update_stock")
        }else{
            res.send("error")
        }
    }catch(err){
        console.log(err)
    }
});

app.post("/delet_shoe",async (req, res)=>{
    try{

        const id = Number(req.body.item)
        const result = await db.query(`DELETE FROM ${process.env.PG_TABLES} WHERE id = $1 RETURNING *`,[id]);
         
        if(result.rows.length > 0){
            res.redirect("/admin_home")
        }else{
            res.send("error")
        }
    }catch(err){
        console.log(err)
    }
});

app.post("/edit_shoe",async (req, res)=>{
    if(req.isAuthenticated()){
        const result = await db.query(`SELECt * FROM ${process.env.PG_TABLES} WHERE id = $1`,[req.body.item]);
        const shoes = result.rows
        
        res.render("edit_shoes.ejs",{shoe: shoes})
    }else{
        res.redirect("/signin")
    }

    
});

app.post("/editee_shoe", async (req, res)=>{
    if(req.isAuthenticated()){
        
        
    
        await db.query(`UPDATE shoes SET shoes_name = $1, shoes_color = $2,shoes_price = $3,shoes_number = $4,shoes_catagory = $5 WHERE id = ${req.body.shoe_id}`,[req.body.shoe_name,req.body.shoe_color,req.body.shoe_price,req.body.shoe_number,req.body.shoe_catagory]);
        res.redirect("/update_stock");
    }else{
        res.redirect("/signin")
    }
})

app.post("/signup", async (req, res)=>{
    
    try{
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLEC} WHERE username= $1`,[req.body.username]);

        if(result.rows.length === 0){
            bcrypt.hash(req.body.password, saltRound, async (err, hash)=>{
                if(err){
                    console.log("hash err", err)
                }else{
                    await db.query(`INSERT INTO ${process.env.PG_TABLEC}(username, password,phone,address) VALUES($1,$2,$3,$4)`,[req.body.username,hash,req.body.phone,req.body.address]);
                    res.redirect("/signin")
                }

            })

        }else{
            res.redirect("/signup")
        }

    }catch(err){
        console.log(err)
    }
});


app.post("/signin", passport.authenticate("local",{
    successRedirect: "/home",
    failureRedirect: "/signin"
}));

passport.use(new Strategy(async function verify(username, password, cb) {
    try{
        const result = await db.query(`SELECT * FROM ${process.env.PG_TABLEC} WHERE username= $1`,[username]);
        const user = result.rows;
        
        if(user.length === 1){

            bcrypt.compare(password, user[0].password,  (err, output)=>{
               
                if(err){return cb(err)};
                
                if(output){
                    return cb(null, user);
                }else{
                    return cb(null, false);
                }
            });

        }else{
            return cb(null, false)
        }
    }catch(err){
        return cb(null, false)
    }
}));


passport.serializeUser((user,cb)=>{
    return cb(null, user);
});

passport.deserializeUser((user, cb)=>{
    return cb(null, user);
});



app.listen(port, async()=>{
    console.log(`Server http://localhost:${port}`);
     const url = await ngrok.connect(port);
     console.log(`Public URL: ${url}`);
})