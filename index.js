
const express = require('express');
const app = express();
var methodOverride = require('method-override')
const cors = require('cors');
const multer = require('multer')

app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'))
require('dotenv').config();
const { MongoClient, ServerApiVersion, MongoRuntimeError, ObjectId } = require('mongodb');
const { request } = require('express');
const port = process.env.PORT || 5000;

// this code for image upload
const storage = multer.diskStorage({
  destinaton: (req, file, callback)=>{
    callback(null, './uploads/');
  },
  
  filename: (req, file, callback)=>{
    callback(nul, file.originalname);
  }
 
})
const upload = multer({
  storage:storage,
  
  
})

// const UPLOADS_FOLDER = "./uploads/";
// var upload = multer({
//   dest: UPLOADS_FOLDER,
// })


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bokofdx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
         client.connect();
        const newsCollection = client.db('honest_news_hub').collection('allnews');

        app.post('/shownews', async(req, res)=>{
          const {q} = req.query;
          console.log("amin")
          const searchnews = newsCollection.find({ title: { $regex: q, $options: 'i' } })
          res.send(searchnews)
          .then(result =>{
            console.log('data successfully')
            res.send('success')
         })
      })

        


        app.get('/allnews', async(req, res)=>{
          const query = {};
          const cursor = newsCollection.find(query);
          const allnewses = await cursor.toArray();
          res.send(allnewses)
      })

      app.get('/allnews/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const allnewses = await newsCollection.findOne(query);
        res.send(allnewses);
      });
      

        // sportsnews
        app.get('/sportnews', async(req, res)=>{
        const query = { section: "খেলাধুলা" };
        const cursor = newsCollection.find(query);
        const sportnews = await cursor.toArray();
        res.send(sportnews)
    })

    app.get('/sportnews/:sId', async(req,res)=>{
      const id = req.params.sId;
      const query = {_id: ObjectId(id)};
      const sportnewsdetails = await newsCollection.findOne(query);
      res.send(sportnewsdetails);
    });

    // National news

    app.get('/nationalnews', async(req,res)=>{
      const query ={ section: "জাতীয়" };
      const coursor = newsCollection.find(query);
      const nationalnews = await coursor.toArray();
      res.send(nationalnews)
    });
    app.get('/nationalnews/:naId', async(req,res)=>{
      const id = req.params.naId;
      const query = {_id: ObjectId(id)};
      const nationalnewsdetails = await newsCollection.findOne(query);
      res.send(nationalnewsdetails);
    });

    // Inernational News
    app.get('/internationalnews', async(req,res)=>{
      const query ={ section: "আন্তর্জাতিক" };
      const coursor = newsCollection.find(query);
      const internationalnews = await coursor.toArray();
      res.send(internationalnews)
    });

    app.get('/internationalnews/:iaId', async(req,res)=>{
      const id = req.params.iaId;
      const query = {_id: ObjectId(id)};
      const internationalnewsdetails = await newsCollection.findOne(query);
      res.send(internationalnewsdetails);
    });

    // Science News
    app.get('/sciencenews', async(req,res)=>{
      const query ={ section: "বিজ্ঞান ও প্রযুক্তি" }  ;
      const coursor = newsCollection.find(query);
      const sciencenews = await coursor.toArray();
      res.send(sciencenews)
    });

    app.get('/sciencenews/:saId', async(req,res)=>{
      const id = req.params.saId;
      const query = {_id: ObjectId(id)};
      const sciencenewsdetails = await newsCollection.findOne(query);
      res.send(sciencenewsdetails);
    });


    

    // all post methods
    app.post('/allnews',upload.single("image"), (req,res)=>{
      console.log('request', req.body)
      
      const post = ({
        title : req.body.title,
        section: req.body.section,
        details: req.body.details,
        image: req.file.image
      })
      newsCollection.insertOne(post)
     .then(result =>{
        console.log('data successfully')
        res.send('success')
     })
    })
    
    // post with image
    //  app.post('/allnews', upload.single("image"),(req,res)=>{
    //   console.log('request', req.body)
    //   const img = req.file.filename;
    //   const news = (
    //     req.body,
    //     img
    //   );
    //   newsCollection.insertOne(news)
    //  .then(result =>{
    //     console.log('data successfully')
    //     res.send('success')
    //  })
    // })


    // app.post('/start',(req,res)=>{
    //   const search = req.body.search
    //   newsCollection.find({title:search})
    //  .then(result =>{
    //     console.log('data successfully')
    //     res.send('success')
    //  })
    // })
  
// delete data in newslist and page

    app.delete("/allnews/:id",async (req, res)=>{
      console.log(req.params.id)
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await newsCollection.deleteOne(query)
      res.send(result)
    })

    

    // UPDATE DATA

    app.put('/allnews/:uId', async (req, res)=>{
      const id = req.params.uId
      const query = {_id: ObjectId(id)}
      const updateDocument = {
        $set: {
          title:req.body.title,
          section : req.body.section,
          detailis : req.body.details
        }
      }
      const result = await newsCollection.updateOne(query, updateDocument)
      res.send(result)
    })
  

    // Search in data
    // app.post("/getNews",async (req, res) => {
    //   const payload = req.body.payload;
    //   const search = await newsCollection.find(
    //         { $title: {$regax: new RegExp("^"+payload+".*","i")} } 
    //   )
    //   res.send({payload : search})
    // })

    // get search data
    // app.get("/getNews",async(req, res)=>{
    //   const query = {};
    //   const cursor = newsCollection.find(query);
    //   const allnewses = await cursor.toArray();
    //   res.send(allnewses)
    // })

    

    }
    finally{

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
