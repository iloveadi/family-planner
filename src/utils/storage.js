import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = 'events';

export const fetchEvents = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

export const createEvent = async (event) => {
    try {
        // Firestore creates its own ID, so we remove the local ID if present or let Firestore handle it
        const { id, ...eventData } = event;
        const docRef = await addDoc(collection(db, COLLECTION_NAME), eventData);
        return await fetchEvents(); // Return updated list
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export const updateEvent = async (updatedEvent) => {
    try {
        const eventRef = doc(db, COLLECTION_NAME, updatedEvent.id);
        const { id, ...eventData } = updatedEvent;
        await updateDoc(eventRef, eventData);
        return await fetchEvents();
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

export const deleteEvent = async (eventId) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, eventId));
        return await fetchEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};
