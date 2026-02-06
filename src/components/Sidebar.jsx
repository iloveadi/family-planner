import React from 'react';
import { X, ExternalLink, Globe, ShoppingCart, Stethoscope } from 'lucide-react';

const USEFUL_LINKS = [
    { id: 1, title: '학교 홈페이지', url: 'https://www.google.com/search?q=school', icon: <Globe className="w-5 h-5 text-blue-500" /> },
    { id: 2, title: '이마트몰', url: 'https://emart.ssg.com/', icon: <ShoppingCart className="w-5 h-5 text-yellow-500" /> },
    { id: 3, title: '소아과 예약', url: 'https://www.google.com/search?q=hospital', icon: <Stethoscope className="w-5 h-5 text-red-500" /> },
];

function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">가족 링크</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    {USEFUL_LINKS.map(link => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:bg-gray-50"
                        >
                            <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                {link.icon}
                            </div>
                            <div className="flex-1">
                                <span className="font-semibold text-gray-700 block">{link.title}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                    ))}
                </div>

                <div className="absolute bottom-0 w-full p-4 bg-gray-50 border-t">
                    <p className="text-xs text-center text-gray-400">Family Planner v1.0</p>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
