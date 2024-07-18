import React, { useState, useEffect } from 'react';
import './stylePsy.css';
import { FaCirclePlus } from "react-icons/fa6";

interface Note {
    id: number;
    text: string;
}

const NotePsy: React.FC = () => {
const [notes, setNotes] = useState<Note[]>([]);
const [isPopupOpen, setIsPopupOpen] = useState(false);
const [editingNote, setEditingNote] = useState<Note | null>(null);

useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(storedNotes);
}, []);

const saveNotesToLocalStorage = (updatedNotes: Note[]) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
};

const createNote = (noteText: string) => {
    if (noteText.trim() !== '') {
    const newNote: Note = {
        id: new Date().getTime(),
        text: noteText,
    };
    const updatedNotes = [...notes, newNote];
    saveNotesToLocalStorage(updatedNotes);
    }
    setIsPopupOpen(false);
};

const updateNote = (noteId: number, newText: string) => {
    const updatedNotes = notes.map(note =>
    note.id === noteId ? { ...note, text: newText } : note
    );
    saveNotesToLocalStorage(updatedNotes);
    setEditingNote(null);
};

const deleteNote = (noteId: number) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotesToLocalStorage(updatedNotes);
};

const NotePopup: React.FC<{ onSave: (text: string) => void; onClose: () => void }> = ({ onSave, onClose }) => {
    const [text, setText] = useState('');
    return (
    <div className="popup">
        <h2>New Note</h2>
        <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your note..."
        />
        <button onClick={() => onSave(text)}>Create Note</button>
        <button onClick={onClose}>Close</button>
    </div>
    );
};

const EditNotePopup: React.FC<{ note: Note; onSave: (id: number, text: string) => void; onClose: () => void }> = ({ note, onSave, onClose }) => {
    const [text, setText] = useState(note.text);
    return (
    <div className="popup">
        <h2>Edit Note</h2>
        <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        />
        <button onClick={() => onSave(note.id, text)}>Update</button>
        <button onClick={onClose}>Cancel</button>
    </div>
    );
};

return (
    <div className='notePsy'>
        <div id='blur'>
            <div id="container">
                <div id="list-header">
                <div id="addNoteDiv" onClick={() => setIsPopupOpen(true)}>
                    <i className="fa-solid fa-plus"><FaCirclePlus /></i>
                </div>
                </div>
                <div id="list-container">
                <ul id="notes-list">
                    {notes.map(note => (
                    <li key={note.id}>
                        <span>{note.text}</span>
                        <div id="noteBtns-container">
                        <button onClick={() => setEditingNote(note)}>
                            <i className="fa-solid fa-pen"></i>
                        </button>
                        <button onClick={() => deleteNote(note.id)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            {isPopupOpen && (
                <NotePopup
                onSave={createNote}
                onClose={() => setIsPopupOpen(false)}
                />
            )}
            {editingNote && (
                <EditNotePopup
                note={editingNote}
                onSave={updateNote}
                onClose={() => setEditingNote(null)}
                />
            )}
        </div>
    </div>
);
};

export default NotePsy;