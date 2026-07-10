'use client'

interface Props {
  postTitle: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

export default function DeleteConfirm({ postTitle, onConfirm, onCancel, isDeleting }: Props) {
  return (
    <div className="border border-red-900/50 bg-red-950/20 px-4 py-3 flex items-center gap-4">
      <span className="font-mono text-xs text-red-400 flex-1 truncate">
        CONFIRM DELETE: <span className="text-white">{postTitle}</span>
      </span>
      <button
        onClick={onConfirm}
        disabled={isDeleting}
        className="shrink-0 px-3 py-1 border border-red-600 text-red-400 font-mono text-xs hover:bg-red-900/30 transition-all duration-200 disabled:opacity-50"
      >
        {isDeleting ? 'DELETING...' : 'CONFIRM'}
      </button>
      <button
        onClick={onCancel}
        className="shrink-0 px-3 py-1 border border-[var(--tactical-green-dark)] text-gray-400 font-mono text-xs hover:border-[var(--night-vision)] hover:text-white transition-all duration-200"
      >
        CANCEL
      </button>
    </div>
  )
}
