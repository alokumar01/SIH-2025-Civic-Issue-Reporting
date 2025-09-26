"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BasicInfo from "@/components/ComplaintForm/BasicInfo";
import LocationForm from "@/components/ComplaintForm/LocationForm";
import MediaUpload from "@/components/ComplaintForm/MediaUpload";
import api from "@/lib/api";

export default function NewComplaintPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 'basic', title: 'Basic Information', description: 'Provide the main details of your complaint' },
    { id: 'location', title: 'Location Details', description: 'Specify where the issue is located' },
    { id: 'media', title: 'Media Attachments', description: 'Add photos, videos, or voice recordings' }
  ];

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.title?.trim()) newErrors.title = "Title is required";
      if (!formData.category) newErrors.category = "Category is required";
    } else if (currentStep === 1) {
      if (!formData.location.state?.trim()) newErrors.state = "State is required";
      if (!formData.location.district?.trim()) newErrors.district = "District is required";
      if (!formData.location.locality?.trim()) newErrors.locality = "Locality is required";
      if (!formData.location.pinCode?.trim()) newErrors.pinCode = "Pin code is required";
      else if (!/^\d{6}$/.test(formData.location.pinCode)) newErrors.pinCode = "Pin code must be a 6-digit number";
      if (!formData.location.coordinates || formData.location.coordinates.length !== 2 ||
          isNaN(formData.location.coordinates[0]) || isNaN(formData.location.coordinates[1])) {
        newErrors.coordinates = "Valid longitude and latitude are required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      // Show toast for validation errors
      const errorMessages = Object.values(newErrors);
      if (errorMessages.length === 1) {
        toast.error(errorMessages[0]);
      } else {
        toast.error(`${errorMessages.join(", ")}`, {
          description: "Please fix the errors before trying again."
        });
      }
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      setErrors({});
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description || "");
      data.append("category", formData.category);
      data.append("priority", formData.priority || "Medium");
      data.append("state", formData.location.state);
      data.append("district", formData.location.district);
      data.append("locality", formData.location.locality);
      data.append("pinCode", formData.location.pinCode);
      if (formData.location.address) data.append("address", formData.location.address);
      if (formData.location.landmark) data.append("landmark", formData.location.landmark);
      data.append("location", JSON.stringify({ coordinates: formData.location.coordinates }));
      if (formData.tags.length) data.append("tags", JSON.stringify(formData.tags));
      formData.media.images.forEach(file => data.append("images", file));
      formData.media.videos.forEach(file => data.append("videos", file));
      formData.media.voiceRecordings.forEach(file => data.append("voiceRecordings", file));

      const res = await api.post("/v1/complaints", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      // Show success toast
      toast.success("Complaint submitted successfully!", {
        description: "Your civic issue report has been filed. You'll receive updates on its progress.",
        duration: 5000
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "Medium",
        tags: [],
        location: { coordinates: [], address: "", state: "", district: "", locality: "", pinCode: "", landmark: "" },
        media: { images: [], videos: [], voiceRecordings: [] }
      });
      setCurrentStep(0);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while submitting the complaint";
      
      // Show error toast
      toast.error("Failed to submit complaint", {
        description: errorMessage,
        duration: 6000
      });
      
      setErrors({ submit: errorMessage });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-4">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 mb-0 sm:mb-6">
              <Link href="/">
                <Button variant="ghost" size="sm" className="px-2 mt-5 sm:px-3">
                  <span className="hidden sm:inline">← Back to Home</span>
                  <span className="sm:hidden">←</span>
                </Button>
              </Link>
            </div>
          <div className="mb-4 sm:mb-6 sm:mt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Report a Civic Issue</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Please provide detailed information about the civic issue you want to report.</p>

            {/* Step Progress */}
            <div className="">
              {/* Desktop Progress - Horizontal */}
              <div className="hidden md:flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>{index + 1}</div>
                    <span className={`ml-2 text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>{step.title}</span>
                  </div>
                ))}
              </div>

              {/* Mobile Progress - Vertical */}
              <div className="md:hidden space-y-3 ">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mr-3 ${
                      index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-medium block ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                      {index === currentStep && (
                        <span className="text-xs text-muted-foreground block mt-1">
                          {step.description}
                        </span>
                      )}
                    </div>
                    {index <= currentStep && index < currentStep && (
                      <div className="w-4 h-4 text-blue-600">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Current Step Indicator for Mobile */}
              <div className="md:hidden mt-4 text-center">
                <span className="text-xs text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader className={"sm:pb-0"}>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className={"p-4 sm:pt-0"}>
              {currentStep === 0 && <BasicInfo data={formData} onChange={(data) => setFormData(prev => ({ ...prev, ...data }))} />}
              {currentStep === 1 && <LocationForm location={formData.location} onChange={(location) => setFormData(prev => ({ ...prev, location }))} />}
              {currentStep === 2 && <MediaUpload media={formData.media} onChange={(media) => setFormData(prev => ({ ...prev, media }))} />}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 mt-4">
            <div className="order-2 sm:order-1">
              {currentStep > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  ← Previous
                </Button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 order-1 sm:order-2">
              <Link href="/">
                <Button 
                  type="button" 
                  variant="ghost" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {currentStep === steps.length - 1 ? (isSubmitting ? "Submitting..." : "Submit Complaint") : "Next →"}
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader><CardTitle className="text-lg">Need Help?</CardTitle></CardHeader>
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
