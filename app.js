const express = require('express');
const path = require('path');

const authRouter = require('./routes/v1/auth');

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ limits: "30mb", extended: true }));
app.use(express.json({ limits: "30mb" }));
// app.use(setHeaders);

// Routers
app.use('/api/v1/auth', authRouter);


app.use((req,res) => {
    console.log("Thise path is not found:", req.path);

    return res.status(404).json({
        message: "404! path not found.please double check the path / method",
    });
});

// app.use(errorHandler);

module.exports = app;
