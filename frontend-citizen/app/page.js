import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { NavbarDemo } from "@/components/Navbar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            {/* <header className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-sm">CI</span>
                                </div>
                                <h1 className="text-xl font-semibold text-foreground">
                                    Civic Issue Portal
                                </h1>
                            </div>
                        </div>
                        <nav className="flex items-center space-x-4">
                            <Link href="/profile">
                                <Button variant="ghost" size="sm">
                                    Profile
                                </Button>
                            </Link>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="" alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </nav>
                    </div>
                </div>
            </header> */}

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <Badge variant="secondary" className="mb-4">
                        Community Powered
                    </Badge>
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Report & Track Civic Issues
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Help improve your community by reporting civic issues and tracking their resolution status.
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                    {/* Raise Complaint Card */}
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl">Raise a Complaint</CardTitle>
                            <CardDescription className="text-base">
                                Report new civic issues in your area such as road damage, water supply problems, or public concerns.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href="/complaint/new" className="w-full">
                                <Button size="lg" className="w-full">
                                    File New Complaint
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Track Complaint Card */}
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl">Track Your Complaints</CardTitle>
                            <CardDescription className="text-base">
                                Monitor the progress of your submitted complaints and view updates from the concerned authorities.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href="/complaint" className="w-full">
                                <Button variant="outline" size="lg" className="w-full">
                                    View My Complaints
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>

                {/* Stats Section */}
                <Card className="max-w-4xl mx-auto">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl mb-2">Community Impact</CardTitle>
                        <CardDescription>
                            See how our platform is making a difference
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">1,247</div>
                                <div className="text-sm text-muted-foreground">Issues Reported</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">892</div>
                                <div className="text-sm text-muted-foreground">Issues Resolved</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">355</div>
                                <div className="text-sm text-muted-foreground">In Progress</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-semibold text-foreground mb-6">Recent Activities</h3>
                    <div className="grid gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start space-x-4">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Resolved
                                    </Badge>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">
                                            Pothole on Main Street has been fixed
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Reported 3 days ago • Ward 12
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start space-x-4">
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                        In Progress
                                    </Badge>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">
                                            Street light repair on Park Avenue
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Reported 1 week ago • Ward 8
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-card mt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Separator className="mb-8" />
                    <div className="text-center text-muted-foreground">
                        <p>&copy; 2025 Civic Issue Portal. Making communities better, one report at a time.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
