const express=require('express');
const app=express();
const path=require('path')

var methodOverride = require('method-override')

const { v4: uuidv4 } = require('uuid');


const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploads


const port=8080;



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


//midlewere

app.use(express.static(path.join(__dirname,"public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOverride('_method'));




let posts=[

    {username:'Imran',content:"How to find phone number’s identity for free on Android mobile phone and iPhone ",image:'',description:'Go to Youtube and search your query you will get the video of manoj saru watching this video , you will get to know everythings',id:uuidv4()},

]



app.get('/posts',(req,res)=>{
    res.render('posts.ejs',{posts})
})





app.get('/posts/new',(req,res)=>{
   res.render('new.ejs',{posts})
});




app.post('/posts', upload.single('image'), (req, res) => {
    const { username, content, description } = req.body;

    // Check if a file was uploaded
    let image = null;
    if (req.file) {
        // If a file was uploaded, store the filename (or adjust as needed)
        image = req.file.filename;
        
    }

    id=uuidv4()
    // Add the new post to the array
    posts.push({ username, content, image, description,id });

    // Redirect to the posts page
    res.redirect('/posts');
});

app.get('/posts/:id', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);

    if (!post) {
        // Handle the case where the post is not found
        res.status(404).send('Post not found');
        return;
    }

    res.render('view.ejs', { post });
});


app.get('/posts/:id/edit',(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=> id===p.id)
    res.render('edit.ejs',{post})
    
})

    app.patch('/posts/:id', (req, res) => {
        let { id } = req.params;
      
        let newDescription = req.body.description;
        let post = posts.find((p) => id === p.id);
        post.description = newDescription;
        res.redirect('/posts');
    });
    

   
app.delete('/posts/:id', (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect('/posts');
});






















app.listen(port,()=>{
    console.log('listning to port:8080')
})