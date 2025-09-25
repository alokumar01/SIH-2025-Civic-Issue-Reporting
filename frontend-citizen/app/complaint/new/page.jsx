"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BasicInfo from "@/components/ComplaintForm/BasicInfo";
import LocationForm from "@/components/ComplaintForm/LocationForm";
import MediaUpload from "@/components/ComplaintForm/MediaUpload";
import { useState } from "react";
import api from "@/lib/api";

export default function NewComplaintPage() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        department: "",
        priority: "medium",
        tags: [],
        location: {
            coordinates: [],
            address: "",
            state: "",
            district: "",
            locality: "",
            pinCode: "",
            landmark: ""
        },
        media: {
            images: [],
            videos: [],
            voiceRecordings: []
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formDataToSend = new FormData();

            // Add basic fields
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("department", formData.department);
            formDataToSend.append("priority", formData.priority);
            
            // Add location details
            formDataToSend.append("location", JSON.stringify(formData.location));

            // Add media files
            formData.media.images.forEach(image => {
                formDataToSend.append("images", image);
            });

            formData.media.videos.forEach(video => {
                formDataToSend.append("videos", video);
            });

            formData.media.voiceRecordings.forEach(recording => {
                formDataToSend.append("voiceRecordings", recording);
            });

            // Add tags if present
            if (formData.tags.length > 0) {
                formDataToSend.append("tags", JSON.stringify(formData.tags));
            }

            console.log("Submitting form data:", formDataToSend);
            const res = await api.post('/v1/complaints',formData);

            const result = await res.data;
            console.log(result);
            // TODO: Show success message and redirect
            console.log('Complaint submitted successfully:', result);

        } catch (error) {
            console.error('Error submitting complaint:', error);
            // TODO: Show error message to user
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                                    <span className="hidden sm:inline">← Back to Home</span>
                                    <span className="sm:hidden">←</span>
                                </Button>
                            </Link>
                            <Separator orientation="vertical" className="h-6 hidden sm:block" />
                            <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                                <span className="hidden sm:inline">File New Complaint</span>
                                <span className="sm:hidden">New Complaint</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Report a Civic Issue
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Please provide detailed information about the civic issue you want to report.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Tabs defaultValue="basic" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="location">Location</TabsTrigger>
                                <TabsTrigger value="media">Media</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                        <CardDescription>
                                            Provide the main details of your complaint
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <BasicInfo
                                            data={formData}
                                            onChange={(data) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ...data
                                                }));
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="location">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Location Details</CardTitle>
                                        <CardDescription>
                                            Specify where the issue is located
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <LocationForm
                                            location={formData.location}
                                            onChange={(location) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    location
                                                }));
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="media">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Media Attachments</CardTitle>
                                        <CardDescription>
                                            Add photos, videos, or voice recordings
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <MediaUpload
                                            media={formData.media}
                                            onChange={(media) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    media
                                                }));
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-4">
                            <Link href="/">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit">
                                Submit Complaint
                            </Button>
                        </div>
                    </form>

                    {/* Help Section */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="text-lg">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>• Be as specific as possible when describing the location</p>
                                <p>• Include relevant details like time of day, weather conditions, etc.</p>
                                <p>• Upload clear photos if available to help authorities understand the issue</p>
                                <p>• You will receive a tracking ID once your complaint is submitted</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
