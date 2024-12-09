import { useSearchParams } from '@remix-run/react';

type Props = {
  page: number;
}

export default function Pager({page}: Props) {
  // State to manage dropdown visibility
  const [searchParams, setSearchParams] = useSearchParams();
  //const page = searchParams.get('page') || '1';

  // Change a query parameter
  const updateQuery = (page: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    setSearchParams(newParams);
  };

  const pageChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const page = event.currentTarget.value;
    if (page) {
      updateQuery(page.toString());
    }
  }

  const pageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const page = event.currentTarget.value;
    if (page) {
      updateQuery(page.toString());
    }
  }

  const prevPage = Number(page) > 1 ? Number(page) - 1 : page;
  const nextPage = Number(page) + 1;

  return (
    <div id="pager" className="float-right">
      <button onClick={pageChange} type="button" className="text-xs text-gray-300 bg-gray-700 rounded px-2 inline-block h-6 leading-6" value={prevPage.toString()}>
        <span className="inline-block mr-1 border-r-4 border-r-gray-500 group-hover:border-r-gray-300 w-2 border-t-4 border-t-transparent border-b-4 border-b-transparent"></span>
      </button>
      <input type="number" step="1" min="1" value={page} onChange={pageInputChange} className="text-gray-300 bg-gray-700 rounded pl-2 w-12 h-6 leading-6 mx-2" />
      <button onClick={pageChange} type="button" className="text-xs text-gray-300 bg-gray-700 rounded px-2 inline-block h-6 leading-6" value={nextPage}>
        <span className="inline-block ml-1 border-l-4 border-l-gray-500 group-hover:border-l-gray-300 w-2 border-t-4 border-t-transparent border-b-4 border-b-transparent"></span>
      </button>
    </div>
  );
}