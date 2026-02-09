import React, { useState } from 'react';
import { Lock } from 'lucide-react';

function Auth({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === '1212') {
            onLogin({
                id: 'me',
                name: '나',
                avatar: '😎',
                color: 'bg-indigo-500',
                hoverColor: 'hover:bg-indigo-600'
            });
        } else {
            setError('비밀번호가 틀렸습니다.');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="text-center mb-10">
                        <span className="text-6xl mb-4 block">🔒</span>
                        <h2 className="text-2xl font-bold text-stone-800">
                            패스워드 입력
                        </h2>
                        <p className="text-stone-500 mt-2 text-sm">
                            접근하려면 코드를 입력하세요.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <input
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="code"
                                className="w-full px-4 py-4 border-2 border-stone-100 rounded-2xl focus:outline-none focus:border-indigo-500 text-center text-2xl tracking-[0.5em] font-bold bg-stone-50 text-stone-800 placeholder-stone-300 transition-colors"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="text-rose-500 text-center text-sm font-medium animate-pulse bg-rose-50 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all hover:bg-indigo-700"
                        >
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Auth;
