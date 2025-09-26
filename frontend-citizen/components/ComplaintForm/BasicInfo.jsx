"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const CATEGORIES = [
    { value: "roads", label: "Roads & Infrastructure" },
    { value: "water", label: "Water Supply" },
    { value: "electricity", label: "Electricity" },
    { value: "waste", label: "Waste Management" },
    { value: "streetlights", label: "Street Lights" },
    { value: "drainage", label: "Drainage" },
    { value: "parks", label: "Parks & Recreation" },
    { value: "other", label: "Other" }
];

const PRIORITIES = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
];

export default function BasicInfo({ data, onChange, className }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({
            ...data,
            [name]: value
        });
    };

    const handleTagsChange = (e) => {
        const tagsArray = e.target.value.split(',').map(tag => tag.trim());
        onChange({
            ...data,
            tags: tagsArray
        });
    };

    return (
        <Card className={`p-3 ${className}`}>
            <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                        id="title"
                        name="title"
                        value={data.title}
                        onChange={handleInputChange}
                        placeholder="Brief description of the issue"
                        required
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={handleInputChange}
                        placeholder="Please provide a detailed description of the issue..."
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                        id="category"
                        name="category"
                        value={data.category}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        required
                    >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(category => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Priority */}
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <select
                        id="priority"
                        name="priority"
                        value={data.priority}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                        {PRIORITIES.map(priority => (
                            <option key={priority.value} value={priority.value}>
                                {priority.label}
                            </option>
                        ))}
                    </select>
                </div>
                </div>

                {/* Department */}
                {/* <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                        id="department"
                        name="department"
                        value={data.department}
                        onChange={handleInputChange}
                        placeholder="Relevant department (if known)"
                    />
                </div> */}

                {/* Tags */}
                <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                        id="tags"
                        name="tags"
                        value={data.tags.join(', ')}
                        onChange={handleTagsChange}
                        placeholder="Enter tags separated by commas"
                    />
                    <p className="text-xs text-muted-foreground">
                        Add relevant tags to help categorize your complaint (e.g., urgent, safety, infrastructure)
                    </p>
                </div>
            </div>
        </Card>
    );
}