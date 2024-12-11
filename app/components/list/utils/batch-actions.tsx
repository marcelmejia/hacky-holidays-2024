export default function BatchActions() {
  return (
    <div>
      <select className="text-sm text-gray-300 bg-gray-700 rounded px-2 inline-block h-8 leading-8 mr-2">
        <option value="">Batch Actions</option>
        <option value="delete">Delete</option>
      </select>
      <button type="submit" className="bg-red-600 text-white h-8 text-sm px-3 rounded">Go</button>
    </div>
  )
}
