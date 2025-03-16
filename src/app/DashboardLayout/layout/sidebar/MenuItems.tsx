import {
  IconChartBar,
  IconLayoutDashboard,
  IconPaw,
  IconSettings,
  IconUser,
  IconUsersGroup,
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
    title: "System Owner",
    icon: IconUser,
    href: "/DashboardLayout/SystemOwner-Page",
  },

  {
    id: uniqueId(),
    title: "Data Analysis",
    icon: IconChartBar,
    href: "/DashboardLayout/DataAnalysis-Page",
  },

  {
    id: uniqueId(),
    title: "Animal Cateory",
    icon: IconPaw,
    href: "/DashboardLayout/AnimalCategory-Page",
  },
  {
    id: uniqueId(),
    title: "Setting",
    icon: IconSettings,
    href: "/DashboardLayout/setting-page",
  },
  {
    id: uniqueId(),
    title: "About Us",
    icon: IconUsersGroup,
    href: "/DashboardLayout/AboutUs-Page",
  },
];

export default Menuitems;
