const express=require('express');
const app=express();
const hbs=require('hbs');
const path=require('path');
const geocode=require('./utilties/geocode');
const forcast=require('./utilties/forcast');
var bodyparsel=require("body-parser");
app.use(bodyparsel.urlencoded({extended:true}));

const Handlebars=require('handlebars');

const port=process.env.PORT ||3000;

//req.body.name;
app.set('view engine','hbs');
app.use(express.static(path.join(__dirname,'public')));
hbs.registerPartials(path.join(__dirname,'views/partials'));

Handlebars.registerHelper("printItems", function(items) {
  console.log(items);
});

app.get('/',( req ,res)=>{
     res.render("home");
})
 


app.get('/weather',(req,res)=>{
  if(!req.query.address){
    return res.redirect('/');
  }
 geocode(req.query.address,({ress,error})=>{
  if(error){
    return res.render('error',{
      errorm:error
    });
  }
   const geo={};
   geo.lat=ress.features[0].center[0];
   geo.long=ress.features[0].center[1];
   forcast(geo,({ress,error})=>{
     if(error){
       return res.render('error',{
        errorm:error
       });
     }
     const timezone=ress.timezone;
     const temperature=ress.currently.temperature;
     const apparentTemperature=ress.currently.apparentTemperature;
     const pressure=ress.currently.pressure;
     const DaySummry=ress.hourly.summary;
     const weekSummry=ress.daily.summary;
     const temperatureHigh=ress.daily.data[0].temperatureHigh;
     const temperatureLow=ress.daily.data[0].temperatureLow;
    // return res.send(ress);
      res.render('index',{
      lat:geo.lat,
      long:geo.long,
      timezone,
      
      temperature,
      apparentTemperature,
      pressure,
      DaySummry,
      weekSummry,
      temperatureHigh,
      temperatureLow
     });

     }) 
   })
})


app.post("/weather",(req,res)=>{
        const data=req.body.address;
        if(data==undefined){
          res.redirect('/');
        }
        res.redirect('/weather?address='+data);
})

app.get('*',(req,res)=>{
  res.render("error",{
    errorm:" Error 404  Not Found Url"
  })
})

app.listen(port,(e)=>{
  if(e){
      return console.log("error");
  }
  console.log("Server Start");
})