
import { Disclosure } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="p-4 ">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold cursor-pointer">KMK Scholars</Link>

        <Disclosure as="div" className="sm:hidden">
          {({ open }) => (
            <>
              <Disclosure.Button className="sm:hidden">
                {open ? <X size={35} /> : <Menu size={35}/>}
              </Disclosure.Button>

              <Disclosure.Panel className="absolute top-20 left-0 w-full bg-white shadow-md p-4 flex flex-col gap-4">
                <Link to="/" className="cursor-pointer">ScholarshipInfo</Link>
                <Link to="/" className="cursor-pointer">About Us</Link>

                <Link to="/apply-now" className="text-yellow-600 cursor-pointer">Apply Now</Link>
<Link to="/blog" className="cursor-pointer ">Blog</Link>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <ul className="hidden sm:flex gap-7">
          <Link to="/" className="cursor-pointer font-bold">ScholarshipInfo</Link>
          <Link to="/" className="cursor-pointer font-bold">About Us</Link>
          <Link to="/blog" className="cursor-pointer font-bold">Blog</Link>
          <Link to="/apply-now" className="text-yellow-600 font-bold cursor-pointer  ">Apply Now</Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;