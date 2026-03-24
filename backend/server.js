const path = require('path');
const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db');
const companies = require('./routes/companies');
const interviews = require('./routes/interviews');
const auth = require('./routes/auth');
dotenv.config();
const cors = require("cors");
connectDB();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://fe-project-68-kingopor.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use (express.json());
app.use (cookieParser());
// Body parser (สำคัญสำหรับ POST / PUT)
app.use('/api/v1/companies', companies);
app.use('/api/v1/interviews', interviews);
app.use('/api/v1/auth', auth);
app.set('query parser', 'extended');

// Serve Frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    'Server running in',
    process.env.NODE_ENV,
    'mode on port',
    PORT
  );
});
process.on('unhandledRejection',(err,promise)=>{
  console.log( `Error: ${err.message}`);
  server.close(()=> process.exit(1));
});