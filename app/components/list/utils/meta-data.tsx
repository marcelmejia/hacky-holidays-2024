type Props = {
  page: number;
  perPage: number;
  total: number;
}

export default function MetaData({page, perPage, total}: Props) {
  const resultsStart = page == 1 ? 1 : (page - 1) * perPage + 1;
  const resultsEnd = page * perPage > total ? total : page * perPage;
  return (
    <div>
      Displaying {resultsStart} - {resultsEnd} of {total}
    </div>
  )
}
