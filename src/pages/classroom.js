import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom'
import Peer from 'simple-peer'

export default function Classroom(){
    const { classroomid: id } = useParams();
    const [loading, setLoading] = useState(true);
    const [classFound, setClassFound] = useState(false);
    const socketRef = useRef();
    const videoRef = useRef();
    const [usersPeers, setUsersPeers] = useState([]);
    const peersRef = useRef([]);
    const uid = window.sessionStorage.getItem('current-user-id');

    useEffect(() => {
        socketRef.current = io('http://localhost:9000/').connect();
        socketRef.current.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socketRef.current.emit('get-class-detail', id);
        
        socketRef.current.on("class-not-found", (data) => {
            setClassFound(data.isFound);
        });

        socketRef.current.on("classroom-detail", (data) => {
            console.log(data[0]);
            setClassFound(true);
        });

        setTimeout(() => setLoading(false), 3000);

        navigator.mediaDevices.getUserMedia({ audio: true, video: true}).then(stream => {
            console.log(stream);
            videoRef.current.srcObject = stream;
        }).catch(err =>  console.log(err));

    }, []);


    const createPeerSignal = (classID, uid, stream) => {
        const peer = new Peer({ initiator: true, trickle: false, stream});

        peer.on('signal', (signal) => {
            console.log(`peer signal for uid: ${uid}`, signal, classID);
        });

        return peer;
    }

    const addPeerSignal = (incomingSignal, uid, stream) => {
        const peer = new Peer({ initiator: true, trickle: false, stream});

        peer.on('signal', (signal) => {
            console.log(`peer signal for uid: ${uid}`, signal, incomingSignal);
        });

        return peer;
    }


    if(loading){
        return <h1>Please wait..... Prepare the classroom</h1>
    }

    if(!classFound){
        return <h1>Class doesn't exist</h1>
    }

    return (
        <div className="bg-gray-300 w-full h-full">
            <div className='w-1/2 mx-auto h-60 rounded-lg'>
                <video ref={videoRef} width={400} height={400} autoPlay />
                <h1 className='text-black'>Classroom</h1>
            </div>
        </div>
    )
}