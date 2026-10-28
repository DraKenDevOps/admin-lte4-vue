import user1 from "@/assets/adminlte/img/user1-128x128.jpg";
import user2 from "@/assets/adminlte/img/user2-160x160.jpg";
import user3 from "@/assets/adminlte/img/user3-128x128.jpg";
import type { LineChartDataset } from "@/types/charts";
import type { AdminVariant } from "@/types/ui";

export interface DashboardStat {
  label: string;
  value: string;
  suffix?: string;
  variant: AdminVariant;
  icon: string;
  to: string;
}

export const dashboardStats: DashboardStat[] = [
  {
    label: "New Orders",
    value: "150",
    variant: "primary",
    icon: "bi bi-cart-fill",
    to: "/widgets/info-box"
  },
  {
    label: "Bounce Rate",
    value: "53",
    suffix: "%",
    variant: "success",
    icon: "bi bi-bar-chart-fill",
    to: "/widgets/info-box"
  },
  {
    label: "User Registrations",
    value: "44",
    variant: "warning",
    icon: "bi bi-people-fill",
    to: "/widgets/info-box"
  },
  {
    label: "Unique Visitors",
    value: "65",
    variant: "danger",
    icon: "bi bi-pie-chart-fill",
    to: "/widgets/info-box"
  }
];

export const revenueChart: { labels: string[]; datasets: LineChartDataset[] } = {
  labels: ["Jan '23", "Feb '23", "Mar '23", "Apr '23", "May '23", "Jun '23", "Jul '23"],
  datasets: [
    { label: "Digital Goods", data: [28, 48, 40, 19, 86, 27, 90], color: "#0d6efd", fill: true },
    { label: "Electronics", data: [65, 59, 80, 81, 56, 55, 40], color: "#20c997", fill: true }
  ]
};

export interface ChatMessage {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  outgoing?: boolean;
}

export const directChatMessages: ChatMessage[] = [
  {
    id: 1,
    author: "Alexander Pierce",
    avatar: user1,
    time: "23 Jan 2:00 pm",
    text: "Is this template really for free? That's unbelievable!"
  },
  {
    id: 2,
    author: "Sarah Bullock",
    avatar: user3,
    time: "23 Jan 2:05 pm",
    text: "You better believe it!",
    outgoing: true
  },
  {
    id: 3,
    author: "Alexander Pierce",
    avatar: user2,
    time: "23 Jan 5:37 pm",
    text: "Working on the new dashboard theme. Should be ready for review tomorrow."
  }
];

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  status: "Pending" | "Shipped" | "Delivered";
  total: string;
}

export const recentOrders: RecentOrder[] = [
  { id: "#1832", customer: "Sarah Bullock", product: "Wireless Headset", status: "Delivered", total: "$129.00" },
  { id: "#1833", customer: "Brad Diesel", product: "Mechanical Keyboard", status: "Shipped", total: "$89.00" },
  { id: "#1834", customer: "Nora Silvester", product: "USB-C Dock", status: "Pending", total: "$149.00" }
];

export const orderStatusVariant: Record<RecentOrder["status"], AdminVariant> = {
  Pending: "warning",
  Shipped: "info",
  Delivered: "success"
};
