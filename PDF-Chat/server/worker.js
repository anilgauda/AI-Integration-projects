import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";
 
const worker = new Worker('file-upload-queue',async job =>{
   const data = JSON.parse(job.data)
   /** Steps that worker needs to do next: 
    * 1. Path: data.path
    * 2. read the pdf from path,
    * 3. chunk the pdf,
    * 4. call the openai embedding model for every chunk
    * 5. store the chunk in qdrant db
    */

    //Load the PDF
   const loader = new PDFLoader(data.path);

   const docs = await loader.load()

    const embeddings = new OllamaEmbeddings({
        model:'llama3',
        baseUrl: 'http://localhost:11434',
    });
    console.log('After embeddings',embeddings)

    //Spliting Docs 
   const textSplitter = new CharacterTextSplitter({
    chunkSize: 128,
    chunkOverlap: 0,
  });

  const splittedDocs = await textSplitter.splitDocuments(docs)
  console.log("After docs splitted. Chunk lengths:", splittedDocs.map(d => d.pageContent.length));
      const vectorStore = await QdrantVectorStore.fromDocuments(
        splittedDocs,
        embeddings,
        {
            url:'http://localhost:6333',
            collectionName: 'lanchainjs-testing',
        }
    ).catch(e=>{
        console.log('error occured',e)
    });
    if (vectorStore) {
      console.log("All docs are added to vector store")
    }



},{concurrency:100, connection:{
    host:'localhost',
    port: 6379
}});
