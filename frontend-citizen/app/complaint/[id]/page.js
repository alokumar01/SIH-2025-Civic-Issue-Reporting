"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ComplaintDetailPage() {
    const params = useParams();
    const complaintId = params.id;

    // Mock data - in real app, this would be fetched based on the ID
    const complaint = {
        id: complaintId,
        title: "Pothole on Main Street",
        category: "Roads & Infrastructure",
        location: "Main Street, near City Hall, Ward 12",
        status: "in-progress",
        priority: "high",
        submittedDate: "2025-09-20T10:30:00",
        lastUpdate: "2025-09-23T14:45:00",
        description: "Large pothole on Main Street near the City Hall intersection. The pothole is approximately 2 feet wide and 6 inches deep, causing significant inconvenience to vehicles and potentially damaging tires. Multiple vehicles have been seen avoiding this area, causing traffic congestion during peak hours.",
        images: [
            "/api/placeholder/400/300",
            "/api/placeholder/400/300"
        ],
        timeline: [
            {
                date: "2025-09-20T10:30:00",
                status: "submitted",
                title: "Complaint Submitted",
                description: "Your complaint has been successfully submitted and assigned ID: " + complaintId,
                user: "System"
            },
            {
                date: "2025-09-21T09:15:00",
                status: "acknowledged",
                title: "Complaint Acknowledged",
                description: "Your complaint has been reviewed and acknowledged by the Municipal Corporation.",
                user: "Municipal Admin"
            },
            {
                date: "2025-09-22T11:30:00",
                status: "assigned",
                title: "Assigned to Department",
                description: "Complaint has been assigned to the Roads & Infrastructure Department for further action.",
                user: "Department Head"
            },
            {
                date: "2025-09-23T14:45:00",
                status: "in-progress",
                title: "Work in Progress",
                description: "Field inspection completed. Road repair work has been scheduled and will begin within 2-3 working days.",
                user: "Field Engineer"
            }
        ],
        assignedTo: {
            department: "Roads & Infrastructure Department",
            officer: "John Smith",
            contact: "+1-234-567-8900",
            email: "john.smith@municipal.gov"
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            submitted: "bg-gray-50 text-gray-700 border-gray-200",
            acknowledged: "bg-blue-50 text-blue-700 border-blue-200",
            assigned: "bg-purple-50 text-purple-700 border-purple-200",
            "in-progress": "bg-yellow-50 text-yellow-700 border-yellow-200",
            resolved: "bg-green-50 text-green-700 border-green-200",
            rejected: "bg-red-50 text-red-700 border-red-200"
        };
        
        return (
            <Badge variant="outline" className={variants[status] || variants.submitted}>
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

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/complaint">
                                <Button variant="ghost" size="sm">
                                    ← Back to Complaints
                                </Button>
                            </Link>
                            <Separator orientation="vertical" className="h-6" />
                            <h1 className="text-xl font-semibold text-foreground">
                                Complaint Details
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Complaint Overview */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                                        {getStatusBadge(complaint.status)}
                                    </div>
                                    <CardDescription>
                                        ID: {complaint.id} • Filed on {new Date(complaint.submittedDate).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                {getPriorityBadge(complaint.priority)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                                    <p className="text-sm">{complaint.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                                    <p className="text-sm">{complaint.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                                    <p className="text-sm">{new Date(complaint.lastUpdate).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Current Status</p>
                                    <p className="text-sm capitalize">{complaint.status.replace('-', ' ')}</p>
                                </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                                <p className="text-sm leading-relaxed">{complaint.description}</p>
                            </div>

                            {complaint.images && complaint.images.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Attached Images</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {complaint.images.map((image, index) => (
                                            <div key={index} className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                                <span className="text-muted-foreground text-xs">Image {index + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Assigned Department */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Assigned Department</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Department</p>
                                    <p className="text-sm">{complaint.assignedTo.department}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Assigned Officer</p>
                                    <p className="text-sm">{complaint.assignedTo.officer}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Contact Phone</p>
                                    <p className="text-sm">{complaint.assignedTo.contact}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                                    <p className="text-sm">{complaint.assignedTo.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Progress Timeline</CardTitle>
                            <CardDescription>
                                Track the progress of your complaint from submission to resolution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {complaint.timeline.map((event, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className={`w-3 h-3 rounded-full mt-2 ${
                                                event.status === complaint.status ? 'bg-primary' : 'bg-muted-foreground'
                                            }`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-foreground">
                                                    {event.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(event.date).toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {event.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Updated by: {event.user}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="outline">
                                    Download Report
                                </Button>
                                <Button variant="outline">
                                    Share Complaint
                                </Button>
                                {complaint.status === 'resolved' && (
                                    <Button variant="outline">
                                        Provide Feedback
                                    </Button>
                                )}
                                {complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
                                    <Button variant="outline">
                                        Add Update
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
