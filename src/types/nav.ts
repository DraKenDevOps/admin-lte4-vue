export interface NavItem {
  /** Visible label. */
  label: string;
  /** Router path for leaf entries. Parents with children omit it. */
  to?: string;
  /** Bootstrap Icons class list, e.g. `bi bi-speedometer`. */
  icon?: string;
  /** Optional badge text shown on the right of the link. */
  badge?: string;
  /** Nested entries. Presence turns the item into a treeview toggle. */
  children?: NavItem[];
}
