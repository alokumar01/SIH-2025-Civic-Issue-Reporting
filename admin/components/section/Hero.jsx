"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, Users, ArrowRight, Sparkles, Shield, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Header Section */}
        <div className="text-center py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-6">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border-emerald-200">
                <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
                Trusted by 10,000+ Citizens
              </Badge>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
              Report Civic Issues,{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Drive Real Change
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
              Empower your community by reporting problems like potholes, broken
              streetlights, or waste management issues — directly to your local government 
              for swift resolution and transparent tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-200">
                <a href="/auth" className="flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-all duration-200">
                <a href="#features" className="flex items-center gap-2">
                  Learn More
                  <Eye className="w-5 h-5" />
                </a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Government Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div id="features" className="pb-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="px-4 py-2 mb-6 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 border-emerald-200">
                Why Choose Our Platform
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Effective Civic Engagement
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive platform provides all the tools you need to report issues,
                track progress, and make a real impact in your community.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Quick Reporting Card */}
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    Quick Reporting
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Report issues instantly with photo evidence and location tracking for faster resolution. 
                    Our streamlined process makes it easy to document and submit concerns.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">Photo Upload</Badge>
                    <Badge variant="outline" className="text-xs">GPS Tracking</Badge>
                    <Badge variant="outline" className="text-xs">Quick Submit</Badge>
                  </div>
                  <Button variant="ghost" className="w-full group/btn justify-between hover:bg-emerald-50">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Real-time Tracking Card */}
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    Real-time Tracking
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Monitor the status of your complaints and get updates on resolution progress.
                    Stay informed every step of the way with detailed status updates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">Live Updates</Badge>
                    <Badge variant="outline" className="text-xs">SMS Alerts</Badge>
                    <Badge variant="outline" className="text-xs">Progress Timeline</Badge>
                  </div>
                  <Button variant="ghost" className="w-full group/btn justify-between hover:bg-blue-50">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Community Impact Card */}
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    Community Impact
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Join thousands of citizens making their communities better, one report at a time.
                    See the collective impact of civic engagement in your area.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">Public Dashboard</Badge>
                    <Badge variant="outline" className="text-xs">Impact Metrics</Badge>
                    <Badge variant="outline" className="text-xs">Community Stats</Badge>
                  </div>
                  <Button variant="ghost" className="w-full group/btn justify-between hover:bg-purple-50">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action Section */}
            <div className="text-center mt-20">
              <Card className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-blue-600 border-0 text-white">
                <CardContent className="p-12">
                  <h3 className="text-3xl font-bold mb-4">
                    Ready to Make a Difference?
                  </h3>
                  <p className="text-xl mb-8 text-emerald-50">
                    Join our platform today and start reporting issues that matter to your community.
                    Together, we can build better cities and towns.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="px-8 py-4 font-semibold">
                      <a href="/auth" className="flex items-center gap-2">
                        Start Reporting Now
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" className="px-8 py-4 font-semibold border-white text-white hover:bg-white hover:text-emerald-700">
                      View Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
