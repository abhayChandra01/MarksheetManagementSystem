var multer=require('multer')
const { v4: uuidv4 } = require('uuid')

var serverpath=multer.diskStorage(
    {
        destination:(req,file,path)=>
        {path(null,'public/images')},
        
        filename:(req,file,path)=>
        {
            var ext=file.originalname.substring(file.originalname.lastIndexOf("."))    
            var filename=uuidv4()+ext
            req['filename']=filename
            
            path(null,filename)
        }
    })
    var upload=multer({storage:serverpath})
    
    module.exports=upload