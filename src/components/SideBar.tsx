import { useState, type FC, type JSX } from "react";

interface SidebarIconProps {
  icon: JSX.Element;
  tooltip: string;
  isActive?: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

type Page = "home" | "register" | "about" | "tutorials" | "stock" | "profile";

const MenuIcon: FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => (
  <svg
    className={className}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke={color}
      strokeLinecap="round"
      strokeWidth="2"
      d="M5 7h14M5 12h14M5 17h14"
    />
  </svg>
);

const ShoppingIcon: FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// AccountIcon Component
const UserIcon: FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 21C20 19.1435 19.2625 17.363 17.9497 16.0503C16.637 14.7375 14.8565 14 13 14H11C9.14348 14 7.36301 14.7375 6.05025 16.0503C4.7375 17.363 4 19.1435 4 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// TutorialsIcon Component
const TutoIcon: FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => (
  <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      <path
        fill={color}
        d="M9 7v8l7-4zm12-4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 14H3V5h18z"
      ></path>
    </svg>
);

// StockIcon Component
const StockIcon: FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12H15C15.5523 12 16 11.5523 16 11V8C16 7.44772 15.5523 7 15 7H12C11.4477 7 11 7.44772 11 8V11C11 11.5523 11.4477 12 12 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 3H15V5H9V3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Main Sidebar Component
const SidebarIcon: FC<SidebarIconProps> = ({
  icon,
  tooltip,
  isActive = false,
  isExpanded,
  onClick,
}) => {
  return (
    <div
  className={`relative flex items-center h-12 mt-2 mb-2 mx-auto rounded-lg transition-all duration-300 ease-linear cursor-pointer group ${
    isActive
      ? "bg-black text-icon shadow-lg"
      : "text-back hover:bg-black hover:text-icon" // hover:text-icon aqui no container
  } ${isExpanded ? "w-full px-4 justify-start" : "w-12 justify-center"}`}
  onClick={onClick}
>
  <div className="flex items-center">
    {icon}
    {isExpanded && (
      <span
        className={`ml-4 text-sm font-medium ${
          isActive ? "text-icon" : "group-hover:text-icon"
        }`}
      >
        {tooltip}
      </span>
    )}
  </div>
  {!isExpanded && (
    <span className="absolute left-14 text-black text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
      {tooltip}
    </span>
  )}
</div>
  );
};

// Props para o Sidebar principal
interface SidebarProps {
  onNavigate: (page: Page) => void;
  currentPage: string;
}

// Main Sidebar Component atualizado
const Sidebar: FC<SidebarProps> = ({ onNavigate, currentPage }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const menuItems = [
    { id: "menu", icon: <MenuIcon />, tooltip: "Menu" },
    { id: "store", icon: <ShoppingIcon />, tooltip: "store" },
    { id: "profile", icon: <UserIcon />, tooltip: "Minha Conta" },
    { id: "tutorials", icon: <TutoIcon />, tooltip: "Tutoriais" },
    { id: "stock", icon: <StockIcon />, tooltip: "Estoque" },
  ];

  const handleStoreClick = () => {
    window.open("https://www.assai.com.br/", "_blank");
  };

  const handleMenuClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (itemId: string) => {
    // Mapeia os IDs dos itens para as páginas
    const pageMap: { [key: string]: Page } = {
      profile: "profile",
      tutorials: "tutorials",
      stock: "stock",
    };

    if (pageMap[itemId]) {
      onNavigate(pageMap[itemId]);
    }
  };

  return (
    <div className="flex min-h-screen fixed left-0 top-0 z-40">
      <div
        className={`flex flex-col transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64 " : "w-16"
        }`}
      >
        <div className="flex flex-col items-center mt-50">
          {menuItems.map((item) => (
            <SidebarIcon
              key={item.id}
              icon={item.icon}
              tooltip={item.tooltip}
              isActive={currentPage === item.id}
              isExpanded={isExpanded}
              onClick={() => {
                if (item.id === "menu") {
                  handleMenuClick();
                } else if (item.id === "store") {
                  handleStoreClick();
                } else {
                  handleItemClick(item.id);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
