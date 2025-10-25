import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
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
} from "@fortawesome/free-solid-svg-icons";
import SignOutButton from "@/components/sign-out-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import UserFooter from "./UserFooter";

type NavItem = {
    name: string;
    icon: IconDefinition;
    path?: string;
};

const navItems: NavItem[] = [
    {
        icon: faDatabase,
        name: "Items",
        path: '/items',
    },
    {
        icon: faBoxArchive,
        name: "Locations",
        path: "/location",
    },
    {
        icon: faFolder,
        name: "Categories",
        path: "/category",
    },
    {
        name: "Scanner",
        icon: faBarcode,
        path: "/scanner",
    }
];

export async function AppSidebar() {
    const session = await getServerSession(authOptions);

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/items">
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
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.path}>
                                            <FontAwesomeIcon icon={item.icon} />
                                            <span>{item.name}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
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
