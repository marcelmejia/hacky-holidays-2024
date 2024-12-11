export default function ListActions() {
  return (
    <div>
      <button type="button" className="text-sm text-gray-300 border border-gray-700 rounded px-3 inline-block h-8 leading-6 float-right ml-2">
        Export
        <span className="inline-block relative ml-2 border-t-4 border-t-gray-500 group-hover:border-t-gray-300 w-2 border-r-4 border-r-transparent border-l-4 border-l-transparent -top-[.125rem]"></span>
      </button>
      <button type="button" className="text-sm text-gray-300 border border-gray-700 rounded px-3 inline-block h-8 leading-6 float-right ml-2">
        Add
        <span className="inline-block relative ml-2 border-t-4 border-t-gray-500 group-hover:border-t-gray-300 w-2 border-r-4 border-r-transparent border-l-4 border-l-transparent -top-[.125rem]"></span>
      </button>
      <button type="button" className="text-sm text-gray-300 border border-gray-700 rounded px-3 inline-block h-8 leading-6 float-right ml-2">
        Filter
        <span className="inline-block relative ml-2 border-t-4 border-t-gray-500 group-hover:border-t-gray-300 w-2 border-r-4 border-r-transparent border-l-4 border-l-transparent -top-[.125rem]"></span>
      </button>
    </div>
  )
}
