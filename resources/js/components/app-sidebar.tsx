import { IconDashboard, IconDatabase, IconFileWord, IconInnerShadowTop, IconReport } from '@tabler/icons-react';
import * as React from 'react';

import { NavDocuments } from '@/components/nav-documents';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';

const data = {
    documents: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: IconDashboard,
        },
        {
            name: 'Blogs',
            url: '/blogs',
            icon: IconReport,
        },
        
       
    ],
};

type InertiaProps = {
    auth: {
        user: {
            name: string;
            email: string;
            avatar?: string;
            // Add more fields if needed
        };
    };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { props: inertiaProps } = usePage<InertiaProps>();
    const user = inertiaProps.auth?.user;
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <a href="#">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Technobd Ltd.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavDocuments items={data.documents} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={{
                        ...user,
                        avatar: user.avatar ?? '/avatars/default.jpg',
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
