'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

interface IMessage{
    role: 'assistant' | 'user';
    content?:string;
    documents?:string;
}

// Message template component
const MessageItem = ({ message }: { message: IMessage }) => {
    let content = message.content;
    if (message.role === 'assistant' && typeof message.content !== 'string' && message.content && typeof message.content === 'object') {
        // @ts-ignore
        content = message.content.kwargs?.content || '';
    }
    return (
        <div className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative rounded-2xl px-5 py-3 max-w-[75%] shadow-md whitespace-pre-line break-words ${
                message.role === 'user'
                    ? 'bg-slate-800 text-slate-100 rounded-br-none'
                    : 'bg-slate-200 text-slate-900 border border-slate-300 rounded-bl-none'
            }`}>
                <span className={`block text-xs font-semibold mb-1 ${message.role === 'user' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {message.role === 'user' ? 'You' : 'Assistant'}
                </span>
                <span>{content}</span>
            </div>
        </div>
    );
};

function Chat() {
    const [message, setMessage] = React.useState<string>('');
    const [messages, setMessages] = React.useState<IMessage[]>([]);

    const handleSendChatMessage = async () => {
        if (!message.trim()) return;
        setMessages((prev) => [...prev, { role: 'user', content: message }]);
        setMessage(''); // Clear input field after sending

        const res = await fetch(`http://localhost:8000/chat?message=${message}`);
        const data = await res.json();
        console.log(data);

        if (data?.response) {
            setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendChatMessage();
        }
    };

    return (
        <div className='flex flex-col h-screen bg-slate-50'>
            <div className='flex-1 overflow-y-auto px-4 py-6 mb-28'>
                {messages.map((message, index) => (
                    <MessageItem key={index} message={message} />
                ))}
            </div>
            <div className='fixed bottom-0 left-1/2 w-1/2 bg-slate-100 border-t border-slate-200 px-4 py-4 flex gap-2 z-10 rounded-t-xl shadow-lg' style={{ transform: 'none' }}>
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder='Type your message here'
                    className='w-full bg-slate-50 text-slate-900 border-slate-300'
                />
                <Button onClick={handleSendChatMessage} disabled={!message.trim()} className='bg-slate-800 text-slate-100 hover:bg-slate-700'>
                    Send
                </Button>
            </div>
        </div>
    );
}

export default Chat