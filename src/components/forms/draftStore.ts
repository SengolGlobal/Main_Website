/**
 * In-memory hand-over of unsent form entries across a language switch.
 *
 * Switching language is a client-side navigation, so module state survives while
 * the page re-renders in the new language. Nothing is written to browser storage,
 * and the draft is discarded as soon as the form reads it back.
 */
type Draft = Record<string, string | boolean>;

const collectors = new Map<string, () => Draft>();
const pending = new Map<string, Draft>();

export function registerDraftCollector(formId: string, collect: () => Draft) {
  collectors.set(formId, collect);
  return () => {
    if (collectors.get(formId) === collect) collectors.delete(formId);
  };
}

/** Called by the language selector right before navigating. */
export function stashDrafts() {
  for (const [id, collect] of collectors) pending.set(id, collect());
}

export function takeDraft(formId: string): Draft | undefined {
  const draft = pending.get(formId);
  pending.delete(formId);
  return draft;
}
