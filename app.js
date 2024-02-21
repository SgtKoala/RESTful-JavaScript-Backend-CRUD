import express from 'express'
import {getNotes, getNote, createNote, updateNote, deleteNote} from './database.js'
import bodyParser from 'body-parser'

const app = express()


app.use(bodyParser.json())

//function display all data route

app.get("/notes", async (req, res)=>{

    const notes = await getNotes()
    res.send(notes)
})
//function display single data 
app.get("/notes/:id", async (req, res)=>{
 const id = req.params.id
 const note = await getNote(id)
 res.send(note)
})

//function create data route
app.post("/notes", async (req, res)=>{
   
    const { title, content } = req.body
    if(!title || !content){
        return res.status(400).send("title content not supported");
    }

    try{
    const note = await createNote(title, content)
    res.status(201).send({note});
    }catch (error){
        console.error(error);
        res.status(500).send("internal server error")

    }
})

//function edit route
app.put("/notes/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title && !content) {
        return res.status(400).send("At least one field (title or content) is required for update");
    }

    try {
        
        const updatedNoteData = await updateNote(id, { title, content });
        res.status(200).send({ updatedNoteData });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//function delete route

app.delete("/notes/:id", async (req, res)=> {
    const {id} = req.params;
    try{
        const deletedNoteData = await deleteNote(id);
        res.status(200).send({deletedNoteData});

    }catch(error){
        console.error(error)
        res.status(500).send("Internal server error")
    }
})

//error handling

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')

  })


  app.listen(8080, () => {
    console.log('running on 8080')
  })