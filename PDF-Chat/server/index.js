import express, { response } from 'express'
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import path from 'path';
import { QdrantVectorStore } from '@langchain/qdrant';
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';

const client = new ChatOllama({
        model:'llama3',
        host: 'http://localhost:11434',
      });
console.log('client-->',client)
const queue = new Queue('file-upload-queue',{connection:{
    host:'localhost',
    port: 6379
}});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,`${uniqueSuffix}-${file.originalname}`)
    }
  })
    
const upload= multer({storage:storage})
const app = express()
app.use(cors());

app.get('/',(req,res)=>{
    return res.json({status: 'All Good!'})
})

app.post('/upload/pdf',upload.single('pdf'), async (req,res)=>{
    queue.add('file-ready',JSON.stringify({
        filename: req.file.originalname,
        destination: req.file.destination,
        path: req.file.path
    }))
    return res.json({message:'uploaded'})
})

app.get('/chat', async(req,res)=>{
  console.log('chat endpoint is invoked', req.query.message)
  const userQuery  = req.query.message;
      const embeddings = new OllamaEmbeddings({
          model:'llama3',
          baseUrl: 'http://localhost:11434',
      });
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url:'http://localhost:6333',
            collectionName: 'lanchainjs-testing',
        }
    ).catch(e=>{
        console.log('error occured',e)
    });

    if (!vectorStore) {
      return res.status(500).json({ error: 'Vector store not available' });
    }

    const retriever = vectorStore.asRetriever();
    const result = await retriever.invoke(userQuery);

    const SYSTEM_PROMPT = `You are a helpful AI Assistant who answers the user query based on the available context from the PDF file.\nContext: ${JSON.stringify(result, null, 2)}\n`;

    const message = [
      { role: 'assistant', content: SYSTEM_PROMPT },
      { role: 'user', content: userQuery }
    ];

    const response = await client.invoke(message);
    return res.json({ response });

})

app.listen(8000,()=>console.log(`Server Started on PORT: ${8000} `))