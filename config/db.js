const mongoose = require('mongoose')
const chalk = require("chalk");

mongoose.connect('mongodb+srv://anurag:anurag@anuragpersonal-qhfj8.mongodb.net/richpanel?retryWrites=true&w=majority',{
    useUnifiedTopology:true,
    useNewUrlParser: true,
    useCreateIndex: true

}).then(function(){
    console.log(chalk.magenta('database connected'))
}).catch(function(err){
    console.log('Error in database')
})