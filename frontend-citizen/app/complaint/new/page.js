"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function NewComplaintPage() {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        location: "",
        description: "",
    });

    // Voice recording state
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Unable to access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleAudioFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioBlob(file);
            setAudioUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
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
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                            Report a Civic Issue
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Please provide detailed information about the civic issue you want to report.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Complaint Details</CardTitle>
                            <CardDescription>
                                Fill in all the required information to help us process your complaint effectively.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Issue Title *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Brief description of the issue"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="roads">Roads & Infrastructure</option>
                                        <option value="water">Water Supply</option>
                                        <option value="electricity">Electricity</option>
                                        <option value="waste">Waste Management</option>
                                        <option value="streetlights">Street Lights</option>
                                        <option value="drainage">Drainage</option>
                                        <option value="parks">Parks & Recreation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="description">Detailed Description *</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Please provide a detailed description of the issue, including any relevant details that might help in resolving it..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={5}
                                        required
                                    />
                                </div>
                                
                                {/* Media Upload Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Media Attachments</h3>
                                    
                                    {/* Photos Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="photos">Upload Photos</Label>
                                        <Input
                                            id="photos"
                                            name="photos"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="file:rounded-md file:px-3 file:py-1 file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            You can upload multiple photos to help illustrate the issue.
                                        </p>
                                    </div>

                                    {/* Video Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="video">Upload Video</Label>
                                        <Input
                                            id="photos"
                                            name="photos"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="file:rounded-md file:px-3 file:py-1 file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Upload video (max 10MB). Supported formats: MP4, AVI, MOV.
                                        </p>
                                    </div>

                                    {/* Audio Recording/Upload */}
                                    <div className="space-y-3">
                                        <Label>Record or Upload Audio</Label>
                                        
                                        {/* Mobile-first responsive layout */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            {/* Recording Button */}
                                            <div className="flex-1">
                                                {!isRecording ? (
                                                    <Button 
                                                        type="button"
                                                        variant="default" 
                                                        onClick={startRecording}
                                                        className="w-full sm:w-auto"
                                                    >
                                                        🎤 Start Recording
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        type="button"
                                                        variant="destructive" 
                                                        onClick={stopRecording}
                                                        className="w-full sm:w-auto"
                                                    >
                                                        ⏹ Stop Recording
                                                    </Button>
                                                )}
                                            </div>

                                            {/* File Upload */}
                                            <div className="flex-1">
                                                <Input
                                                    type="file"
                                                    accept="audio/*"
                                                    onChange={handleAudioFileUpload}
                                                    className="file:rounded-md file:px-3 file:py-1 file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                                />
                                            </div>
                                        </div>

                                        {/* Recording Status */}
                                        {isRecording && (
                                            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-red-700">Recording in progress...</span>
                                            </div>
                                        )}

                                        {/* Audio Preview */}
                                        {audioUrl && (
                                            <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                                                <p className="text-sm font-medium">Audio Preview:</p>
                                                <audio 
                                                    controls 
                                                    className="w-full h-8" 
                                                    src={audioUrl}
                                                >
                                                    Your browser does not support the audio element.
                                                </audio>
                                                <div className="flex justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setAudioUrl(null);
                                                            setAudioBlob(null);
                                                        }}
                                                    >
                                                        Remove Audio
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <p className="text-xs text-muted-foreground">
                                            Record audio directly or upload an existing audio file. Max duration: 5 minutes.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location*</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder=""
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="address">State*</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text-area"
                                        placeholder=""
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">District*</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text-area"
                                        placeholder=""
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="locality">Locality*</Label>
                                    <Input
                                        id="locality"
                                        name="locality"
                                        type="text-area"
                                        placeholder=""
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pincode">PIN CODE*</Label>
                                    <Input
                                        id="pincode"
                                        name="pincode"
                                        type="text-area"
                                        placeholder="Enter your 6-digit PIN code"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="landmark">Landmark*</Label>
                                    <Input
                                        id="landmark"
                                        name="landmark"
                                        type="text-area"
                                        placeholder=""
                                        value={formData.landmark}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <Separator />

                                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                    <Link href="/" className="order-2 sm:order-1 sm:flex-1">
                                        <Button variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" className="order-1 sm:order-2 sm:flex-1">
                                        Submit Complaint
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

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
