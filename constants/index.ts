import { 
    Airplay, 
    AlignHorizontalDistributeCenter, 
    BarChart3, 
    BarChartHorizontal, 
    Blocks, 
    Cog, 
    FileCog, 
    FileSpreadsheet, 
    LayoutDashboard, 
    LayoutPanelTop, 
    Mail, 
    PlusSquare, 
    ScissorsLineDashed,
    Send,
    ServerCog,
    Settings,
    Sliders,
    UserRoundCog,
    UserRoundPlus
} from "lucide-react";

export const SIDEBAR_ROUTES = [
    {
        categoryName: null,
        routes: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard
            }
        ]
    },
    {
        categoryName: null,
        routes: [
            {
                label: "Add Production Line",
                href: "/production-lines/create-new",
                icon: AlignHorizontalDistributeCenter
            }
        ]
    },
    {
        categoryName: "ELIoT Devices",
        routes: [
            {
                label: "Add",
                href: "/eliot-devices/create-new",
                icon: Airplay
            },
            {
                label: "Manage",
                href: "/eliot-devices",
                icon: Blocks
            },
        ]
    },
    {
        categoryName: "Sewing Machines",
        routes: [
            {
                label: "Add",
                href: "/sewing-machines/create-new",
                icon: Cog
            },
            {
                label: "Manage",
                href: "/sewing-machines",
                icon: Blocks
            },
        ]
    },
    {
        categoryName: "Sewing Operators",
        routes: [
            {
                label: "Add",
                href: "/sewing-operators/create-new",
                icon: ScissorsLineDashed
            },
            {
                label: "Manage",
                href: "/sewing-operators",
                icon: Blocks
            },
        ]
    },
    {
        categoryName: "Factory Staff",
        routes: [
            {
                label: "Add",
                href: "/factory-staffs/create-new",
                icon: UserRoundPlus
            },
            {
                label: "Manage",
                href: "/factory-staffs",
                icon: UserRoundCog
            },
        ]
    },
    {
        categoryName: "Portal Account Users",
        routes: [
            {
                label: "Add",
                href: "/portal-accounts/create-new",
                icon: UserRoundPlus
            },
            {
                label: "Manage",
                href: "/portal-accounts",
                icon: UserRoundCog
            },
        ]
    },
    {
        categoryName: "Production Lines & Operations",
        routes: [
            {
                label: "Manage Operations",
                href: "/operations",
                icon: Settings
            },
            {
                label: "Manage Production Lines",
                href: "/production-lines",
                icon: ServerCog
            },
        ]
    },
    {
        categoryName: "Operation BreakDown & Balancing Sheet",
        routes: [
            {
                label: "Create OBB Sheet",
                href: "/obb-sheets/create-new",
                icon: FileSpreadsheet
            },
            {
                label: "Manage OBB Sheet",
                href: "/obb-sheets",
                icon: FileCog
            },
        ]
    },
    {
        categoryName: "SMS & Email Alerts",
        routes: [
            {
                label: "Alert logs",
                href: "/alert-logs",
                icon: Send
            },
        ]
    },
    {
        categoryName: "Production Efficiency Analytics",
        routes: [
            {
                label: "Production Efficiency (60min)",
                href: "/analytics/production-efficiency-60",
                icon: BarChartHorizontal
            },
            {
                label: "Production Efficiency (15min)",
                href: "/analytics/production-efficiency-15",
                icon: BarChartHorizontal
            },
        ]
    },
    {
        categoryName: "Operator Efficiency Analytics",
        routes: [
            {
                label: "Operator Efficiency (60min)",
                href: "/analytics/operator-efficiency-60",
                icon: BarChartHorizontal
            },
            {
                label: "Operator Efficiency (15min)",
                href: "/analytics/operator-efficiency-15",
                icon: BarChartHorizontal
            },
        ]
    },
    {
        categoryName: "Traffic Light System Analytics",
        routes: [
            {
                label: "TLS of Productions",
                href: "/analytics/tls-productions",
                icon: BarChartHorizontal
            },
            {
                label: "TLS of Operators",
                href: "/analytics/tls-operators",
                icon: BarChartHorizontal
            },
        ]
    },
];

export const HEADER_INFO = [
    {
        label: "Dashboard",
        href: '/dashboard',
        icon: LayoutPanelTop
    },
    {
        label: "Add Production Lines",
        href: "/production-lines/create-new",
        icon: AlignHorizontalDistributeCenter
    },
    {
        label: "Add ELIoT Devices",
        href: "/eliot-devices/create-new",
        icon: PlusSquare
    },
    {
        label: "Manage ELIoT Devices",
        href: "/eliot-devices",
        icon: Settings
    },
    {
        label: "Add Sewing Machines",
        href: "/sewing-machines/create-new",
        icon: PlusSquare
    },
    {
        label: "Manage Sewing Machines",
        href: "/sewing-machines",
        icon: Settings
    },
    {
        label: "Add Sewing Operators",
        href: "/sewing-operators/create-new",
        icon: UserRoundPlus
    },
    {
        label: "Manage Sewing Operators",
        href: "/sewing-operators",
        icon: UserRoundCog
    },
    {
        label: "Add Factory Staff",
        href: "/factory-staffs/create-new",
        icon: UserRoundPlus
    },
    {
        label: "Manage Factory Staff",
        href: "/factory-staffs",
        icon: UserRoundCog
    },
    {
        label: "Add Portal Account User",
        href: "/portal-accounts/create-new",
        icon: UserRoundPlus
    },
    {
        label: "Manage Portal Account Users",
        href: "/portal-accounts",
        icon: UserRoundCog
    },
    {
        label: "Manage Operations",
        href: "/operations",
        icon: Settings
    },
    {
        label: "Manage Production Lines",
        href: "/production-lines",
        icon: ServerCog
    },
    {
        label: "SMS & Email Alert Logs",
        href: "/alert-logs", 
        icon: Mail
    },
    {
        label: "Create OBB Sheet",
        href: "/obb-sheets/create-new", 
        icon: FileSpreadsheet
    },
    {
        label: "Manage OBB Sheet",
        href: "/obb-sheets", 
        icon: FileCog
    },
    {
        label: "Operator Analytic chart",
        href: "/analytics/operator-efficiency-60", 
        icon: BarChartHorizontal
    },
    {
        label: "Operator Analytic chart",
        href: "/analytics/operator-efficiency-15", 
        icon: BarChartHorizontal
    },
    {
        label: "Production Analytic charts",
        href: "/analytics/production-efficiency-60", 
        icon: BarChartHorizontal
    },
    {
        label: "Production Analytic charts",
        href: "/analytics/production-efficiency-15", 
        icon: BarChartHorizontal
    },
    {
        label: "Analytic charts for TLS",
        href: "/analytics/tls-productions", 
        icon: Sliders
    },
    {
        label: "Analytic charts for TLS",
        href: "/analytics/tls-operators", 
        icon: Sliders
    },
]