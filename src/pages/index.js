import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

let uid;

if(window.sessionStorage.getItem('current-user-id') !== ''){
    uid = window.sessionStorage.getItem('current-user-id');
}else{
    uid = uuidv4();
    window.sessionStorage.setItem('current-user-id', uid);
}

export default function Home(){
    const navigate = useNavigate();
    const socketRef = useRef();
    const [username, setUsername] = useState('');
    const [classID, setClassID] = useState('');

    useEffect(() => {
        socketRef.current = io('http://localhost:9000/').connect();
        socketRef.current.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
        socketRef.current.on('all-users', (data) => {
            console.log(data)
        });
    }, []);

    const handleStartNewClass = () => {
        const classID = uuidv4();
        const classTitle = 'Socket and Peer Tutorial';
        const username = 'odunayo';

        socketRef.current.emit('start-class', { classID, classTitle, uid, username});
        socketRef.current.on('class-created', (data) => {
            if(data.success){
                navigate(`classrooms/${classID}`)
            }
        });
    }

    const handleJoinClass = (e) => {
        e.preventDefault();

        if(socketRef.current.connected){
            socketRef.current.emit('join-class', {
                uid,
                username,
                classID
            });
            socketRef.current.on('user-joined', (data) => {
                console.log(data)
            })
            socketRef.current.on('class-does-not-exist', (data) => {
                console.log(data);
            });
        }else{
            alert("Not connected to the server")
        }
    };

    return (
        <div>
            <button 
                className="bg-blue-700 p-3 rounded-lg text-white"
                onClick={handleStartNewClass}
            >
                Start Class
            </button>

            <div className='w-4/12 p-4'>
                <form onSubmit={handleJoinClass}>
                    <div className='py-2'>
                        <div className='my-2 py-2 flex flex-col'>
                            <label className='font-semibold text-base mb-2'>Your name</label>
                            <input 
                                className='border-2 border-gray-600 rounded-md p-2'
                                type="text" 
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='e.g Odunayo Fawumi'
                                required
                            />
                        </div>
                        <div className='my-2 py-2 flex flex-col'>
                            <label className='font-semibold text-base mb-2'>Class Code</label>
                            <input 
                                className='border-2 border-gray-600 rounded-md p-2'
                                type="text" 
                                onChange={(e) => setClassID(e.target.value)} 
                                placeholder="e.g adepio-mnisdkk-dfcder-er453" 
                                required
                            />
                        </div>
                        
                        <button className="bg-blue-700 p-3 rounded-lg text-white">Join Class</button>
                    </div>
                </form>
            </div>
        </div>
    )
}