import { NavLink } from "@remix-run/react";

export default function AppNav() {
  return (
    <div className="absolute top-0 left-0 z-10 h-full pt-12 w-60 border-r border-gray-800">
      <nav className="p-4 text-sm text-gray-300">
        <NavLink to="/quotes" className={({ isActive }) =>
          `px-2 py-1 mb-1 block rounded-md ${
            isActive ? "bg-red-600 text-white" : "hover:bg-gray-800 hover:text-white"
          }`
        }>Quotes</NavLink>
        <NavLink to="/deliveries" className={({ isActive }) =>
          `px-2 py-1 mb-1 block rounded-md ${
            isActive ? "bg-red-600 text-white" : "hover:bg-gray-800 hover:text-white"
          }`
        }>Deliveries</NavLink>
        <NavLink to="/products" className={({ isActive }) =>
          `px-2 py-1 mb-1 block rounded-md ${
            isActive ? "bg-red-600 text-white" : "hover:bg-gray-800 hover:text-white"
          }`
        }>Products</NavLink>
      </nav>
    </div>
  );
}
