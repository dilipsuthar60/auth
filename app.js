const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectdb = require("./dataBase/dbConnection");
const { createProxyMiddleware } = require('http-proxy-middleware');
const {isAuthorized} = require('./middleware/isAuthorized');
const {isAuthorizedForPythonServer} = require('./middleware/isAuthorizedPythonServer');
const {isAuthorizedForNestAiDashboard} = require('./middleware/isAuthorizedNestAiDashboardService');
const {isAuthorizedForNestImaganary} = require('./middleware/isAuthorizedNestImaganayService');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(cookieParser())
app.use(express.json());



// database connection 
connectdb();

const pythonServerProxy = createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/chatbot': '',
  },
});

const nestServerProxyImagenary = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/imagenary': '',
  },
});
const nestServerProxyAiDashboard = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/ai-dashboard': '',
  },
});

app.use('/chatbot',isAuthorized,isAuthorizedForPythonServer, pythonServerProxy);
app.use('/imagenary', isAuthorized, isAuthorizedForNestImaganary, nestServerProxyImagenary);
app.use('/ai-dashboard', isAuthorized, isAuthorizedForNestAiDashboard, nestServerProxyAiDashboard);

app.use('/auth', require('./routes/authRoute'));

app.listen(port, () => {
  console.log(`Server listening  http://localhost:${port}.....`);
});