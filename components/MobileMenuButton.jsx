import { Menu, X } from "lucide-react";

const MobileMenuButton = ({ isOpen, toggleMenu }) => (
  <button onClick={toggleMenu} className="z-50 text-blue-500">
    {isOpen ? <X size={32} /> : <Menu size={32} />}
  </button>
);

export default MobileMenuButton;
