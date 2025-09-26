import React from 'react';
import { Card } from "@/components/ui/card";
import EmployeeManagement from './EmployeeManagement';
import {
  LayoutGrid,
  Users,
  Building2,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <Button
    variant="ghost"
    className={cn(
      "w-full justify-start gap-2",
      active && "bg-accent"
    )}
    onClick={onClick}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Button>
);

function MunicipalAdmin() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const sidebarItems = [
    { icon: LayoutGrid, label: "Dashboard", id: "dashboard" },
    { icon: Users, label: "Employees", id: "employees" },
    { icon: Building2, label: "Departments", id: "departments" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform duration-200 ease-in-out",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Menu />
            </Button>
          </div>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-margin duration-200 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4">
          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4"
            >
              <Menu />
            </Button>
          )}
          <h1 className="text-xl font-semibold">
            {sidebarItems.find((item) => item.id === activeTab)?.label}
          </h1>
        </div>

        {/* Content Area */}
        <main className="p-6">
          {activeTab === "dashboard" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Employees
                </h3>
                <p className="mt-2 text-2xl font-bold">150</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Departments
                </h3>
                <p className="mt-2 text-2xl font-bold">8</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Active Issues
                </h3>
                <p className="mt-2 text-2xl font-bold">24</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Resolution Rate
                </h3>
                <p className="mt-2 text-2xl font-bold">92%</p>
              </Card>
            </div>
          )}
          {activeTab === "employees" && (
            <EmployeeManagement />
          )}
        </main>
      </div>
    </div>
  );
}

export default MunicipalAdmin;   