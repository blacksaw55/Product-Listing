/** A titled group of controls. `fieldset` + `legend` tell screen readers which filter a control belongs to. */
export function FilterSection({ title, children }) {
  return (
    <fieldset className="border-b border-slate-200 py-4 last:border-b-0">
      <legend className="mb-2 font-semibold text-slate-800">{title}</legend>
      {children}
    </fieldset>
  )
}
