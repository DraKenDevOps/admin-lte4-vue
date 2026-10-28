import user1 from "@/assets/adminlte/img/user1-128x128.jpg";
import user2 from "@/assets/adminlte/img/user2-160x160.jpg";
import user3 from "@/assets/adminlte/img/user3-128x128.jpg";
import user8 from "@/assets/adminlte/img/user8-128x128.jpg";

export interface HeaderMessage {
  id: number;
  author: string;
  avatar: string;
  preview: string;
  time: string;
  starClass: string;
}

export interface HeaderNotification {
  id: number;
  icon: string;
  text: string;
  time: string;
}

export const headerMessages: HeaderMessage[] = [
  {
    id: 1,
    author: "Brad Diesel",
    avatar: user1,
    preview: "Call me whenever you can...",
    time: "4 Hours Ago",
    starClass: "text-danger"
  },
  {
    id: 2,
    author: "John Pierce",
    avatar: user8,
    preview: "I got your message bro",
    time: "4 Hours Ago",
    starClass: "text-secondary"
  },
  {
    id: 3,
    author: "Nora Silvester",
    avatar: user3,
    preview: "The subject goes here",
    time: "4 Hours Ago",
    starClass: "text-warning"
  }
];

export const headerNotifications: HeaderNotification[] = [
  { id: 1, icon: "bi bi-envelope", text: "4 new messages", time: "3 mins" },
  { id: 2, icon: "bi bi-people-fill", text: "8 friend requests", time: "12 hours" },
  { id: 3, icon: "bi bi-file-earmark-fill", text: "3 new reports", time: "2 days" }
];

export const currentUser = {
  name: "Alexander Pierce",
  role: "Web Developer",
  memberSince: "Nov. 2023",
  avatar: user2,
  followers: 128,
  sales: 64,
  friends: 32
};
