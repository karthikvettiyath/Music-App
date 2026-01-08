import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import AgoraRTC, {
    AgoraRTCProvider,
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteUsers,
    RemoteUser,
    LocalUser,
} from "agora-rtc-react";

// Initialize Agora Client
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
const APP_ID = "a378eecb07b34f1cb8990c07381a00ab";

const LiveVideo = ({ channelName, token, uid, onLeave }) => {
    // Join logic
    useJoin({ appid: APP_ID, channel: channelName, token, uid });

    const { localMicrophoneTrack } = useLocalMicrophoneTrack();
    const { localCameraTrack } = useLocalCameraTrack();

    // Publish tracks
    usePublish([localMicrophoneTrack, localCameraTrack]);

    const remoteUsers = useRemoteUsers();

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-y-auto">
                {/* Local User */}
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-green-500 shadow-lg">
                    <LocalUser
                        audioTrack={localMicrophoneTrack}
                        cameraTrack={localCameraTrack}
                        micOn={true}
                        cameraOn={true}
                        cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                    >
                        <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm z-10">You</span>
                    </LocalUser>
                </div>

                {/* Remote Users */}
                {remoteUsers.map((user) => (
                    <div key={user.uid} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-600 shadow-lg">
                        <RemoteUser user={user} cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg">
                            <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm z-10">User {user.uid}</span>
                        </RemoteUser>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-gray-800 flex justify-center border-t border-gray-700">
                <button
                    onClick={onLeave}
                    className="bg-red-600 px-8 py-3 rounded-full text-white font-bold hover:bg-red-700 transition shadow-lg flex items-center gap-2"
                >
                    <span>End Call</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const LiveClass = () => {
    const { user } = useContext(AuthContext);
    const [channel, setChannel] = useState('');
    const [token, setToken] = useState('');
    const [uid, setUid] = useState(null);
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const joinClass = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Determine role: Teacher -> publisher, Student -> subscriber (simplified for now to both publisher for interaction)
            // Ideally: Teacher = publisher, Student = subscriber unless asked to speak. 
            // For this demo, let's make everyone a publisher so they can talk.
            const role = 'publisher';

            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/meetings/token`, {
                channelName: channel,
                role: role
            });

            setToken(res.data.token);
            setUid(res.data.uid);
            setJoined(true);
        } catch (err) {
            console.error(err);
            setError('Failed to join class. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = () => {
        setJoined(false);
        setToken('');
        setUid(null);
    };

    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-400">RaagaLive Classroom</h1>
                {user && <span className="text-sm text-gray-400">Logged in as {user.name}</span>}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                {!joined ? (
                    <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                        <div className="text-center mb-8">
                            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold">Join Live Session</h2>
                            <p className="text-gray-400 mt-2">Enter the Class ID below to start streaming</p>
                        </div>

                        <form onSubmit={joinClass}>
                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Class ID / Channel Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., class101"
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
                                    value={channel}
                                    onChange={(e) => setChannel(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-bold text-lg transition ${loading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg transform hover:-translate-y-0.5'
                                    }`}
                            >
                                {loading ? 'Joining...' : 'Join Class'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <AgoraRTCProvider client={client}>
                        <LiveVideo
                            channelName={channel}
                            token={token}
                            uid={uid}
                            onLeave={handleLeave}
                        />
                    </AgoraRTCProvider>
                )}
            </div>
        </div>
    );
};

export default LiveClass;
