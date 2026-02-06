import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { FAMILY_MEMBERS } from '../utils/constants';

function Auth({ onLogin }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setPassword('');
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (selectedUser && password === selectedUser.password) {
            onLogin(selectedUser);
        } else {
            setError('비밀번호가 틀렸습니다.');
        }
    };

    const handleBack = () => {
        setSelectedUser(null);
        setPassword('');
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        {selectedUser ? `${selectedUser.name}님, 안녕하세요!` : '누구세요?'}
                    </h2>

                    {!selectedUser ? (
                        <div className="grid grid-cols-1 gap-4">
                            {FAMILY_MEMBERS.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => handleUserClick(member)}
                                    className={`flex items-center justify-center p-6 text-xl font-bold text-white rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 ${member.color} ${member.hoverColor}`}
                                >
                                    <span className="text-4xl mr-4">{member.avatar}</span>
                                    {member.name}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className={`p-4 rounded-xl ${selectedUser.color} bg-opacity-10 flex items-center justify-center`}>
                                <span className="text-6xl">{selectedUser.avatar}</span>
                            </div>

                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호를 입력하세요"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-center text-lg tracking-widest"
                                    autoFocus
                                />
                                <Lock className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
                            </div>

                            {error && <p className="text-red-500 text-center text-sm font-semibold animate-pulse">{error}</p>}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 py-3 px-4 text-white rounded-lg font-semibold shadow-md transition-all transform hover:scale-105 ${selectedUser.color} ${selectedUser.hoverColor}`}
                                >
                                    로그인
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Auth;
