import { useSearchParams } from '@remix-run/react';
import React, { useState } from 'react';

type Props = {
  sortOptions: Array<string>;
  sortDefault: string;
}

export default function SortDropdown({sortOptions, sortDefault}: Props) {
  // State to manage dropdown visibility
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const orderBy = searchParams.get('order_by') || sortDefault;

  // Change a query parameter
  const updateQuery = (orderBy: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('order_by', orderBy);
    setSearchParams(newParams);
  };

  // Toggle open state
  const toggleDropdown = () => setIsOpen(!isOpen);

  // close dropdown when clicking outside
  const handleOutsideClick = (event: MouseEvent) => {
    if (event.target && !(event.target as Element).closest('#sort-dropdown')) {
      setIsOpen(false);
    }
  };

  const orderByChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const orderBy = event.currentTarget.textContent;
    if (orderBy) {
      updateQuery(orderBy.toString());
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
    <div id="sort-dropdown" className="relative inline-block ml-2">
      <button onClick={toggleDropdown} type="button" className="text-xs text-gray-300 bg-gray-700 rounded px-2 inline-block h-6 leading-6">
        {orderBy}
        <span className="relative inline-block ml-1 border-t-4 border-t-gray-500 group-hover:border-t-gray-300 w-2 border-r-4 border-r-transparent border-l-4 border-l-transparent -top-[.1rem]"></span>
      </button>
      <div id="dropdownMenu"
        className={`${isOpen ? 'block' : 'hidden'} origin-top-right absolute left-0 mt-1 w-32 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 text-xs`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="dropdownButton">
        <ul className="py-1" role="none">
          {sortOptions.map((option) => (
            <li key={option} role="menuitem">
              <button className={`${orderBy == option.toString() ? 'bg-gray-700' : 'hover:bg-gray-700'} text-gray-300 px-2 py-1 block w-full text-left`} type="button" onClick={orderByChange}>{option}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}