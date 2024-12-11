import { useSearchParams } from '@remix-run/react';
import React, { useState } from 'react';

export default function PerPageDropdown() {
  // State to manage dropdown visibility
  const [isOpen, setIsOpen] = useState(false);
  const perPageOptions = [30, 50, 100];
  const [searchParams, setSearchParams] = useSearchParams();
  const perPage = searchParams.get('per_page') || '30';

  // Change a query parameter
  const updateQuery = (perPage: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('per_page', perPage);
    setSearchParams(newParams);
  };

  // Toggle open state
  const toggleDropdown = () => setIsOpen(!isOpen);

  // close dropdown when clicking outside
  const handleOutsideClick = (event: MouseEvent) => {
    if (event.target && !(event.target as Element).closest('#per-page-dropdown')) {
      setIsOpen(false);
    }
  };

  const perPageChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const perPage = event.currentTarget.textContent;
    if (perPage) {
      updateQuery(perPage.toString());
    }
    setIsOpen(false);
  }

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', handleOutsideClick);
    } else {
      window.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div id="per-page-dropdown" className="relative inline-block">
      <button onClick={toggleDropdown} type="button" className="text-xs text-gray-300 bg-gray-700 rounded px-2 inline-block h-6 leading-6">
        {perPage}
        <span className="relative inline-block ml-1 border-t-4 border-t-gray-500 group-hover:border-t-gray-300 w-2 border-r-4 border-r-transparent border-l-4 border-l-transparent -top-[.1rem]"></span>
      </button>
      <div id="dropdownMenu"
        className={`${isOpen ? 'block' : 'hidden'} origin-top-right absolute left-0 mt-1 w-24 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 text-xs`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="dropdownButton">
        <ul className="py-1" role="none">
          {perPageOptions.map((option) => (
            <li key={option} role="menuitem">
              <button className={`${perPage == option.toString() ? 'bg-gray-700' : 'hover:bg-gray-700'} text-gray-300 px-2 py-1 block w-full text-left`} type="button" onClick={perPageChange}>{option}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}