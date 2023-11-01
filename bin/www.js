const http = require("http")
const PORT = 3000
const serverHandle = require("../app")

const server= http.createServer()

server.on('request',serverHandle)

server.listen(PORT)