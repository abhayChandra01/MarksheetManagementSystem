var express = require('express');
var router = express.Router();
var pool = require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

router.get('/dashboard', function(req, res, next) {

  var aresult=JSON.parse(localStorage.getItem("ADMIN"))
    res.render('dashboard',{aresult:aresult});
  })
  

router.get('/adminlogin', function(req, res, next) {
  res.render('adminlogin',{"msg":""});
})

router.get('/logout', function(req, res, next) {
    localStorage.removeItem("ADMIN")
    localStorage.clear()
    res.render('adminlogin',{"msg":""});
  })
  

router.get('/logout', function(req, res, next) {
  localStorage.removeItem("ADMIN")
  localStorage.clear()
  res.render('adminlogin',{"msg":""});
})

router.post('/checklogin', function(req, res, next) {

    pool.query("select * from admins where emailid=? and password=?",[req.body.emailid,req.body.password],function(error,result){

        if(error)
        {
            res.render("adminlogin",{"msg":"Server Error"})

        }
        else
        {   
            if(result.length==1)
            {
                localStorage.setItem('ADMIN',JSON.stringify(result[0]))
                res.render("dashboard",{aresult:result[0]})

            }
            else
            {
                res.render("adminlogin",{"msg":"Invalid Emailid/Password"})

            }

        }



    })
    
  })
  


module.exports = router;
