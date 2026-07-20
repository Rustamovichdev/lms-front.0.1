import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Card,
    Input,
    Select,
    Button,
    Table,
    Checkbox,
    Tag,
    Modal,
    Form,
    Popconfirm,
    message,
    Spin,
    Pagination,
    Tooltip,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TeamOutlined,
    ReloadOutlined,
    EllipsisOutlined,
} from "@ant-design/icons";

const COURSES = ["Web design", "Frontend", "Backend", "Mobile dasturlash", "SMM", "Grafik dizayn"];
const GROUPS = ["8-guruh", "12-guruh", "14-guruh", "15-guruh"];
const BOLIMLAR = ["IT bo'limi", "Marketing bo'limi", "Dizayn bo'limi"];

const PAGE_SIZE = 6;

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy} - ${hh}:${min}`;
}

function randomOf(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function Lid() {
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [courseFilter, setCourseFilter] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchLeads();
    }, []);

    async function fetchLeads() {
        setLoading(true);
        try {
            const res = await axios.get("https://dummyjson.com/users?limit=100");
            const mapped = res.data.users.map((u) => {
                const accepted = Math.random() > 0.5;
                return {
                    id: u.id,
                    name: `${u.firstName} ${u.lastName}`,
                    date: formatDate(u.birthDate || Date.now()),
                    course: randomOf(COURSES),
                    accepted,
                    group: accepted ? randomOf(GROUPS) : "-",
                };
            });
            setLeads(mapped);
        } catch (err) {
            message.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    }

    const filteredLeads = useMemo(() => {
        return leads.filter((l) => {
            const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
            const matchesCourse = courseFilter ? l.course === courseFilter : true;
            return matchesSearch && matchesCourse;
        });
    }, [leads, search, courseFilter]);

    const pagedLeads = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredLeads.slice(start, start + PAGE_SIZE);
    }, [filteredLeads, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, courseFilter]);

    function toggleStatus(id, checked) {
        setLeads((prev) =>
            prev.map((l) =>
                l.id === id
                    ? {
                        ...l,
                        accepted: checked,
                        group: checked ? (l.group !== "-" ? l.group : randomOf(GROUPS)) : "-",
                    }
                    : l
            )
        );
        message.success(checked ? "Qabul qilindi deb belgilandi" : "Qabul qilinmadi deb belgilandi");
    }

    function openEditModal(lead) {
        setEditingLead(lead);
        form.setFieldsValue({
            name: lead.name,
            course: lead.course,
            group: lead.group === "-" ? undefined : lead.group,
            accepted: lead.accepted,
        });
        setIsModalOpen(true);
    }

    function openAddModal() {
        setEditingLead(null);
        form.resetFields();
        setIsModalOpen(true);
    }

    function handleDelete(id) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        message.success("Lid o'chirildi");
    }

    function handleModalOk() {
        form.validateFields().then((values) => {
            if (editingLead) {
                setLeads((prev) =>
                    prev.map((l) =>
                        l.id === editingLead.id
                            ? {
                                ...l,
                                name: values.name,
                                course: values.course,
                                accepted: values.accepted,
                                group: values.accepted ? values.group || randomOf(GROUPS) : "-",
                            }
                            : l
                    )
                );
                message.success("Lid tahrirlandi");
            } else {
                const newLead = {
                    id: Date.now(),
                    name: values.name,
                    date: formatDate(Date.now()),
                    course: values.course,
                    accepted: values.accepted || false,
                    group: values.accepted ? values.group || randomOf(GROUPS) : "-",
                };
                setLeads((prev) => [newLead, ...prev]);
                message.success("Yangi lid qo'shildi");
            }
            setIsModalOpen(false);
            form.resetFields();
        });
    }

    const stats = [
        { title: "Faol lidlar", value: leads.length, sub: "1 oydan beri", change: "↑ 30%" },
        {
            title: "Qiziqish bildirgan",
            value: leads.filter((l) => l.accepted).length,
            sub: "1 oydan beri",
            change: "↑ 60%",
        },
        { title: "Sinovda", value: leads.filter((l) => !l.accepted).length, sub: "Sinov mudatidagi lidlar" },
        { title: "Tark etgan", value: Math.max(leads.length - 100, 0), sub: "Tark etgan lidlar" },
        { title: "Sinovdan o'tgan", value: leads.filter((l) => l.accepted).length, sub: "Sinovdan o'tgan lidlar" },
    ];

    const columns = [
        {
            title: "",
            dataIndex: "checkbox",
            width: 50,
            render: (_, record) => (
                <Checkbox
                    checked={record.accepted}
                    onChange={(e) => toggleStatus(record.id, e.target.checked)}
                />
            ),
        },
        {
            title: "Ism familiya",
            dataIndex: "name",
            render: (text) => <span className="text-gray-800 font-medium">{text}</span>,
        },
        {
            title: "Sana va vaqt",
            dataIndex: "date",
            render: (text) => <span className="text-gray-500">{text}</span>,
        },
        {
            title: "Yozilgan kursi",
            dataIndex: "course",
            render: (text) => <span className="text-gray-500">{text}</span>,
        },
        {
            title: "Status",
            dataIndex: "accepted",
            render: (accepted) =>
                accepted ? (
                    <Tag color="blue" className="!rounded-full !px-3 !py-0.5 !border-0 !bg-blue-50 !text-blue-600">
                        Qabul qilindi
                    </Tag>
                ) : (
                    <Tag color="red" className="!rounded-full !px-3 !py-0.5 !border-0 !bg-red-50 !text-red-500">
                        Qabul qilinmadi
                    </Tag>
                ),
        },
        {
            title: "Guruh",
            dataIndex: "group",
            render: (text) => <span className="text-gray-500">{text}</span>,
        },
        {
            title: "",
            dataIndex: "actions",
            width: 90,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Tooltip title="Tahrirlash">
                        <EditOutlined
                            className="text-blue-500 cursor-pointer text-base"
                            onClick={() => openEditModal(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Lidni o'chirish"
                        description="Rostdan ham ushbu lidni o'chirmoqchimisiz?"
                        okText="Ha, o'chirish"
                        cancelText="Bekor qilish"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Tooltip title="O'chirish">
                            <DeleteOutlined className="text-red-500 cursor-pointer text-base" />
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-[1300px] mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Leads</h1>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    {stats.map((s, i) => (
                        <Card key={i} className="!rounded-xl !shadow-sm" bodyStyle={{ padding: 16 }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <TeamOutlined className="text-blue-500" />
                                </div>
                                <span className="text-gray-500 text-sm">{s.title}</span>
                            </div>
                            <div className="text-2xl font-semibold text-gray-800 mt-2">{s.value}</div>
                            <div className="text-xs text-gray-400 mt-1">
                                {s.change && (
                                    <span className="text-blue-500 bg-blue-50 rounded px-1.5 py-0.5 mr-1">{s.change}</span>
                                )}
                                {s.sub}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Table card */}
                <Card className="!rounded-xl !shadow-sm" bodyStyle={{ padding: 20 }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Lidlar ro'yhati</h2>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
                            Lid qo'shish
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Input
                            placeholder="Qidiruv"
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="!w-56"
                        />
                        <Select
                            placeholder="Bo'lim"
                            allowClear
                            className="!w-40"
                            options={BOLIMLAR.map((b) => ({ label: b, value: b }))}
                        />
                        <Select
                            placeholder="Kurs bo'yicha"
                            allowClear
                            className="!w-44"
                            value={courseFilter}
                            onChange={setCourseFilter}
                            options={COURSES.map((c) => ({ label: c, value: c }))}
                        />
                        <Select
                            placeholder="Sana bo'yicha"
                            allowClear
                            className="!w-40"
                            options={[
                                { label: "Bugun", value: "today" },
                                { label: "Shu hafta", value: "week" },
                                { label: "Shu oy", value: "month" },
                            ]}
                        />
                        <Tooltip title="Filtrlarni tozalash">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => {
                                    setSearch("");
                                    setCourseFilter(undefined);
                                }}
                            />
                        </Tooltip>
                        <Button icon={<EllipsisOutlined />} />
                    </div>

                    <Spin spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={pagedLeads}
                            rowKey="id"
                            pagination={false}
                            locale={{ emptyText: "Lidlar topilmadi" }}
                        />
                    </Spin>

                    <div className="flex justify-end mt-4">
                        <Pagination
                            current={currentPage}
                            pageSize={PAGE_SIZE}
                            total={filteredLeads.length}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                        />
                    </div>
                </Card>
            </div>

            <Modal
                title={editingLead ? "Lidni tahrirlash" : "Yangi lid qo'shish"}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
                okText={editingLead ? "Saqlash" : "Qo'shish"}
                cancelText="Bekor qilish"
                destroyOnClose
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Form.Item
                        name="name"
                        label="Ism familiya"
                        rules={[{ required: true, message: "Ism familiyani kiriting" }]}
                    >
                        <Input placeholder="Masalan: Asadbek Shomurodov" />
                    </Form.Item>
                    <Form.Item
                        name="course"
                        label="Yozilgan kursi"
                        rules={[{ required: true, message: "Kursni tanlang" }]}
                    >
                        <Select placeholder="Kursni tanlang" options={COURSES.map((c) => ({ label: c, value: c }))} />
                    </Form.Item>
                    <Form.Item name="accepted" label="Status" valuePropName="checked" initialValue={false}>
                        <Checkbox>Qabul qilindi</Checkbox>
                    </Form.Item>
                    <Form.Item name="group" label="Guruh">
                        <Select placeholder="Guruhni tanlang" allowClear options={GROUPS.map((g) => ({ label: g, value: g }))} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
