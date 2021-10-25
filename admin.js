var express = require('express');
const Emp = require('./Models/emp')
const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBroExpress = require('@admin-bro/express')
var app = express();
const mongoose = require('mongoose');//Routes
app.get('/resources/synmails', function (req, res) {
    res.send('Hello World!');
});
//Database
mongoose.connect("mongodb+srv://powerblaze:xtreme_%20316@powerblaze.ee46p.mongodb.net/databox?authSource=admin&replicaSet=atlas-dg1jfa-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
 {useNewUrlParser: true});
mongoose.connection.once('open',function(){
    console.log('Database connected Successfully');
}).on('error',function(err){
    console.log('Error', err);
})
//Admin Bro
AdminBro.registerAdapter(AdminBroMongoose)
const User = mongoose.model('User', { name: String, email: String, surname: String })
const Mails = mongoose.model('synmails', { from: String, subject: String, body: String, timestamp: String })
const AdminBroOptions = {
  resources: [User, Emp, Mails],
}
const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpress.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router)
app.listen(8000, function () {
    console.log('Listening to Port 8000');
});