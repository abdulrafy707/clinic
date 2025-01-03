export default function Form({ fields, onSubmit }) {
    return (
      <form
        onSubmit={onSubmit}
        className="space-y-4"
      >
        {fields.map((field, idx) => (
          <div key={idx}>
            <label className="block">{field.label}</label>
            <input
              type={field.type || 'text'}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              className="w-full px-3 py-2 border rounded"
              required={field.required}
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </form>
    );
  }
  