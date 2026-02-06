import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../utils/storage';
import EventModal from './EventModal';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

function Calendar({ currentUser }) {
    const [months, setMonths] = useState([]);
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);

    // Refs for scrolling
    const todayRef = useRef(null);

    useEffect(() => {
        // Initialize with current month + 12 future months
        const today = new Date();
        const initMonths = [];
        for (let i = 0; i < 12; i++) {
            initMonths.push(addMonths(today, i));
        }
        setMonths(initMonths);

        // Load initial events from server
        const loadEvents = async () => {
            const loadedEvents = await fetchEvents();
            setEvents(loadedEvents);
        };
        loadEvents();
    }, []);

    const handleLoadMore = () => {
        const lastMonth = months[months.length - 1];
        const newMonths = [];
        for (let i = 1; i < 6; i++) {
            newMonths.push(addMonths(lastMonth, i));
        }
        setMonths([...months, ...newMonths]);
    };

    const handleLoadPrevious = () => {
        const firstMonth = months[0];
        const newMonths = [];
        for (let i = 1; i <= 6; i++) {
            newMonths.unshift(addMonths(firstMonth, -i));
        }
        setMonths([...newMonths, ...months]);
    };

    const handleGoToToday = () => {
        const today = new Date();
        const isTodayVisible = months.some(m => isSameMonth(m, today));

        if (!isTodayVisible) {
            const initMonths = [];
            for (let i = 0; i < 12; i++) {
                initMonths.push(addMonths(today, i));
            }
            setMonths(initMonths);
            setTimeout(() => {
                todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleDayClick = (day) => {
        setSelectedDate(day);
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEventClick = (e, event) => {
        e.stopPropagation();
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleSaveEvent = async (eventData) => {
        let savedEvents;
        if (editingEvent) {
            savedEvents = await updateEvent(eventData);
        } else {
            savedEvents = await createEvent({
                id: Date.now().toString(),
                ...eventData
            });
        }
        setEvents(savedEvents);
    };

    const handleDeleteEvent = async (eventId) => {
        const remainingEvents = await deleteEvent(eventId);
        setEvents(remainingEvents);
    };

    return (
        <div className="h-full overflow-y-auto bg-stone-50 pb-20 relative parent-scroll-container text-stone-700 font-sans">
            {/* Floating Today Button */}
            <button
                onClick={handleGoToToday}
                className="fixed bottom-24 right-6 z-50 p-3 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 hover:scale-110 transition-all"
                title="오늘로 이동"
            >
                <CalendarIcon className="w-6 h-6" />
            </button>

            <div className="flex flex-col gap-8 py-4">
                <button
                    onClick={handleLoadPrevious}
                    className="mx-4 py-2 bg-white text-stone-400 text-sm rounded-xl hover:bg-stone-100 border border-stone-200"
                >
                    이전 달 보기...
                </button>

                {months.map((monthDate) => (
                    <MonthSection
                        key={monthDate.toString()}
                        monthDate={monthDate}
                        events={events}
                        onDayClick={handleDayClick}
                        onEventClick={handleEventClick}
                        todayRef={todayRef}
                    />
                ))}

                <button
                    onClick={handleLoadMore}
                    className="mx-4 py-2 bg-white text-stone-400 text-sm rounded-xl hover:bg-stone-100 border border-stone-200"
                >
                    더 보기...
                </button>
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate || (editingEvent ? new Date(editingEvent.date) : null)}
                initialEvent={editingEvent}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                currentUser={currentUser}
            />
        </div>
    );
}

function MonthSection({ monthDate, events, onDayClick, onEventClick, todayRef }) {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });
    const startDayIdx = getDay(start); // 0 = Sunday
    const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="mb-8 mx-4 bg-white rounded-3xl shadow-sm border border-stone-100">
            {/* Header: Month + Weekdays (Not Sticky) */}
            <div className="bg-white/95 border-b border-stone-100 rounded-t-3xl shadow-sm">
                <div className="flex items-center justify-center px-6 pt-6 pb-4">
                    <span className="inline-block px-6 py-2 rounded-full bg-indigo-50 text-indigo-900 text-lg font-extrabold shadow-sm border border-indigo-100">
                        {format(monthDate, 'yyyy년 M월', { locale: ko })}
                    </span>
                </div>

                <div className="grid grid-cols-7 text-center pb-3 text-sm">
                    {WEEKDAYS.map((day, idx) => (
                        <div key={day} className={`font-semibold ${idx === 0 ? 'text-rose-400' : idx === 6 ? 'text-indigo-400' : 'text-stone-400'}`}>
                            {day}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-7">
                {/* Empty cells for start padding */}
                {Array.from({ length: startDayIdx }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[120px] border-b border-r border-stone-50 bg-stone-50/30"></div>
                ))}

                {days.map((day, idx) => {
                    const dayEvents = events
                        .filter(e => isSameDay(new Date(e.date), day))
                        .sort((a, b) => {
                            if (!a.time) return 1; // Events without time go last
                            if (!b.time) return -1;
                            return a.time.localeCompare(b.time);
                        });
                    const isSunday = getDay(day) === 0;
                    const isSaturday = getDay(day) === 6;
                    const isToday = isSameDay(day, new Date());
                    const dayNum = format(day, 'd');

                    // Logic to add rounded corners to the bottom-left and bottom-right cells if needed
                    // For now, simplicity is key. The container has rounded corners, but without overflow hidden, 
                    // content might bleed if it has background. use last-child logic or just padding.
                    // Actually, the container `rounded-3xl` + `border` will show the border curve.
                    // Children backgrounds might bleed slightly at corners if we don't clip.
                    // But standard cells have white/transparent bg, except `isToday` or hover.
                    // We can live with minor bleeding or fix it with complex CSS.
                    // Let's add `overflow-hidden` ONLY to the grid container if needed, but not the whole MonthSection?
                    // No, sticky needs to be sibling or inside. 
                    // Best easy fix: Add a wrapper for the grid that respects border radius bottom?
                    // Or just let it be. The user prioritized functionality (sticky).

                    return (
                        <div
                            key={day.toString()}
                            ref={isToday ? todayRef : null}
                            onClick={() => onDayClick(day)}
                            className={`min-h-[120px] border-b border-r border-stone-50 p-2 relative transition-all cursor-pointer 
                                ${isToday ? 'bg-indigo-50/30' : 'hover:bg-stone-50'}
                                ${/* Add rounded corners for the very last cells if strictly required, but standard rect on grid is fine for now */ ''}
                            `}
                        >
                            <div className="flex justify-center mb-1">
                                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
                                    ${isToday
                                        ? 'bg-indigo-500 text-white shadow-md scale-110'
                                        : isSunday
                                            ? 'text-rose-400'
                                            : isSaturday
                                                ? 'text-indigo-400'
                                                : 'text-stone-600'
                                    }`}>
                                    {dayNum}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1.5 overflow-hidden">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        onClick={(e) => onEventClick(e, event)}
                                        className={`text-[11px] px-2 py-1 rounded-lg text-white font-medium shadow-sm hover:opacity-80 active:scale-95 transition-all ${event.color} cursor-pointer min-h-[24px]`}
                                    >
                                        <div className="flex flex-col leading-tight break-words whitespace-normal">
                                            {event.time && <span className="text-[9px] opacity-80 mb-0.5">{event.time}</span>}
                                            <span>{event.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;
