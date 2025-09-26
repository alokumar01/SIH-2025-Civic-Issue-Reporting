'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUserStore } from '@/store/userStore'
import {
    Home,
    Settings,
    LogOut,
    LogIn,
    UserPlus,
    Layout,
    Users,
    Building2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar'
import Logo from './Logo'

export function MainSidebar() {
    const pathname = usePathname()
    const { user, isAuthenticated, logout, hasRole } = useUserStore()

    const navigationItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            requireAuth: true,
        },
        {
            title: 'Municipal',
            href: '/municipal',
            icon: Building2,
            requireAuth: true,
            roles: ['admin', 'municipal_admin'],
        },
        {
            title: 'Profile',
            href: '/profile',
            icon: Users,
            requireAuth: true,
        },
        {
            title: 'Settings',
            href: '/settings',
            icon: Settings,
            requireAuth: true,
        },
    ]

    const authItems = !isAuthenticated
        ? [
            {
                title: 'Login',
                href: '/auth',
                icon: LogIn,
            },
            {
                title: 'Sign Up',
                href: '/auth?signup=true',
                icon: UserPlus,
            },
        ]
        : [
            {
                title: 'Logout',
                onClick: logout,
                icon: LogOut,
            },
        ]

    const filteredNavItems = navigationItems.filter((item) => {
        if (!item.requireAuth) return true
        if (!isAuthenticated) return false
        if (item.roles && !hasRole(item.roles)) return false
        return true
    })

    return (
        <>
            <Sidebar variant="default" collapsible="icon">
                <div className="relative">
                    <SidebarTrigger className="absolute right-[-12px] top-1/2 -translate-y-1/2 flex items-center justify-center bg-background border rounded-r shadow-sm h-8 w-6 hover:bg-accent transition-colors duration-200">
                        <ChevronLeft className="w-4 h-4 group-data-[state=collapsed]:rotate-180 transition-transform duration-200" />
                    </SidebarTrigger>
                    <SidebarHeader className="border-b p-4">
                        <div className="flex items-center gap-2">
                            <Logo width='40' height='40' />
                            <div className="group-data-[state=collapsed]:hidden transition-opacity duration-200">
                                <h1 className="font-semibold">Sahyogi Admin</h1>
                            </div>
                        </div>
                    </SidebarHeader>
                </div>

                <SidebarContent>
                    {/* Main Navigation */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {filteredNavItems.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.href}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    {/* Auth Actions */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Account</SidebarGroupLabel>
                        <SidebarGroupContent>
                            {user && (
                                <SidebarMenuButton className="p-2 mb-2" tooltip={user.email}>
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="relative w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                            {user?.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.email}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium">
                                                    {user.email?.[0]?.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="group-data-[collapsible=icon]:hidden">
                                            <p className="font-medium text-sm truncate">{user.email}</p>
                                            <p className="text-xs text-muted-foreground">{user.role}</p>
                                        </div>
                                    </div>
                                </SidebarMenuButton>
                            )}
                            <SidebarMenu>
                                {authItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild={!!item.href}
                                            tooltip={item.title}
                                            onClick={item.onClick}
                                        >
                                            {item.href ? (
                                                <Link href={item.href}>
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            ) : (
                                                <>
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </>
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarFooter>
            </Sidebar>
        </>
    )
}