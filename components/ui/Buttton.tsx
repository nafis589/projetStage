
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  icon?: React.ComponentType<{ size: number }>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // <-- Added type prop
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  icon: Icon,
  disabled,
  type = "button", // <-- Default to 'button'
}) => {
  const baseClasses =
    "px-6 py-3 rounded-2xl shadow-md font-medium transition-all duration-200 flex items-center gap-2";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-50 text-gray-800 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type} // <-- Forward type prop
      className={`${baseClasses} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className || ""}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};