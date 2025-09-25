"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { getCurrentLocation, reverseGeocode } from '@/lib/location';

export default function LocationForm({ location, onChange, className }) {
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({
            ...location,
            [name]: value
        });
    };

    const detectLocation = async () => {
        setIsLoadingLocation(true);
        setError('');
        
        try {
            const position = await getCurrentLocation();
            const { longitude, latitude } = position;
            
            // Update coordinates
            onChange({
                ...location,
                coordinates: [longitude, latitude]
            });

            // Get address details using reverse geocoding
            const addressDetails = await reverseGeocode(longitude, latitude);
            
            // Update location details
            onChange({
                ...location,
                ...addressDetails
            });
        } catch (error) {
            console.error('Error detecting location:', error);
            setError('Failed to detect location. Please try again or enter manually.');
        } finally {
            setIsLoadingLocation(false);
        }
    };

    return (
        <Card className={`p-6 ${className}`}>
            <div className="space-y-4">
                {/* Location Detection Button */}
                <div className="flex flex-col gap-2">
                    <Button 
                        onClick={detectLocation} 
                        disabled={isLoadingLocation}
                        className="w-full md:w-auto"
                    >
                        {isLoadingLocation ? "Detecting Location..." : "📍 Detect My Location"}
                    </Button>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                {/* Coordinates Display */}
                {location.coordinates?.length === 2 && (
                    <div className="p-2 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                            Coordinates: {location.coordinates[1]}°N, {location.coordinates[0]}°E
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PIN Code - Given priority with full width */}
                    <div className="md:col-span-2">
                        <Label htmlFor="pinCode">PIN Code *</Label>
                        <Input
                            id="pinCode"
                            name="pinCode"
                            value={location.pinCode || ''}
                            onChange={handleInputChange}
                            placeholder="Enter 6-digit PIN code"
                            maxLength={6}
                            pattern="[0-9]{6}"
                            required
                            className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter a valid 6-digit PIN code to help us locate your area precisely
                        </p>
                    </div>

                    {/* State */}
                    <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                            id="state"
                            name="state"
                            value={location.state || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* District */}
                    <div>
                        <Label htmlFor="district">District *</Label>
                        <Input
                            id="district"
                            name="district"
                            value={location.district || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Locality */}
                    <div>
                        <Label htmlFor="locality">Locality *</Label>
                        <Input
                            id="locality"
                            name="locality"
                            value={location.locality || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Landmark */}
                    <div>
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                            id="landmark"
                            name="landmark"
                            value={location.landmark || ''}
                            onChange={handleInputChange}
                            placeholder="Any nearby notable place"
                        />
                    </div>
                </div>

                {/* Full Address */}
                <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                        id="address"
                        name="address"
                        value={location.address || ''}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Detailed address for exact location"
                    />
                </div>
            </div>
        </Card>
    );
}