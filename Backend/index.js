// index.js
const { app, server } = require("./socket.js");
const express = require("express");

const PORT = 8001;


// app.use(cors({
//     credentials: true,
//     origin: "*", 
//     methods: ["GET", "POST"],
// }));


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



