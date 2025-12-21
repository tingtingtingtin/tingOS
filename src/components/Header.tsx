"use client";

import Link from "next/link";
import { useOSStore } from "@/store/osStore";
import { X } from "lucide-react";

interface HeaderProps {
  id: string;
  title: string;
}

const Header = ({id, title} : HeaderProps) => {
  const { closeApp } = useOSStore();
  return (
    <header className="bg-gray-200 dark:bg-gray-800 p-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 px-2">
          {title}
        </div>
        <Link 
          href="/" 
          className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors text-gray-500"
          title="Close App (Return to Desktop)"
          onClick={() => closeApp(id)}
        >
          <X size={18} />
        </Link>
      </header>
  )
}

export default Header