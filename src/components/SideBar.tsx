import {useState, type FC, type JSX } from 'react';

type Page = 'home' | 'register' | 'about' | 'tutorials' | 'stock' | 'profile';

const MenuIcon: FC = () => (
  <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
</svg>

);

const ShoppingIcon: FC = () => (
  <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"/>
  </svg>

);

const UserIcon: FC = () => (
  <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
  </svg>

);

const TutoIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
    <path d="M160-80q-17 0-28.5-11.5T120-120v-574q0-12.33 8-24.5t19.33-16.83L534.67-880q18.66-6.67 35.66-.17 17 6.5 17 28.17v116.67H636q17 0 28.5 11.5t11.5 28.5v152h-66.67v-125.34H186.67v522h257L510.33-80H160Zm178-655.33h182.67v-68l-182.67 68Zm345.33 652q-83 0-139.83-56.84Q486.67-197 486.67-280q0-83 56.83-139.83 56.83-56.84 139.83-56.84 83 0 139.84 56.84Q880-363 880-280q0 83-56.83 139.83-56.84 56.84-139.84 56.84Zm-54.66-101.34L777.33-280l-148.66-95.33v190.66Zm-442 38v-522 522Z"/>
  </svg>
);

const StockIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
    <path d="M360-600v-80h360v80H360Zm0 120v-80h360v80H360Zm120 320H200h280Zm0 80H240q-50 0-85-35t-35-85v-120h120v-560h600v361q-20-2-40.5 1.5T760-505v-295H320v480h240l-80 80H200v40q0 17 11.5 28.5T240-160h240v80Zm80 0v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm300-263-37-37 37 37ZM620-140h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/>
    </svg>
);

// Define types for the SidebarIcon props
interface SidebarIconProps {
  icon: JSX.Element;
  tooltip: string;
  isActive?: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}


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
          ? "bg-black text-white shadow-lg"
          : "text-white hover:bg-black hover:text-gray-100"
      } ${isExpanded ? "w-full px-4 justify-start" : "w-12 justify-center"}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon}
        {isExpanded && (
          <span className="ml-4 text-white text-sm font-medium">{tooltip}</span>
        )}
      </div>
      {!isExpanded && (
        <span className="absolute left-14 bg-gray-800/80 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
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
    { id: "home", icon: <ShoppingIcon />, tooltip: "Home" },
    { id: "profile", icon: <UserIcon />, tooltip: "Minha Conta" },
    { id: "tutorials", icon: <TutoIcon />, tooltip: "Tutoriais" },
    { id: "stock", icon: <StockIcon />, tooltip: "Estoque" },
  ];

  const handleMenuClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (itemId: string) => {
    // Mapeia os IDs dos itens para as páginas
    const pageMap: { [key: string]: Page } = {
      'home': 'home',
      'profile': 'profile', 
      'tutorials': 'tutorials',
      'stock': 'stock',
    };
    
    if (pageMap[itemId]) {
      onNavigate(pageMap[itemId]);
    }
  };

  return (
    <div className="flex min-h-screen fixed left-0 top-0 z-40">
      <div
        className={`flex flex-col transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64 bg-gray-800/70" : "w-16 bg-gray-800/70"
        }`}
      >
        <div className="flex flex-col items-center mt-6">
          {menuItems.map((item) => (
            <SidebarIcon
              key={item.id}
              icon={item.icon}
              tooltip={item.tooltip}
              isActive={currentPage === item.id}
              isExpanded={isExpanded}
              onClick={
                item.id === "menu" 
                  ? handleMenuClick 
                  : () => handleItemClick(item.id)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;