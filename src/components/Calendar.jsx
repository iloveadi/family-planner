import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../utils/storage';
import EventModal from './EventModal';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

function Calendar({ currentUser, viewMode }) {
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

        // Auto-scroll to today after a slight delay to ensure rendering
        setTimeout(() => {
            todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
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
        // Changed to load only 1 previous month
        for (let i = 1; i <= 1; i++) {
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

            <div className={`flex flex-col gap-6 py-4 ${viewMode === 'month' ? 'px-2' : ''}`}>
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
                        viewMode={viewMode}
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

function MonthSection({ monthDate, events, onDayClick, onEventClick, todayRef, viewMode }) {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const startDayIdx = getDay(start); // 0 = Sunday
    const days = eachDayOfInterval({ start, end });
    const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className={`mb-4 mx-4 bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden ${viewMode === 'list' ? '' : 'min-h-[300px]'}`}>
            {/* Header: Month Name */}
            <div className="bg-white/95 border-b border-stone-100 p-4 sticky top-0 z-10 backdrop-blur-sm flex flex-col">
                <h3 className="text-lg font-extrabold text-indigo-900 ml-2">
                    {format(monthDate, 'yyyy년 M월', { locale: ko })}
                </h3>

                {/* Weekday Header for Month View */}
                {viewMode === 'month' && (
                    <div className="grid grid-cols-7 text-center pt-3 text-sm">
                        {WEEKDAYS.map((day, idx) => (
                            <div key={day} className={`font-semibold ${idx === 0 ? 'text-rose-400' : idx === 6 ? 'text-indigo-400' : 'text-stone-400'}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {viewMode === 'list' ? (
                // LIST VIEW
                <div className="flex flex-col">
                    {days.map((day) => {
                        const dayEvents = events
                            .filter(e => isSameDay(new Date(e.date), day))
                            .sort((a, b) => {
                                if (!a.time) return 1;
                                if (!b.time) return -1;
                                return a.time.localeCompare(b.time);
                            });

                        const dayOfWeekIdx = getDay(day);
                        const isSunday = dayOfWeekIdx === 0;
                        const isSaturday = dayOfWeekIdx === 6;
                        const isToday = isSameDay(day, new Date());
                        const dayNum = format(day, 'd');
                        const dayName = WEEKDAYS[dayOfWeekIdx];

                        const getDayStyles = () => {
                            if (isToday) return 'bg-amber-50/80 border-l-4 border-l-indigo-500';
                            if (isSunday) return 'bg-rose-50/40';
                            if (isSaturday) return 'bg-blue-50/40';
                            return 'bg-white hover:bg-stone-50';
                        };

                        return (
                            <div
                                key={day.toString()}
                                ref={isToday ? todayRef : null}
                                onClick={() => onDayClick(day)}
                                className={`
                                    min-h-[70px] p-3 border-b border-stone-100 last:border-b-0
                                    transition-all cursor-pointer flex flex-row gap-3
                                    ${getDayStyles()}
                                `}
                            >
                                {/* Date Header: Left Side */}
                                <div className="flex flex-col items-center justify-start min-w-[50px] pt-1 gap-1">
                                    <span className={`text-lg font-bold
                                        ${isToday
                                            ? 'bg-indigo-600 text-white w-9 h-9 flex items-center justify-center rounded-full shadow-md transform scale-105'
                                            : isSunday
                                                ? 'text-rose-600'
                                                : isSaturday
                                                    ? 'text-blue-600'
                                                    : 'text-stone-700'
                                        }`}
                                    >
                                        {dayNum}
                                    </span>
                                    <span className={`text-xs font-bold uppercase tracking-wide
                                        ${isSunday
                                            ? 'text-rose-400'
                                            : isSaturday
                                                ? 'text-blue-400'
                                                : 'text-stone-400'
                                        }`}
                                    >
                                        {dayName}
                                    </span>
                                </div>

                                {/* Events List: Right Side */}
                                <div className="flex-1 flex flex-col gap-1.5 pt-0.5 min-w-0">
                                    {dayEvents.length > 0 ? (
                                        dayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                onClick={(e) => onEventClick(e, event)}
                                                className={`
                                                    flex items-center gap-2 px-3 py-2 rounded-xl text-white shadow-sm 
                                                    hover:opacity-90 active:scale-[0.98] transition-all 
                                                    ${event.color} cursor-pointer min-w-0 border border-white/20
                                                `}
                                            >
                                                {event.time && (
                                                    <span className="text-[11px] font-bold opacity-90 bg-black/20 px-1.5 py-0.5 rounded flex-shrink-0">
                                                        {event.time}
                                                    </span>
                                                )}
                                                <span className="text-sm font-semibold truncate">{event.title}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // MONTH GRID VIEW
                <div className="grid grid-cols-7 border-t border-stone-100">
                    {/* Empty cells for start padding */}
                    {Array.from({ length: startDayIdx }).map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[80px] sm:min-h-[100px] border-b border-r border-stone-50 bg-stone-50/20"></div>
                    ))}

                    {days.map((day) => {
                        const dayEvents = events
                            .filter(e => isSameDay(new Date(e.date), day))
                            .sort((a, b) => {
                                if (!a.time) return 1;
                                if (!b.time) return -1;
                                return a.time.localeCompare(b.time);
                            });

                        const dayOfWeekIdx = getDay(day);
                        const isSunday = dayOfWeekIdx === 0;
                        const isSaturday = dayOfWeekIdx === 6;
                        const isToday = isSameDay(day, new Date());
                        const dayNum = format(day, 'd');

                        return (
                            <div
                                key={day.toString()}
                                ref={isToday ? todayRef : null}
                                onClick={() => onDayClick(day)}
                                className={`
                                    min-h-[80px] sm:min-h-[100px] border-b border-r border-stone-50 p-1 relative transition-colors cursor-pointer
                                    ${isToday ? 'bg-amber-50' : 'hover:bg-stone-50'}
                                    ${isSunday ? 'bg-rose-50/10' : ''}
                                    ${isSaturday ? 'bg-blue-50/10' : ''}
                                `}
                            >
                                <div className="flex justify-center mb-1">
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                                        ${isToday
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : isSunday
                                                ? 'text-rose-500'
                                                : isSaturday
                                                    ? 'text-blue-500'
                                                    : 'text-stone-600'
                                        }`}>
                                        {dayNum}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 overflow-hidden">
                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            onClick={(e) => onEventClick(e, event)}
                                            className={`
                                                text-[10px] px-1.5 py-0.5 rounded text-white font-medium shadow-sm 
                                                truncate whitespace-nowrap opacity-90 hover:opacity-100
                                                ${event.color}
                                            `}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Calendar;
