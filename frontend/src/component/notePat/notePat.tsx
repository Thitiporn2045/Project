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
        // Toggle selected note: if it's the same note, set to null, otherwise set to the clicked note
        setSelectedNote(prev => (prev && prev.ID === note.ID ? null : note));
    };

    const handleEdit = (note: NotePatInterface) => {
        setSelectedNote(note);
        form.setFieldsValue({ 
            Title: note.Title, 
            Content: note.Content 
        });
        setIsEditModalVisible(true);
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

    const handleEditSubmit = async () => {
        const values = form.getFieldsValue();
        const updatedNote = {
            ...selectedNote,
            ...values,
        };

        try {
            const res = await UpdateNotePatient(updatedNote);
            console.log(res);
        
            if (res.status) {
                messageApi.open({
                    type: "success",
                    content: "แก้ไขข้อมูลสำเร็จ",
                });

                await fetchNotePatientData();
                setIsEditModalVisible(false);
            } else {
                messageApi.open({
                    type: "error",
                    content: res.message,
                });
            }
        } catch (error) {
            messageApi.error('เกิดข้อผิดพลาดในการแก้ไขโน้ต');
        }
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

                <Modal
                    title="แก้ไขโน้ต"
                    visible={isEditModalVisible}
                    onOk={handleEditSubmit}
                    onCancel={() => setIsEditModalVisible(false)}
                    okText="บันทึก"
                    cancelText="ยกเลิก"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="Title" label="ชื่อเรื่อง" rules={[{ required: true, message: 'กรุณาใส่ชื่อเรื่อง' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="Content" label="เนื้อหา" rules={[{ required: true, message: 'กรุณาใส่เนื้อหา' }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Form>
                </Modal>

                {contextHolder}
            </div>
        </ConfigProvider>
    );
}

export default NotePat;
