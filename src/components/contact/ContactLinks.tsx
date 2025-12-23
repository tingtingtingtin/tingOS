import { Mail, Phone } from "lucide-react";
import { LiaLinkedin } from "react-icons/lia";

const ContactLinks = () => (
  <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
    <h3 className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">
      Direct Contact
    </h3>
    <div className="flex md:flex-row flex-col md:gap-4 gap-2">
      <a
        href="mailto:twu062604@gmail.com?subject=Inquiry&body=Message%20details"
        className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-700">
          <Mail size={14} />
        </div>
        Email
      </a>
      <a
        href="https://linkedin.com/in/tingxuanwu"
        target="_blank"
        className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-700">
          <LiaLinkedin size={20} />
        </div>
        LinkedIn
      </a>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-700">
          <Phone size={14} />
        </div>
        +1 (818) 660-6388
      </div>
    </div>
  </div>
);

export default ContactLinks;
