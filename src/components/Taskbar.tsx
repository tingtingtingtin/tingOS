import { FaHome } from "react-icons/fa"
import Link from "next/link"

const Taskbar = () => {
  return (
      <nav className="fixed bottom-0 left-0 right-0 h-15 bg-gray-900/80 backdrop-blur-md border-t border-white/10 flex items-center px-4">
        <div className='mx-auto items-center min-w-1/4'>
          <Link href="/"><FaHome size={20}/></Link>
        </div>
      </nav>
  )
}

export default Taskbar