export default function Table({ headers, data }) {
    return (
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((row, idx) => (
            <tr key={idx} className="border-b">
              {Object.values(row).map((cell, id) => (
                <td key={id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  