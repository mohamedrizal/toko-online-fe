function DataTable({
  columns = [],
  data = [],
  keyField = 'id',
  emptyText = 'Data tidak tersedia.',
}) {
  if (!data.length) {
    return <p className="muted-text">{emptyText}</p>
  }

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row[keyField] ?? rowIndex}>
              {columns.map((column) => (
                <td key={`${column.header}-${row[keyField] ?? rowIndex}`}>
                  {column.render
                    ? column.render(row, data, rowIndex)
                    : column.accessor
                      ? row[column.accessor]
                      : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable