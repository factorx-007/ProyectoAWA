"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wrench,
  List, 
  AlertCircle, 
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { 
    name: "Dashboard", 
    href: "/admin/dashboard", 
    icon: LayoutDashboard,
    color: "text-blue-400"
  },
  { 
    name: "Usuarios", 
    href: "/admin/users", 
    icon: Users,
    color: "text-purple-400"
  },
  { 
    name: "Productos", 
    href: "/admin/products", 
    icon: Package,
    color: "text-green-400"
  },
  { 
    name: "Servicios", 
    href: "/admin/services", 
    icon: Wrench,
    color: "text-yellow-400"
  },
  { 
    name: "Categorías", 
    href: "/admin/categories", 
    icon: List,
    color: "text-pink-400"
  },
  { 
    name: "Reportes", 
    href: "/admin/reports", 
    icon: AlertCircle,
    color: "text-red-400"
  },
  { 
    name: "Estadísticas", 
    href: "/admin/statistics", 
    icon: BarChart2,
    color: "text-cyan-400"
  },
  { 
    name: "Configuración", 
    href: "/admin/settings", 
    icon: Settings,
    color: "text-gray-400"
  }
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarVariants = {
    open: { 
      width: isMobile ? '100%' : '16rem',
      x: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    closed: { 
      width: isMobile ? '0' : '5rem',
      x: isMobile ? '-100%' : 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        onHoverStart={() => !isMobile && !isOpen && setIsHovered(true)}
        onHoverEnd={() => !isMobile && !isOpen && setIsHovered(false)}
        className={`fixed top-0 left-0 h-screen bg-gray-900/90 backdrop-blur-lg border-r border-gray-700/50 z-30 overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
            <AnimatePresence>
              {(isOpen || (!isMobile && isHovered)) && (
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap"
                >
                  Admin Pro
                </motion.h1>
              )}
            </AnimatePresence>
            
            <button
              onClick={onToggle}
              className="p-1.5 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center p-3 rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white" 
                            : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                        )}
                      >
                        <div className={cn("flex-shrink-0", item.color)}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <AnimatePresence>
                          {(isOpen || (!isMobile && isHovered)) && (
                            <motion.span 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="ml-3 text-sm font-medium whitespace-nowrap"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {isActive && (
                          <motion.span 
                            layoutId="activeNavItem"
                            className="absolute right-3 w-1.5 h-6 bg-blue-400 rounded-full"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-700/50">
            <button
              className={cn(
                "w-full flex items-center p-2 rounded-lg text-red-400 hover:bg-red-900/30",
                "transition-colors group"
              )}
            >
              <div className="p-1.5 rounded-lg bg-red-900/30 group-hover:bg-red-900/50 transition-colors">
                <LogOut className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {(isOpen || (!isMobile && isHovered)) && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3 text-sm font-medium"
                  >
                    Cerrar sesión
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
