"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
    CheckCircle,
    Clock,
    MapPin,
    Activity,
    Menu,
    Search,
    Bell,
    User,
    Edit2,
    Trash2,
    MoreVertical,
} from "lucide-react";

/* Shadcn UI components you should have in your project (paths may vary) */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
/*
  Single-file Admin Dashboard.
  - Replace dummy arrays & handlers with real API calls (fetch/axios/React Query).
  - Ensure Shadcn UI components are present in your project at the import paths.
*/

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Users / Roles (client-side state demo)
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", role: "" });
    const [formError, setFormError] = useState("");

    // Reports (replace with API)
    const [reports, setReports] = useState([
        {
            id: 25031,
            title: "Pothole near Main Street",
            status: "Pending",
            dept: "Public Works",
            createdAt: "2025-08-01",
        },
        {
            id: 25032,
            title: "Streetlight not working",
            status: "Resolved",
            dept: "Electrical",
            createdAt: "2025-07-29",
        },
        {
            id: 25033,
            title: "Overflowing Trash Bin",
            status: "In-Progress",
            dept: "Sanitation",
            createdAt: "2025-09-05",
        },
    ]);

    // UI state
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [deptFilter, setDeptFilter] = useState("");
    const [toast, setToast] = useState(null);
    const [editingReport, setEditingReport] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // KPI cards - ideally computed from API
    const cards = useMemo(
        () => [
            {
                title: "Total Reports",
                value: reports.length,
                icon: Activity,
                color: "bg-blue-50",
            },
            {
                title: "Resolved Reports",
                value: reports.filter((r) => r.status === "Resolved").length,
                icon: CheckCircle,
                color: "bg-green-50",
            },
            {
                title: "Pending Reports",
                value: reports.filter((r) => r.status === "Pending").length,
                icon: Clock,
                color: "bg-yellow-50",
            },
            {
                title: "Active Municipalities",
                value: 15,
                icon: MapPin,
                color: "bg-purple-50",
            },
        ],
        [reports]
    );

    // filtered reports for table
    const filteredReports = useMemo(() => {
        return reports.filter((r) => {
            if (statusFilter !== "all" && r.status !== statusFilter) return false;
            if (deptFilter !== "all" && r.dept !== deptFilter) return false;
            if (
                query &&
                !`${r.title} ${r.id} ${r.dept}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
            )
                return false;
            return true;
        });
    }, [reports, statusFilter, deptFilter, query]);

    // helper: show small toast message
    function showToast(message, type = "success") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    }

    // Role Manager: add user
    function addUser() {
        setFormError("");
        if (!form.name.trim() || !form.email.trim() || !form.role) {
            setFormError("Please fill name, email and select role.");
            return;
        }
        // basic email validation (demo)
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setFormError("Please enter a valid email.");
            return;
        }
        setUsers((u) => [...u, { ...form, id: Date.now() }]);
        setForm({ name: "", email: "", role: "" });
        showToast("User added successfully");
    }

    // Report actions
    function updateReportStatus(id, nextStatus) {
        setReports((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
        );
        showToast(`Report ${id} moved to "${nextStatus}"`);
    }

    function deleteReport(id) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        setConfirmDelete(null);
        showToast(`Report ${id} deleted`, "info");
    }

    // editing modal: change title/dept
    function saveEditedReport(updated) {
        setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setEditingReport(null);
        showToast(`Report ${updated.id} updated`);
    }

    // accessible keyboard close for mobile sidebar
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") setSidebarOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* HEADER */}
            <header className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between z-30">
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden p-2 rounded hover:bg-gray-100"
                        aria-label="Toggle menu"
                        onClick={() => setSidebarOpen((s) => !s)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-3">
                        {/* optional small logo */}
                                                <div className="hidden md:flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                                                        <Image
                                                            src="/jharkhand-logo.webp"
                                                            alt="logo"
                                                            width={28}
                                                            height={28}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h1 className="text-lg font-semibold text-gray-800">
                                                            Govt of Jharkhand
                                                        </h1>
                                                        <p className="text-xs text-gray-500">
                                                            Dashboard • Crowdsourced Civic Issue Reporting
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="hidden sm:flex items-center gap-2 bg-white border rounded px-2 py-1">
                                                <Search className="w-4 h-4 text-gray-400" />
                                                <Input
                                                    placeholder="Search reports, id or department"
                                                    className="border-0 shadow-none py-0"
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                />
                                            </div>

                                            <button className="p-2 rounded hover:bg-gray-100 relative">
                                                <Bell className="w-5 h-5 text-gray-600" />
                                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            </button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1">
                                                        <User className="w-6 h-6 text-gray-700" />
                                                        <span className="hidden sm:inline text-sm text-gray-700">
                                                            Admin
                                                        </span>
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </header>

                                    <div className="flex flex-1 overflow-hidden">
                                        {/* SIDEBAR - desktop */}
                <aside
                    className={`hidden md:flex md:w-64 lg:w-72 flex-col bg-white border-r`}
                >
                    <div className="p-4 font-semibold text-green-700 border-b">
                        Admin Panel
                    </div>
                    <nav className="flex-1 p-2 space-y-1">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`w-full text-left px-3 py-2 rounded ${activeTab === "overview"
                                ? "bg-green-50 font-semibold"
                                : "hover:bg-green-50"
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("reports")}
                            className={`w-full text-left px-3 py-2 rounded ${activeTab === "reports"
                                ? "bg-green-50 font-semibold"
                                : "hover:bg-green-50"
                                }`}
                        >
                            Reports
                        </button>
                        <button
                            onClick={() => setActiveTab("roles")}
                            className={`w-full text-left px-3 py-2 rounded ${activeTab === "roles"
                                ? "bg-green-50 font-semibold"
                                : "hover:bg-green-50"
                                }`}
                        >
                            Manage Roles
                        </button>
                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={`w-full text-left px-3 py-2 rounded ${activeTab === "analytics"
                                ? "bg-green-50 font-semibold"
                                : "hover:bg-green-50"
                                }`}
                        >
                            Analytics
                        </button>
                    </nav>

                    <div className="p-4 border-t">
                        <p className="text-xs text-gray-500">Govt of Jharkhand</p>
                        <p className="text-sm font-medium">
                            Department of Higher & Technical Education
                        </p>
                    </div>
                </aside>

                {/* SIDEBAR - mobile slide-over */}
                {sidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40">
                        <div
                            className="absolute inset-0 bg-black opacity-25"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg p-4 overflow-auto">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">Menu</h3>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-1 rounded hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>
                            <nav className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        setActiveTab("overview");
                                        setSidebarOpen(false);
                                    }}
                                    className="text-left px-3 py-2 rounded hover:bg-green-50"
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("reports");
                                        setSidebarOpen(false);
                                    }}
                                    className="text-left px-3 py-2 rounded hover:bg-green-50"
                                >
                                    Reports
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("roles");
                                        setSidebarOpen(false);
                                    }}
                                    className="text-left px-3 py-2 rounded hover:bg-green-50"
                                >
                                    Manage Roles
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("analytics");
                                        setSidebarOpen(false);
                                    }}
                                    className="text-left px-3 py-2 rounded hover:bg-green-50"
                                >
                                    Analytics
                                </button>
                            </nav>
                        </div>
                    </div>
                )}

                {/* MAIN */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Overview */}
                    {activeTab === "overview" && (
                        <>
                            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {cards.map((c, idx) => (
                                    <div
                                        key={idx}
                                        className={`${c.color} rounded-lg p-4 shadow-sm flex items-center gap-4`}
                                    >
                                        <div className="p-3 rounded-full bg-white">
                                            <c.icon className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{c.title}</p>
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {c.value}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-semibold">Recent Reports</h2>
                                        <div className="flex gap-2 items-center">
                                            <Select
                                                value={statusFilter}
                                                onValueChange={(v) => setStatusFilter(v)}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Filter Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                    <SelectItem value="In-Progress">
                                                        In-Progress
                                                    </SelectItem>
                                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select
                                                value={deptFilter}
                                                onValueChange={(v) => setDeptFilter(v)}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Filter Dept" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="Public Works">
                                                        Public Works
                                                    </SelectItem>
                                                    <SelectItem value="Electrical">Electrical</SelectItem>
                                                    <SelectItem value="Sanitation">Sanitation</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <Table>
                                            <TableCaption>All Civic Reports</TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Dept</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {filteredReports.length > 0 ? (
                                                    filteredReports.map((r) => (
                                                        <TableRow key={r.id}>
                                                            <TableCell>{r.id}</TableCell>
                                                            <TableCell>{r.title}</TableCell>
                                                            <TableCell>{r.dept}</TableCell>
                                                            <TableCell>{r.createdAt}</TableCell>
                                                            <TableCell>
                                                                <StatusBadge status={r.status} />
                                                            </TableCell>
                                                            <TableCell className="text-right space-x-2">
                                                                <Button size="sm" onClick={() => setEditingReport(r)}>
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => setConfirmDelete(r)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                                                            No reports found.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold mb-3">Quick Actions</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Use quick role assignment below or view analytics.
                                    </p>

                                    <div className="space-y-3">
                                        <Button onClick={() => setActiveTab("roles")}>
                                            Go to Role Manager
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setActiveTab("analytics")}
                                        >
                                            Open Analytics
                                        </Button>
                                    </div>

                                    <div className="mt-6 border-t pt-4 text-xs text-gray-500">
                                        <p>
                                            <strong>Problem ID:</strong> 25031
                                        </p>
                                        <p className="mt-1">
                                            Crowdsourced Civic Issue Reporting and Resolution System
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {/* Reports Tab */}
                    {activeTab === "reports" && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">All Reports</h2>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Search reportssss..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                    <Select
                                        value={statusFilter}
                                        onValueChange={(v) => setStatusFilter(v)}
                                    >
                                        <SelectTrigger className="w-44">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value=" ">All</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In-Progress">In-Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs uppercase text-gray-500">
                                            <th className="pb-2">ID</th>
                                            <th className="pb-2">Title</th>
                                            <th className="pb-2">Dept</th>
                                            <th className="pb-2">Date</th>
                                            <th className="pb-2">Status</th>
                                            <th className="pb-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReports.map((r) => (
                                            <tr key={r.id} className="border-t">
                                                <td className="py-3">{r.id}</td>
                                                <td className="py-3">{r.title}</td>
                                                <td className="py-3">{r.dept}</td>
                                                <td className="py-3">{r.createdAt}</td>
                                                <td className="py-3">
                                                    <StatusBadge status={r.status} />
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setEditingReport(r)}
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => setConfirmDelete(r)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredReports.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="py-8 text-center text-gray-500"
                                                >
                                                    No reports found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Role Manager */}
                    {activeTab === "roles" && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Assign Roles</h2>
                                <p className="text-sm text-gray-500">
                                    Create municipal/staff/department head accounts
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        placeholder="Name"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({ ...form, email: e.target.value })
                                        }
                                    />
                                    <Select
                                        value={form.role}
                                        onValueChange={(v) => setForm({ ...form, role: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="municipal">Municipal Admin</SelectItem>
                                            <SelectItem value="dept-head">Department Head</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formError && (
                                    <p className="text-sm text-red-600 mt-2">{formError}</p>
                                )}

                                <div className="mt-4 flex items-center gap-2">
                                    <Button onClick={addUser}>Add User</Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setForm({ name: "", email: "", role: "" })}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h3 className="font-semibold text-sm mb-3">Users</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.length > 0 ? (
                                            users.map((u) => (
                                                <TableRow key={u.id}>
                                                    <TableCell>{u.name}</TableCell>
                                                    <TableCell>{u.email}</TableCell>
                                                    <TableCell>
                                                        <Badge className="capitalize">{u.role}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <Button size="sm">Edit</Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                setUsers((prev) => prev.filter((p) => p.id !== u.id))
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                                                    No users added yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                        </section>
                    )}

                    {/* Analytics (simple placeholder) */}
                    {activeTab === "analytics" && (
                        <section className="space-y-6">
                            <h2 className="text-xl font-semibold">Analytics & Reports</h2>
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <p className="text-sm text-gray-600">
                                    Charts and deeper analytics go here (e.g., response times,
                                    hotspots, monthly trends). For jury demo, show a screenshot or
                                    embed a lightweight chart library (Chart.js/Canvas).
                                </p>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="h-44 rounded border border-dashed flex items-center justify-center text-sm text-gray-400">
                                        Resolution Time Chart
                                    </div>
                                    <div className="h-44 rounded border border-dashed flex items-center justify-center text-sm text-gray-400">
                                        Reports by Department
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* Editing Dialog */}
            <Dialog
                open={!!editingReport}
                onOpenChange={(open) => {
                    if (!open) setEditingReport(null);
                }}
            >
                <DialogTrigger />
                <DialogContent>
                    <DialogHeader>
                        <h3 className="text-lg font-semibold">
                            {editingReport ? `Edit Report ${editingReport.id}` : "Edit"}
                        </h3>
                    </DialogHeader>

                    {editingReport && (
                        <EditReportForm
                            report={editingReport}
                            onSave={saveEditedReport}
                            onCancel={() => setEditingReport(null)}
                        />
                    )}

                    <DialogFooter>
                        <Button onClick={() => setEditingReport(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog
                open={!!confirmDelete}
                onOpenChange={(open) => {
                    if (!open) setConfirmDelete(null);
                }}
            >
                <DialogTrigger />
                <DialogContent>
                    <DialogHeader>
                        <h3 className="text-lg font-semibold text-red-600">
                            Delete Report
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Are you sure you want to delete report {confirmDelete?.id}?
                        </p>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={() => deleteReport(confirmDelete.id)}
                        >
                            Delete
                        </Button>
                        <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Toast */}
            {toast && (
                <div className="fixed right-6 bottom-6 bg-white border shadow rounded px-4 py-2 z-50">
                    <p className="text-sm">{toast.message}</p>
                </div>
            )}
        </div>
    );
}

/* --- small helper components --- */

function StatusBadge({ status }) {
    const map = {
        Pending: "bg-yellow-50 text-yellow-800",
        "In-Progress": "bg-blue-50 text-blue-800",
        Resolved: "bg-green-50 text-green-800",
    };
    return (
        <span
            className={`px-2 py-1 rounded text-sm font-medium ${map[status] ?? "bg-gray-100 text-gray-700"
                }`}
        >
            {status}
        </span>
    );
}

function EditReportForm({ report, onSave, onCancel }) {
    const [state, setState] = useState(report);

    useEffect(() => setState(report), [report]);

    return (
        <div className="space-y-3">
            <input
                className="w-full border rounded px-3 py-2"
                value={state.title}
                onChange={(e) => setState({ ...state, title: e.target.value })}
            />
            <input
                className="w-full border rounded px-3 py-2"
                value={state.dept}
                onChange={(e) => setState({ ...state, dept: e.target.value })}
            />
            <Select
                value={state.status}
                onValueChange={(v) => setState({ ...state, status: v })}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In-Progress">In-Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex gap-2 justify-end">
                <Button onClick={() => onSave(state)}>Save</Button>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
