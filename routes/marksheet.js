var express = require('express')
var router = express.Router()

var pool = require("./pool")
var upload = require("./multer")

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');


router.get("/studentinfo", function (req, res) {
  var aresult=JSON.parse(localStorage.getItem("ADMIN"))

  if(aresult==null)
     res.redirect("/marksheetadmin/adminlogin")
 
  else  
  res.render("studentinfo", { "message": "",aresult:aresult })



})

router.get("/searchbyid",function(req,res)
   {
     var aresult=JSON.parse(localStorage.getItem("ADMIN"))
        
     if(aresult==null)
     res.redirect("/admin/adminlogin")
 
     else
     res.render("searchbyid",{message:'',aresult:aresult})
                  
   
     
   
   
   })




router.post("/infosubmit", upload.single('picture'), function (req, res) {

  var aresult=JSON.parse(localStorage.getItem("ADMIN"))
  console.log("BODY:", req.body)
  console.log("File:", req.body)


  pool.query("insert into records(studentname,fathersname,rollno,gender,dob,schoolname,state,city,address,picture,phycode,phymarks,chemcode,chemmarks,mathscode,mathsmarks,engcode,engmarks,hindicode,hindimarks)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.sname, req.body.fname, req.body.rollno, req.body.gender, req.body.dob, req.body.school, req.body.states, req.body.cities, req.body.address, req.filename, req.body.pcode, req.body.pmarks, req.body.ccode, req.body.cmarks, req.body.mcode, req.body.mmarks, req.body.ecode, req.body.emarks, req.body.hcode, req.body.hmarks], function (error, result) {
    if (error) {
      console.log(error)
      res.render("studentinfo", { "message": "Server Error....",aresult:aresult })

    }
    else {
      console.log(result)
      res.render("studentinfo", { "message": "Record Submitted Successfully....",aresult:aresult })

    }



  })


})


router.get("/displayrecords", function (req, res) {
  var aresult=JSON.parse(localStorage.getItem("ADMIN"))
  if(aresult==null)
  res.redirect("/marksheetadmin/adminlogin")

else  
  pool.query("select R.*,(select S.states from states S where S.stateid=R.state) as sn,(select C.cities from cities C where C.cityid=R.city) as cn from records R",function(error,result){
    
    
    
    if (error) {
      res.render("displayallrecords", { result: [], msg: "Server Error",aresult:aresult })

    }
    else {
      if (result.length == 0) {
        res.render("displayallrecords", { result: [], msg: "No Records Found",aresult:aresult })

      }
      else {

        res.render("displayallrecords", { result: result, msg: "",aresult:aresult })
      }

    }



  })



})


router.get("/displaybyid", function (req, res) {
  var aresult=JSON.parse(localStorage.getItem("ADMIN"))
  if(aresult==null)
  res.redirect("/marksheetadmin/adminlogin")

else 
  pool.query("select R.*,(select S.states from states S where S.stateid=R.state) as sn,(select C.cities from cities C where C.cityid=R.city) as cn from records R where R.studentid=?", [req.query.sid], function (error, result) {
    if (error) {
      res.render("expand", { result: [] ,aresult:aresult})

    }
    else {
      console.log(result)
      var perc = (parseInt(result[0].phymarks) + parseInt(result[0].chemmarks) + parseInt(result[0].mathsmarks) + parseInt(result[0].engmarks) + parseInt(result[0].hindimarks)) / 5

      if (perc >= 33) {
        var rrr = "PASS"
      }
      else {
        var rrr = "FAIL"
      }



      res.render("expand", { result: result[0], perc: perc,rrr:rrr ,"sid":req.query.sid,aresult:aresult })


    }



  })



})





router.get("/getcities", function (req, res) {
  console.log(req.query)
  pool.query("select * from cities where stateid=?", [req.query.stateid], function (error, result) {

    if (error) {
      res.status(500).json([])
      console.log(error)
    }

    else {
      res.status(200).json(result)
    }

  })


})

router.get("/getstates", function (req, res) {
  pool.query("select * from states", function (error, result) {

    if (error) {
      res.status(500).json([])
      console.log(error)
    }

    else {
      res.status(200).json(result)
    }

  })


})

router.get("/editrecord", function (req, res) {
  var aresult=JSON.parse(localStorage.getItem("ADMIN"))
  if(aresult==null)
  res.redirect("/marksheetadmin/adminlogin")

else 
  pool.query("select R.*,(select S.states from states S where S.stateid=R.state) as sn,(select C.cities from cities C where C.cityid=R.city) as cn from records R where R.studentid=?", [req.query.sid], function (error, result) {
    if (error) {
      res.render("editrecord", { result: [],aresult:aresult })

    }
    else {


      res.render("editrecord", { result: result[0],aresult:aresult })


    }



  })



})

router.get("/editphoto",function(req,res)
{
     var aresult=JSON.parse(localStorage.getItem("ADMIN"))
     if(aresult==null)
     res.redirect("/marksheetadmin/adminlogin")
 
  else 
     res.render("editphoto",{data:req.query,aresult:aresult})          
     
          
          
})

router.post("/updateimage",upload.single('picture'),function(req,res){
  console.log("BODY:",req.body)
  console.log("File:",req.body)
  
       pool.query("update records set picture=? where studentid=?",[req.filename,req.body.studentid],function(error,result)
       {
            if(error)
            {
                 res.redirect("/marksheet/displayrecords")
     
            }          
            else
            {
                 console.log(result)
                 res.redirect("/marksheet/displayrecords")
            }
  
       })
       
       
     })


router.post("/updaterecord",function(req,res){
  console.log("BODY:",req.body)
  pool.query("update records set studentname=?,fathersname=?,rollno=?,gender=?,dob=?,schoolname=?,state=?,city=?,address=?,phycode=?,phymarks=?,chemcode=?,chemmarks=?,mathscode=?,mathsmarks=?,engcode=?,engmarks=?,hindicode=?,hindimarks=? where studentid=?",[req.body.sname, req.body.fname, req.body.rollno, req.body.gender, req.body.dob, req.body.school, req.body.states, req.body.cities, req.body.address, req.body.pcode, req.body.pmarks, req.body.ccode, req.body.cmarks, req.body.mcode, req.body.mmarks, req.body.ecode, req.body.emarks, req.body.hcode, req.body.hmarks,req.body.studentid],function(error,result)
  {
       if(error)
       {
            res.redirect("/marksheet/displayrecords")

       }          
       else
       {
            console.log(result)
            res.redirect("/marksheet/displayrecords")
       }

  

  })




})




router.post("/deleterecord", function (req, res) {
  console.log("BODY:", req.body.studentid)

  pool.query("delete from records where studentid=?", [req.body.sid], function (error, result) {
    if(error) 
    {
        res.redirect("/marksheet/displayrecords")

    }
    else 
    {
      console.log(result)
      res.redirect("/marksheet/displayrecords")
    }
  })

})





module.exports = router;