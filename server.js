import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/post-codealong"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Task = mongoose.model('Task', {
  text: {
    type:String, 
    required: true, 
    minLength: 5
  }, 
  complete: {
    type: Boolean, 
    default: false
  },
  createdAt: {
    type: Date, 
    default: Date.now
  }
});


const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const {text, complete} = req.body;
  const task = new Task({text, complete});

  try {
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  }catch (err){
    res.status(400).json({maessage: 'Could not save task to DB', error: err.errors});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
