import {
  IconBellRinging,
  IconChartBar,
  IconLayoutDashboard,
  IconSettings,
  IconUsersGroup,
  IconUser
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/DashboardLayout/components/dashboard",
  },

  {
    id: uniqueId(),
    title: "Notification",
    icon: IconBellRinging,
    href: "/DashboardLayout/Notification-Page",
  },
  {
    id: uniqueId(),
    title: "About Us",
    icon: IconUsersGroup,
    href: "/DashboardLayout/AboutUs-Page",
  },

  {
    id: uniqueId(),
    title: "Data Analysis",
    icon: IconChartBar,
    href: "/DashboardLayout/DataAnalysis-Page",
  },
  {
    id: uniqueId(),
    title: "Setting",
    icon: IconSettings,
    href: "/DashboardLayout/setting-page",
  },
];

export default Menuitems;
