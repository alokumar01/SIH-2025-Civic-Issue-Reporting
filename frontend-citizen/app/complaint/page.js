"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ComplaintTrackingPage() {
    const [searchId, setSearchId] = useState("");
    const [complaints] = useState([
        {
            id: "CMP-2025-001",
            title: "Pothole on Main Street",
            category: "Roads & Infrastructure",
            location: "Main Street, near City Hall",
            status: "resolved",
            priority: "high",
            submittedDate: "2025-09-20",
            lastUpdate: "2025-09-23",
            description: "Large pothole causing traffic issues and vehicle damage."
        },
        {
            id: "CMP-2025-002", 
            title: "Street Light Not Working",
            category: "Street Lights",
            location: "Park Avenue, Block 15",
            status: "in-progress",
            priority: "medium",
            submittedDate: "2025-09-18",
            lastUpdate: "2025-09-22",
            description: "Street light has been flickering and now completely out."
        },
        {
            id: "CMP-2025-003",
            title: "Water Leakage Issue",
            category: "Water Supply",
            location: "Residential Complex, Building A",
            status: "pending",
            priority: "high",
            submittedDate: "2025-09-25",
            lastUpdate: "2025-09-25",
            description: "Continuous water leakage from main pipeline causing flooding."
        }
    ]);

    const getStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
            "in-progress": "bg-blue-50 text-blue-700 border-blue-200", 
            resolved: "bg-green-50 text-green-700 border-green-200",
            rejected: "bg-red-50 text-red-700 border-red-200"
        };
        
        return (
            <Badge variant="outline" className={variants[status] || variants.pending}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </Badge>
        );
    };

    const getPriorityBadge = (priority) => {
        const variants = {
            low: "bg-gray-50 text-gray-700 border-gray-200",
            medium: "bg-orange-50 text-orange-700 border-orange-200",
            high: "bg-red-50 text-red-700 border-red-200",
            critical: "bg-purple-50 text-purple-700 border-purple-200"
        };
        
        return (
            <Badge variant="outline" className={variants[priority] || variants.medium}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
        );
    };

    const filteredComplaints = searchId 
        ? complaints.filter(complaint => 
            complaint.id.toLowerCase().includes(searchId.toLowerCase()) ||
            complaint.title.toLowerCase().includes(searchId.toLowerCase())
          )
        : complaints;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    ← Back to Home
                                </Button>
                            </Link>
                            <Separator orientation="vertical" className="h-6" />
                            <h1 className="text-xl font-semibold text-foreground">
                                Track Complaints
                            </h1>
                        </div>
                        <Link href="/complaint/new">
                            <Button size="sm">
                                File New Complaint
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Your Complaints
                        </h2>
                        <p className="text-muted-foreground">
                            Track the status and progress of all your submitted complaints.
                        </p>
                    </div>

                    {/* Search Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Search Complaints</CardTitle>
                            <CardDescription>
                                Search by complaint ID or title to find specific complaints.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="search" className="sr-only">
                                        Search complaints
                                    </Label>
                                    <Input
                                        id="search"
                                        placeholder="Enter complaint ID or search by title..."
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" onClick={() => setSearchId("")}>
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Complaints List */}
                    <div className="space-y-4">
                        {filteredComplaints.length === 0 ? (
                            <Card>
                                <CardContent className="pt-8 pb-8 text-center">
                                    <p className="text-muted-foreground mb-4">
                                        {searchId ? "No complaints found matching your search." : "You haven't submitted any complaints yet."}
                                    </p>
                                    <Link href="/complaint/new">
                                        <Button>
                                            File Your First Complaint
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredComplaints.map((complaint) => (
                                <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                                                    {getStatusBadge(complaint.status)}
                                                </div>
                                                <CardDescription className="text-sm">
                                                    ID: {complaint.id} • {complaint.category}
                                                </CardDescription>
                                            </div>
                                            {getPriorityBadge(complaint.priority)}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Location:</p>
                                                <p className="text-sm">{complaint.location}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Description:</p>
                                                <p className="text-sm">{complaint.description}</p>
                                            </div>
                                            
                                            <Separator />
                                            
                                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                <span>Submitted: {new Date(complaint.submittedDate).toLocaleDateString()}</span>
                                                <span>Last Update: {new Date(complaint.lastUpdate).toLocaleDateString()}</span>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Link href={`/complaint/${complaint.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                                {complaint.status === 'pending' && (
                                                    <Button variant="outline" size="sm">
                                                        Edit Complaint
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Summary Stats */}
                    {complaints.length > 0 && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle className="text-lg">Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-foreground">
                                            {complaints.length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Total</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {complaints.filter(c => c.status === 'pending').length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Pending</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {complaints.filter(c => c.status === 'in-progress').length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">In Progress</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {complaints.filter(c => c.status === 'resolved').length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Resolved</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
