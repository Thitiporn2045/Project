import React, { useEffect, useState } from 'react';
import './stylePat.css';
import { Form, Input, message, Button, Modal, ConfigProvider } from 'antd';
import { DeleteNotePatientByID, GetNotesByPatientID, UpdateNotePatient } from '../../services/https/notePat/notePat';
import { NotePatInterface } from '../../interfaces/notePat/INotePat';
import { ImBin } from "react-icons/im";
import { BiSolidEditAlt } from "react-icons/bi";

function NotePat() {
    const [notePatients, setNotePatients] = useState<NotePatInterface[]>([]);
    const [selectedNote, setSelectedNote] = useState<NotePatInterface | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const patID = localStorage.getItem('patientID');

    const fetchNotePatientData = async () => {
        const res = await GetNotesByPatientID(Number(patID));
        if (res) {
            setNotePatients(res);
        }
        console.log('res', res);
    };

    useEffect(() => {
        fetchNotePatientData();
    }, []);

    const handleNoteClick = (index: number) => {
        const note = notePatients[index];
        setSelectedNote(prev => (prev && prev.ID === note.ID ? null : note)); // Ensure selectedNote has ID
    };

    
    const handleEdit = (note: NotePatInterface) => {
        console.log('Selected note for editing:', note); // ตรวจสอบข้อมูลโน้ต
        if (!note?.ID) {
            messageApi.error('ไม่พบ ID ของโน้ต');
            return;
        }
    
        setSelectedNote(note); // note นี้จะมี ID
        form.setFieldsValue({
            Title: note.Title,
            Content: note.Content,
        });
        setIsEditModalVisible(true); // เปิด Modal
    };
    
    
    const handleEditSubmit = async () => {
        console.log('Selected Note ID:', selectedNote?.ID); // ตรวจสอบว่า ID มีค่าหรือไม่
        if (!selectedNote?.ID) {
            messageApi.error('ไม่สามารถแก้ไขได้: ไม่พบ ID ของโน้ต');
            return;
        }
    
        const values = form.getFieldsValue();
    
        // Combine selectedNote (which includes ID) with form values
        const updatedNote = {
            ...selectedNote,  // selectedNote already contains the ID
            ...values,        // form values (Title, Content)
        };
    
        // Log the updated note to ensure the ID is included
        console.log('Payload to API:', updatedNote);
    
        try {
            const res = await UpdateNotePatient(updatedNote);
    
            // Handle API response
            if (res.status) {
                messageApi.success("แก้ไขข้อมูลสำเร็จ");
                await fetchNotePatientData(); // Refresh the note data
                setIsEditModalVisible(false); // ปิด Modal
            } else {
                messageApi.error(res.message);
            }
        } catch (error) {
            console.error('Error updating note:', error);
            messageApi.error('เกิดข้อผิดพลาดในการแก้ไขโน้ต');
        }
    };
    

    const handleDelete = async (noteId: number | undefined) => {
        Modal.confirm({
            title: 'ต้องการลบโน้ตนี้หรือไม่?',
            onOk: async () => {
                try {
                    await DeleteNotePatientByID(noteId);
                    messageApi.success('ลบโน้ตนี้สำเร็จ');
                    setNotePatients(prevNotes => prevNotes.filter(n => n.ID !== noteId));
                    // If the deleted note was selected, clear the selection
                    if (selectedNote?.ID === noteId) {
                        setSelectedNote(null);
                    }
                } catch (error) {
                    messageApi.error('ลบโน้ตไม่สำเร็จ');
                }
            },
            okText: 'ยืนยัน',
            cancelText: 'ยกเลิก',
        });
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#9BA5F6',
                },
            }}
        >
            <div className='notePat'>
                {notePatients.length === 0 ? (
                    <p>No notes available for this patient.</p>
                ) : (
                    notePatients.map((note, index) => (
                        <div 
                            key={index} 
                            className='note'
                            onClick={() => handleNoteClick(index)}
                        >
                            <div className="content">
                                <div className="head">
                                    <h2>{note.Title}</h2>
                                    <div className='border'></div>
                                </div>
                                <div className="body">
                                    <p>{note.Content}</p>
                                </div>
                            </div>
                            {selectedNote?.ID === note.ID && (
                                <div className="actions">
                                    <Button onClick={() => handleEdit(note)}><BiSolidEditAlt/></Button>
                                    <Button onClick={() => handleDelete(note.ID)}><ImBin /></Button>
                                </div>
                            )}
                        </div>
                    ))
                )}

                {contextHolder}

                <Modal
                    title="แก้ไขโน้ต"
                    visible={isEditModalVisible}
                    onOk={handleEditSubmit} // เมื่อคลิกบันทึก
                    onCancel={() => setIsEditModalVisible(false)} // เมื่อคลิกยกเลิก
                    okText="บันทึก"
                    cancelText="ยกเลิก"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item 
                            name="Title" 
                            label="ชื่อเรื่อง" 
                            rules={[{ required: true, message: 'กรุณาใส่ชื่อเรื่อง' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            name="Content" 
                            label="เนื้อหา" 
                            rules={[{ required: true, message: 'กรุณาใส่เนื้อหา' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
}

export default NotePat;
