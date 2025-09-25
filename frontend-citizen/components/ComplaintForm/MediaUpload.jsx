"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function MediaUpload({ media, onChange, className }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    
    // Clean up audio URL on unmount
    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const handleFileUpload = (e, type) => {
        const files = Array.from(e.target.files);
        onChange({
            ...media,
            [type]: [...(media[type] || []), ...files]
        });
    };

    const removeFile = (type, index) => {
        const updatedFiles = [...media[type]];
        updatedFiles.splice(index, 1);
        onChange({
            ...media,
            [type]: updatedFiles
        });
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());

                // Add to media state
                onChange({
                    ...media,
                    voiceRecordings: [...(media.voiceRecordings || []), blob]
                });
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

    return (
        <Card className={`p-6 ${className}`}>
            <div className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                    <Label htmlFor="images">Upload Photos</Label>
                    <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'images')}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-primary/90"
                    />
                    {media.images?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {media.images.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Upload ${index + 1}`}
                                        className="h-20 w-20 object-cover rounded"
                                    />
                                    <button
                                        onClick={() => removeFile('images', index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Video Upload */}
                <div className="space-y-2">
                    <Label htmlFor="videos">Upload Videos</Label>
                    <Input
                        id="videos"
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'videos')}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-primary/90"
                    />
                    {media.videos?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {media.videos.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                                    <span className="text-sm">{file.name}</span>
                                    <button
                                        onClick={() => removeFile('videos', index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Voice Recording */}
                <div className="space-y-3">
                    <Label>Voice Recording</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            onClick={isRecording ? stopRecording : startRecording}
                            variant={isRecording ? "destructive" : "default"}
                        >
                            {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>

                        {isRecording && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-sm text-red-500">Recording...</span>
                            </div>
                        )}
                    </div>

                    {audioUrl && (
                        <div className="bg-muted p-3 rounded">
                            <audio controls src={audioUrl} className="w-full" />
                            <Button
                                type="button"
                                variant="ghost"
                                className="mt-2"
                                onClick={() => {
                                    setAudioUrl(null);
                                    setAudioBlob(null);
                                    onChange({
                                        ...media,
                                        voiceRecordings: media.voiceRecordings.slice(0, -1)
                                    });
                                }}
                            >
                                Remove Recording
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}