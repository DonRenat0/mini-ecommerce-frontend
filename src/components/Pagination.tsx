interface PaginationProps {
  currentPage: number // 0-indexada, igual que Spring Data
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-500">
        Página {currentPage + 1} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>
  )
}
