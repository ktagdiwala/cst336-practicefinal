// Terminal commands for express app
// npm init -y
// npm i express ejs mysql2

import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "walid-elgammal.online",
    user: "walidelg_ktuser2",
    password: "Cst-336",
    database: "walidelg_comicskt",
    connectionLimit: 10,
    waitForConnections: true
});
const conn = await pool.getConnection();

//routes
app.get('/', async (req, res) => {
    // Retrieves comic sites
    let sql = `SELECT *
                FROM fe_comic_sites`;
    const [rows] = await conn.query(sql);
    res.render("index", {"comicSites":rows});
});

app.get("/comic/new", async (req, res)=>{
    // retrieve comic titles
    let sql = `SELECT *
            FROM fe_comic_sites`;
    const [rows] = await conn.query(sql);
    res.render("newComic", {"comicSites":rows});
});// fill out information to add new comic

app.post("/comic/new", async function(req, res){
    let title = req.body.title;
    let url = req.body.url;
    let publishDate = req.body.publishDate;
    let website = req.body.website;
    let sql = `INSERT INTO fe_comics
               (comicUrl, comicTitle, comicSiteId, comicDate)
                VALUES (?, ?, ?, ?)`;
    let params = [url, title, website, publishDate];
    const [rows] = await conn.query(sql, params);

        // retrieve comic titles
    let sql2 = `SELECT *
            FROM fe_comic_sites`;
    const [rows2] = await conn.query(sql2);
    res.render("newComic", 
               {"message": "Comic added!", "comicSites":rows2});
});// add new comic to database

app.get('/api/randomComic', async (req, res) => {
    let sql = `SELECT * 
            FROM fe_comics 
            NATURAL JOIN fe_comic_sites
            ORDER BY RAND() 
            LIMIT 1`;           
    let [rows] = await conn.query(sql);
    res.send(rows);
});// allows retrieval of random comic from client-side js

app.get('/comics', async (req, res) => {
    let siteId = req.query.siteId;
    let sql = `SELECT *
              FROM fe_comics
              NATURAL JOIN fe_comic_sites
              WHERE comicSiteId = ?`;           
    let [rows] = await conn.query(sql, [siteId]);
    res.render("comics", {"comics": rows});
});// gets all comics from a specific comic site

app.get('/api/comments/:id', async (req, res) => {
    let comicId = req.params.id;
    let sql = `SELECT *
              FROM fe_comments
              WHERE comicId = ?`;           
    let [rows] = await conn.query(sql, [comicId]);
    res.send(rows);
});// gets all comments for a specific comic

app.get("/comment/new", async (req, res)=>{
    let comicId = req.query.comicId;
    let sql = `SELECT *
            FROM fe_comics
            WHERE comicId = ?`;
    const [rows] = await conn.query(sql, [comicId]);
    res.render("newComment", {"comicInfo":rows});
});// fill out information to add new comic

app.post("/comment/new", async function(req, res){
    let username = req.body.username;
    let email = req.body.email;
    let comment = req.body.comment;
    let comicId = req.body.comicId;
    let sql = `INSERT INTO fe_comments
               (author, email, comment, comicId)
                VALUES (?, ?, ?, ?)`;
    let params = [username, email, comment, comicId];
    const [rows] = await conn.query(sql, params);

    let sql2 = `SELECT *
        FROM fe_comics
        WHERE comicId = ?`;
    const [rows2] = await conn.query(sql2, [comicId]);
    res.render("newComment", 
               {"message": "Comment added!", "comicInfo": rows2});
});// add new comment to database

app.get("/dbTest", async(req, res) => {
    let sql = "SELECT CURDATE()";
    const [rows] = await conn.query(sql);
    res.send(rows);
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})

