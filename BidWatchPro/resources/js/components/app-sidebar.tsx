import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, FileText, Calendar, Megaphone, Users } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, contracts, calendar, announcer, engineers } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { url } = usePage();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
            icon: LayoutGrid,
            isActive: url === dashboard().url,
        },
        {
            title: 'Contracts',
            href: contracts().url,
            icon: FileText,
            isActive: url === contracts().url,
        },
        {
            title: 'Calendar',
            href: calendar().url,
            icon: Calendar,
            isActive: url === calendar().url,
        },
        {
            title: 'Announcer',
            href: announcer().url,
            icon: Megaphone,
            isActive: url === announcer().url,
        },
        {
            title: 'Engineers',
            href: engineers().url,
            icon: Users,
            isActive: url === engineers().url,
        },
    ];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
