const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const isLoggedIn = require('./middleware/authMiddleware')
const axios = require('axios');
const { response } = require('express');

app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', './client/public/views')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get('/', (req,res)=>{
    try {
        res.render('main', {
            pageTitle: "Main Page",
            cssStyle: null,
            user:null,
            username : null
        })
      } catch (error) {
        console.error(error);
      }
})

app.get('/home/:username', isLoggedIn, async (req,res)=>{
    try {
        const response = await axios.get(`http://localhost:3000/api/user/${req.params.username}`);
        console.log(response.data);
        res.render('main', {
            pageTitle: "Main Page",
            cssStyle: null
        })
      } catch (error) {
        console.error(error);
      }
})

app.get('/signup', (req,res)=>{
    res.render('signup', {
        pageTitle: "Sign Up",
        cssStyle:"/css/signupStyle.css"
    })
})

app.post('/signup', async (req,res)=>{
    const { username , email, password }=req.body
    const newUser = {
        username,
        email,
        password
    }
    const response = await axios.post('http://localhost:3000/api/user/add', newUser);
    if(response.status === 201){
        res.redirect('/')
    }else{
        res.redirect('/signup')
    }
})

app.get('/login', (req,res)=>{
    const { status } = req.query
    res.render('login', {
        pageTitle: "LOGIN",
        cssStyle:"/css/signupStyle.css",
        status
    })
})

app.post('/login', async (req,res)=>{
    const { username , password }=req.body
    const response = await axios.get(`http://localhost:3000/api/user/${username}`);
    console.log(response.data)
    const userMatch = response.data.data
    if(!userMatch){
            res.redirect('/login?status=usernotfound')
        }
    else{
        const matchPassword = bcrypt.compareSync(password.trim(), userMatch.hashedPassword)
        if(matchPassword){
            const token = jwt.sign({
                username : userMatch.username,
                id: userMatch.id}, 'secret', {
                    expiresIn : 60 * 60 *24
                })
                res.cookie('jwt', token, { maxAge: 1000* 60 * 60 * 24})
                
                res.redirect(`/home/${username}`)
        }else {
            res.redirect('/login?status=wrongpassword')
        }
    }
})

app.get('/play', isLoggedIn, (req,res)=>{
    res.render('play', {
        pageTitle: "ROCK PAPER SCISSORS"
    })
})

app.get('/play/:username', isLoggedIn, async (req,res)=>{
    const userHistory = await axios.get(`http://localhost:3000/api/history/${req.params.username}`);
    res.render('inputResult', {
        pageTitle: "Input Game Result",
        cssStyle: null,
        userHistory: userHistory.data.data
    })
})

app.post('/play/:username', isLoggedIn, async (req, res) => {
    const {username} = req.params
    const {win, draw, lose} = req.body
    const dataToEdit = {
        win: win,
        draw:draw,
        lose:lose
    }
    const response = await axios.put(`http://localhost:3000/api/history/${username}`, dataToEdit);
    if (response.data.status === "success"){
        res.redirect(`/dashboard/${username}`)
    }else{
        res.redirect(`/play/${username}`)
    }
})

app.get('/dashboard', isLoggedIn, (req,res)=>{
    res.render('dashboard', {
        pageTitle: "Dashboard",
        cssStyle: null,
        data_player : null,
        userProfile : null,
        allHistory : null
    })
})

app.get('/dashboard/:username', isLoggedIn, async (req,res)=>{
    const allUser = await axios.get('http://localhost:3000/api/users')
    const userData = await axios.get(`http://localhost:3000/api/user/${req.params.username}`);
    const usersHistory = await axios.get('http://localhost:3000/api/histories');
    console.log(usersHistory.data)
    res.render('dashboard', {
        pageTitle: "Dashboard",
        cssStyle: null,
        data_player : allUser.data.data,
        userProfile : userData.data.data,
        allHistory : usersHistory.data.data
    })
})


// Edit
app.post('/edit', isLoggedIn, async (req, res) => {
    const {id} = req.query
    const {username, email, password} = req.body
    const dataToEdit = {
        username: username,
        email:email,
        password:password
    }
    const response = await axios.put(`http://localhost:3000/api/user/${id}`, dataToEdit);
    if (response.data.status === "success"){
        res.redirect(`/home/${username}`)
    }else{
        res.redirect(`/dashboard/${username}`)
    }
})

app.post('/delete', async (req, res) => {
    const {username} = req.query
    const response = await axios.delete(`http://localhost:3000/api/user?username=${username}`);
    if(response.data.status === "success"){
        res.redirect('/')
    }
})

app.get('/set-cookies', (req,res)=> {
    res.cookie('userId', 1)
    res.cookie('username', 'Ninda', {maxAge: 1000 * 60 * 60 * 24})
    res.json({
        message : "anda mendapat cookie"
    })
})

app.get('/get-cookies', (req,res) => {
    console.log(req.cookies)
    res.json({ cookies: req.cookies})
})

app.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 5000 })
    res.redirect('/')
  })


const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})