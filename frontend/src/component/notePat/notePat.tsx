import React, { useEffect, useState } from 'react';
import './stylePat.css';
import { Form, Input, message, Button, Modal, ConfigProvider } from 'antd';
import { DeleteNotePatientByID, GetNotesByPatientID, UpdateNotePatient } from '../../services/https/notePat/notePat';
import { NotePatInterface } from '../../interfaces/notePat/INotePat';
import { ImBin } from "react-icons/im";
import { BiSolidEditAlt } from "react-icons/bi";
import { motion } from "framer-motion";

function NotePat() {
    const [notePatients, setNotePatients] = useState<NotePatInterface[]>([]);
    const [selectedNote, setSelectedNote] = useState<NotePatInterface | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const patID = localStorage.getItem('patientID');

    const fetchNotePatientData = async () => {
        try {
            const res = await GetNotesByPatientID(Number(patID));
            if (res) {
                setNotePatients(res);
            }
        } catch (error) {
            messageApi.error('ไม่สามารถดึงข้อมูลโน้ตได้');
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotePatientData();
    }, []);

    const handleNoteClick = (note: NotePatInterface) => {
        setSelectedNote(prev => (prev && prev.ID === note.ID ? null : note));
    };

    const handleEdit = (note: NotePatInterface, e: React.MouseEvent) => {
        e.stopPropagation(); // ป้องกันการ trigger event ของ parent
        
        if (!note?.ID) {
            messageApi.error('ไม่พบ ID ของโน้ต');
            return;
        }

        setSelectedNote(note);
        form.setFieldsValue({
            Title: note.Title,
            Content: note.Content,
        });
        setIsEditModalVisible(true);
    };

    const handleEditSubmit = async () => {
        try {
            if (!selectedNote?.ID) {
                messageApi.error('ไม่สามารถแก้ไขได้: ไม่พบ ID ของโน้ต');
                return;
            }

            const values = await form.validateFields();
            
            const updatedNote: NotePatInterface = {
                ID: selectedNote.ID,
                PatID: Number(patID),
                Title: values.Title,
                Content: values.Content,
            };

            const res = await UpdateNotePatient(updatedNote);

            if (res.status) {
                messageApi.success("แก้ไขข้อมูลสำเร็จ");
                await fetchNotePatientData();
                setIsEditModalVisible(false);
                form.resetFields();
            } else {
                messageApi.error(res.message || 'เกิดข้อผิดพลาดในการแก้ไขโน้ต');
            }
        } catch (error) {
            if (error instanceof Error) {
                messageApi.error(error.message);
            } else {
                messageApi.error('เกิดข้อผิดพลาดในการแก้ไขโน้ต');
            }
            console.error('Error updating note:', error);
        }
    };

    const handleDelete = async (noteId: number | undefined, e: React.MouseEvent) => {
        e.stopPropagation(); // ป้องกันการ trigger event ของ parent
        
        if (!noteId) {
            messageApi.error('ไม่พบ ID ของโน้ต');
            return;
        }

        Modal.confirm({
            title: 'ต้องการลบโน้ตนี้หรือไม่?',
            onOk: async () => {
                try {
                    await DeleteNotePatientByID(noteId);
                    messageApi.success('ลบโน้ตนี้สำเร็จ');
                    setNotePatients(prevNotes => prevNotes.filter(n => n.ID !== noteId));
                    if (selectedNote?.ID === noteId) {
                        setSelectedNote(null);
                    }
                } catch (error) {
                    messageApi.error('ลบโน้ตไม่สำเร็จ');
                    console.error('Error deleting note:', error);
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
                    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                        <div className="Loading-Data"></div>
                        <div className='text'>ไม่มีข้อมูล...</div>
                    </div>
                ) : (
                    notePatients.map((note, index) => (
                        <motion.div
                            key={note.ID || index}
                            className='note'
                            onClick={() => handleNoteClick(note)}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
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
                                    <Button onClick={(e) => handleEdit(note, e)}><BiSolidEditAlt/></Button>
                                    <Button onClick={(e) => handleDelete(note.ID, e)}><ImBin /></Button>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}

                {contextHolder}

                <Modal
                    title="แก้ไขโน้ต"
                    open={isEditModalVisible}
                    onOk={handleEditSubmit}
                    onCancel={() => {
                        setIsEditModalVisible(false);
                        form.resetFields();
                    }}
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