const express = require("express")
const app = express()

app.use(express.static("static"))

app.listen(3000, function() {
	console.log('Servidor sendo executado em http://localhost:3000/\nUse CTRL + C para sair.');
})

process.on('SIGINT', function() {
    process.exit();
});
