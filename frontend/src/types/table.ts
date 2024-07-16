export interface TableColumn {
  key: string
  label: string
  sortable: boolean
  type?: 'text' | 'image' | 'date' | 'boolean'
}
