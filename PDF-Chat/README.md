
* Key value store:
    Valkey: https://hub.docker.com/r/valkey/valkey/

* Queue:
    BullMq: https://bullmq.io/
    
* Langchain:
    JS Quadrant docs: https://js.langchain.com/docs/integrations/retrievers/self_query/qdrant/
    PDF Loader: https://js.langchain.com/docs/integrations/document_loaders/file_loaders/pdf/
    PDF Chunking: https://js.langchain.com/docs/concepts/text_splitters/

* Ollama 
    Using docker image of ollama
    command to pull gemma image "docker exec -it <ollama_container_name> ollama pull gemma3"
    e.g:
        * docker exec -it pdf-chat-ollama-1 ollama pull llama3