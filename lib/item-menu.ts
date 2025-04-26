import {
  // HistoryIcon,
  Sparkles,
  // UserCircle,
  // GiftIcon,
  LayoutDashboard,
  Coins,
  LogOut,
} from "lucide-react";

export const ITEMMENU = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Meus Resumos",
    href: "/summaries",
    icon: Sparkles,
  },
  {
    label: "Comprar Créditos",
    href: "/pricing",
    icon: Coins,
  },
  // {
  //   label: "Histórico",
  //   href: "/dashboard/historico",
  //   icon: HistoryIcon,
  // },
  // {
  //   label: "Indique um Amigo",
  //   href: "/referral-bonus",
  //   icon: GiftIcon,
  // },
  // {
  //   label: "Minha Conta",
  //   href: "/app",
  //   icon: UserCircle,
  // },
  {
    label: "Sair",
    href: "/logout",
    icon: LogOut,
  },
];
