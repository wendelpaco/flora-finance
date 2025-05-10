import {
  HiOutlineChartBar,
  HiOutlineSwitchHorizontal,
  HiOutlineTag,
  HiOutlineFlag,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi";

export const ITEMMENU = [
  {
    label: "Visão Geral",
    href: "/painel/visao-geral",
    icon: HiOutlineChartBar,
  },
  {
    label: "Transações",
    href: "/painel/transacoes",
    icon: HiOutlineSwitchHorizontal,
  },
  {
    label: "Categorias",
    href: "/painel/categorias",
    icon: HiOutlineTag,
  },
  {
    label: "Metas",
    href: "/painel/metas",
    icon: HiOutlineFlag,
  },
  {
    label: "Alertas",
    href: "/painel/alertas",
    icon: HiOutlineBell,
  },
  {
    label: "Configurações",
    href: "/painel/configuracoes",
    icon: HiOutlineCog,
  },
  {
    label: "Sair",
    href: "/logout",
    icon: HiOutlineLogout,
  },
];
