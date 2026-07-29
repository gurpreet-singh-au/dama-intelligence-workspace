const ruleTypes = [
  {
    title: "Occupation Rule",
    description: "Region, occupation, ANZSCO or title match, source, snapshot and primary citation."
  },
  {
    title: "Visa Availability Rule",
    description: "Subclass 482, 186 or 494 availability recorded independently from occupation availability."
  },
  {
    title: "Concession Rule",
    description: "Salary, English, age or skills concession recorded only when a cited structured rule supports it."
  }
];

const reviewChecks = [
  "Approved review status",
  "Approved production source",
  "Source snapshot",
  "Primary citation",
  "Same-workspace citation chain",
  "No superseded date",
  "No unresolved conflict or review reason"
];

export function RuleEntryFoundation() {
  return (
    <div className="rule-workflow">
      <section className="rule-panel" aria-labelledby="rule-entry-heading">
        <div>
          <div className="eyebrow">Structured rule entry</div>
          <h2 id="rule-entry-heading">Internal rule foundations</h2>
          <p>
            These controls define the manual workflow shape only. They do not seed real DAMA facts, infer availability or
            approve production legal records.
          </p>
        </div>
        <div className="rule-type-grid">
          {ruleTypes.map((ruleType) => (
            <article className="rule-type" key={ruleType.title}>
              <h3>{ruleType.title}</h3>
              <p>{ruleType.description}</p>
              <label>
                Review status
                <select defaultValue="draft">
                  <option value="draft">draft</option>
                  <option value="needs_review">needs_review</option>
                  <option value="reviewed">reviewed</option>
                </select>
              </label>
              <label>
                Primary citation
                <select defaultValue="">
                  <option value="">Select approved citation</option>
                </select>
              </label>
            </article>
          ))}
        </div>
      </section>
      <section className="rule-panel" aria-labelledby="comparison-safety-heading">
        <div>
          <div className="eyebrow">Comparison gate</div>
          <h2 id="comparison-safety-heading">Required before output</h2>
        </div>
        <ul className="checklist">
          {reviewChecks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
