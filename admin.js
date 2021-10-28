var express = require('express');
const Emp = require('./Models/emp')
const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBroExpress = require('@admin-bro/express')
const bcrypt = require('bcrypt');
const AdminBroExpressjs = require('@admin-bro/express')
var app = express();
const mongoose = require('mongoose');//Routes


mongoose.connect("mongodb+srv://powerblaze:xtreme_%20316@powerblaze.ee46p.mongodb.net/databox?authSource=admin&replicaSet=atlas-dg1jfa-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
{useNewUrlParser: true});
mongoose.connection.once('open',function(){
   console.log('Database connected Successfully');
}).on('error',function(err){
   console.log('Error', err);
})

var options = {
    index: "admin"
  };
  
  app.use('/', express.static('app', options));


    
    //Database

//Admin Bro
AdminBro.registerAdapter(AdminBroMongoose)



const User = mongoose.model('User', {
    email: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    role: { type: String, enum: ['admin', 'restricted'], required: true },
  })





const Mails = mongoose.model('synmails', { from: String, subject: String, body: String, timestamp: String })
const AdminBroOptions = {
 //resources: [User, Emp, Mails],
 resources: [{
    resource: User,
    options: {
      properties: {
        encryptedPassword: {
          isVisible: false,
        },
        password: {
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if(request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
              }
            }
            return request
          },
        }
      }
    }
  },Emp,Mails],
 rootPath: '/',
}
const adminBro = new AdminBro(AdminBroOptions)
// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email })
      if (user) {
        const matched = await bcrypt.compare(password, user.encryptedPassword)
        if (matched) {
          return user
        }
      }
      return false
    },
    cookiePassword: 'nasdjnasdjcnaei8qwefnawciqwponicqpwdocnpweocnqwojcnqwpqwndc',
  })


app.use(adminBro.options.rootPath, router)




app.listen(8000, function () {
    console.log('Listening to Port 8000');

});

