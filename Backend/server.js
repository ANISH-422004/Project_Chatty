const env = require("dotenv").config() // Import the dotenv package and call the config method on it
const app = require("./src/app")
const config = require("./src/config/config")




app.listen(config.PORT, ()=>{
    console.log(`Server is running`)
})