import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

function EventModal({ isOpen, onClose, onSave, onDelete, selectedDate, currentUser, initialEvent }) {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('12:00');

    useEffect(() => {
        if (initialEvent) {
            setTitle(initialEvent.title);
            setTime(initialEvent.time || '12:00');
        } else {
            setTitle('');
            setTime('12:00');
        }
    }, [initialEvent, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave({
            ...initialEvent, // Keep existing ID if editing
            title,
            time,
            date: initialEvent ? initialEvent.date : selectedDate,
            userId: initialEvent ? initialEvent.userId : currentUser.id,
            color: initialEvent ? initialEvent.color : currentUser.color
        });

        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            onDelete(initialEvent.id);
            onClose();
        }
    };

    const isEditing = !!initialEvent;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">{isEditing ? '일정 수정' : '새 일정 추가'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                        <div className="p-2 bg-gray-100 rounded text-gray-600">
                            {isEditing && initialEvent
                                ? new Date(initialEvent.date).toLocaleDateString()
                                : selectedDate ? selectedDate.toLocaleDateString() : ''}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="일정을 입력하세요"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">시간 (선택)</label>
                        <div className="flex gap-2">
                            <select
                                value={parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                                onChange={(e) => {
                                    const newAmpm = e.target.value;
                                    let [h, m] = time.split(':');
                                    let hour = parseInt(h);
                                    if (newAmpm === 'PM' && hour < 12) hour += 12;
                                    if (newAmpm === 'AM' && hour >= 12) hour -= 12;
                                    setTime(`${hour.toString().padStart(2, '0')}:${m}`);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="AM">오전</option>
                                <option value="PM">오후</option>
                            </select>
                            <select
                                value={(() => {
                                    let h = parseInt(time.split(':')[0]);
                                    if (h === 0) return 12;
                                    if (h > 12) return h - 12;
                                    return h;
                                })()}
                                onChange={(e) => {
                                    const newHour = parseInt(e.target.value);
                                    let [currentH, m] = time.split(':');
                                    let isPm = parseInt(currentH) >= 12;
                                    let finalH = newHour;
                                    if (isPm && newHour < 12) finalH += 12;
                                    if (!isPm && newHour === 12) finalH = 0; // 12 AM
                                    if (isPm && newHour === 12) finalH = 12; // 12 PM

                                    setTime(`${finalH.toString().padStart(2, '0')}:${m}`);
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                                    <option key={h} value={h}>{h}시</option>
                                ))}
                            </select>
                            <select
                                value={time.split(':')[1]}
                                onChange={(e) => {
                                    const [h] = time.split(':');
                                    setTime(`${h}:${e.target.value}`);
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                {['00', '10', '20', '30', '40', '50'].map(m => (
                                    <option key={m} value={m}>{m}분</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700"
                        >
                            {isEditing ? '수정하기' : '추가하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventModal;
