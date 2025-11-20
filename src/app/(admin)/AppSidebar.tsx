import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxArchive,
    faBarcode,
    faFolder,
    faDatabase,
    IconDefinition,
    faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import SignOutButton from "@/components/sign-out-button";
import { getServerSession } from "next-auth";
import { authOptions, requireAdminRole } from "@/auth";
import UserFooter from "./UserFooter";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type NavItem = {
    name: string;
    icon: IconDefinition;
    path?: string;
    add?: string;
    requireAdminRole: boolean;
};

const navItems: NavItem[] = [
    {
        icon: faDatabase,
        name: "Items",
        path: '/item',
        add: '/item/new',
        requireAdminRole: false,
    },
    {
        icon: faBoxArchive,
        name: "Locations",
        path: "/location",
        add: "/location/new",
        requireAdminRole: false,
    },
    {
        icon: faFolder,
        name: "Categories",
        path: "/category",
        add: "/category/new",
        requireAdminRole: false,
    },
    {
        name: "Scanner",
        icon: faBarcode,
        path: "/scanner",
        requireAdminRole: true,
    }
];

export async function AppSidebar() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const hasAdminRole = session?.user?.role === 'ADMIN';

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-large">
                                        Inventory
                                    </span>
                                    <span className="">v{process.env.version}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                (!item.requireAdminRole || hasAdminRole) && (
                                    <SidebarMenuItem key={item.name} className="flex items-center gap-2">
                                        <SidebarMenuButton asChild>
                                            <a href={item.path}>
                                                <FontAwesomeIcon icon={item.icon} />
                                                <span>{item.name}</span>
                                            </a>
                                        </SidebarMenuButton>
                                        {hasAdminRole && item.add && (
                                            <SidebarMenuAction showOnHover={true} asChild>
                                                <Link href={item.add} >
                                                    <FontAwesomeIcon icon={faPlusCircle} />
                                                </Link>
                                            </SidebarMenuAction>
                                        )}
                                    </SidebarMenuItem>
                                )
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <UserFooter user={session?.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
