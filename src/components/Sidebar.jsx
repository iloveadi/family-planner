import React from 'react';
import { X, ExternalLink, Globe, Key, BookOpen, Instagram, Facebook, Landmark, Calendar } from 'lucide-react';

// Custom SKKU Ginkgo Leaf Icon
const SkkuIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        {/* Stylized Ginkgo Leaf / SKKU logo shape approximation */}
        <path d="M50 85 C50 85 20 60 20 35 C20 15 35 5 50 15 C65 5 80 15 80 35 C80 60 50 85 50 85 Z M50 85 L50 45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M25 35 Q50 5 75 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
    </svg>
);

const LINK_SECTIONS = [
    {
        title: '성균관대학교',
        items: [
            { icon: <Key className="w-5 h-5 text-amber-500" />, title: '킹고ID 로그인', url: 'https://login.skku.edu/?retUrl=kc213u9an72n4n33c5l9' },
            { icon: <BookOpen className="w-5 h-5 text-emerald-600" />, title: '사범대학', url: 'https://coe.skku.edu/coe/index.do' },
            { icon: <Calendar className="w-5 h-5 text-purple-500" />, title: '학사일정', url: 'https://www.skku.edu/skku/edu/bachelor/ca_de_schedule.do' },
            { icon: <SkkuIcon className="w-5 h-5 text-[#8DC63F]" />, title: '학교 홈페이지', url: 'https://www.skku.edu/' },
            { icon: <Instagram className="w-5 h-5 text-pink-600" />, title: '인스타그램', url: 'https://www.instagram.com/skku.official/' },
            { icon: <Facebook className="w-5 h-5 text-blue-800" />, title: '페이스북', url: 'https://facebook.com/sungkyunkwanuniversity1398/?locale=ko_KR' },
        ]
    },
    {
        title: '유용한 사이트',
        items: [
            { icon: <Landmark className="w-5 h-5 text-indigo-600" />, title: '한국장학재단', url: 'https://www.kosaf.go.kr/ko/main.do' },
        ]
    }
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
            <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
                <div className="p-5 border-b flex justify-between items-center bg-gray-50 sticky top-0">
                    <h2 className="text-xl font-bold text-gray-800">바로가기</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-5 space-y-8">
                    {LINK_SECTIONS.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">{section.title}</h3>
                            <div className="space-y-2">
                                {section.items.map((link, linkIdx) => (
                                    <a
                                        key={linkIdx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
                                    >
                                        <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-white transition-colors">
                                            {link.icon}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold text-gray-700 group-hover:text-indigo-700">{link.title}</span>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-indigo-300" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 border-t mt-auto">
                    <p className="text-xs text-center text-gray-400">Family Planner v1.0</p>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
