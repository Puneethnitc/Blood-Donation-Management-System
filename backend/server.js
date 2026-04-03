const bloodRequestRoutes=require('./Routes/bloodRequestRoutes')
require('dotenv').config()
const express=require('express')
const app=express()
const bcrypt=require('bcrypt')
const cors=require('cors')
const db=require('./config/db.js')
const jwt=require('jsonwebtoken')
const authRoutes=require('./Routes/authRoutes')

app.use(
  cors({
    origin: "http://localhost:5173", // your React app URL
    credentials: true,
  })
);
app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api/request',bloodRequestRoutes)

app.get("/",(req,res)=>{
    res.send("Blood Donation Backend Running");
})



const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})