import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Home, 
  Settings, 
  Users, 
  Wrench, 
  Clock,
  FileText,
  DollarSign,
  Download,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigationItems = [
  { icon: Home, label: "Companies", path: "/", isActive: true },
  { icon: Users, label: "Employees", path: "/employees" },
  { icon: Settings, label: "Admin" },
  { icon: Wrench, label: "System setup" },
  { icon: FileText, label: "Tools" },
  { icon: DollarSign, label: "Loans" },
  { icon: Clock, label: "Timekeeping" },
  { icon: FileText, label: "Payslips" },
  { icon: FileText, label: "Reports" },
  { icon: FileText, label: "Financial reports" },
  { icon: Download, label: "Export to SARS" },
  { icon: Clock, label: "Attendance" },
  { icon: Settings, label: "Help" },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location, navigate] = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          data-testid="sidebar-backdrop"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static top-0 left-0 z-50 h-screen w-40
          bg-gradient-to-b from-gray-900 to-gray-800
          text-white dark:text-white transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        data-testid="sidebar"
      >
        <nav className="flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 py-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = item.path === location;
              
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    }
                    console.log(`Navigation to ${item.label} triggered`);
                  }}
                  className={`
                    w-full px-2 py-1 text-left text-xs font-normal
                    border-b border-white/5 transition-all duration-200
                    hover:bg-[#384080] hover:pl-3
                    ${isActive ? 'bg-[#465193] font-medium' : ''}
                  `}
                  data-testid={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3 w-3" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="p-3">
            <Button
              size="sm"
              className="w-full text-xs bg-[#465193] text-white hover:bg-[#384080]"
              onClick={() => console.log('Sign out triggered')}
              data-testid="button-sign-out"
            >
              <LogOut className="h-3 w-3 mr-1" />
              Sign Out
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
}