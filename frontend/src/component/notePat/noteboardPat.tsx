import React, { useState } from 'react';

interface NoteboardPatProps {
    onSave: (text: string) => void;
    onClose: () => void;
}

const NoteboardPat: React.FC<NoteboardPatProps> = ({ onSave, onClose }) => {
    const [text, setText] = useState('');

    return (
        <div className='noteboardPat'>
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
        </div>
    );
}

export default NoteboardPat;
