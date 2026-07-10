'use client'

export interface PendingFile {
  file: File
  tempId: string
}

interface Props {
  pendingFiles: PendingFile[]
  onPendingFilesChange: (files: PendingFile[]) => void
}

export default function AttachmentUploader({ pendingFiles, onPendingFilesChange }: Props) {
  const addFiles = (fileList: FileList) => {
    const newFiles: PendingFile[] = Array.from(fileList).map(file => ({
      file,
      tempId: crypto.randomUUID(),
    }))
    onPendingFilesChange([...pendingFiles, ...newFiles])
  }

  const removePending = (tempId: string) => {
    onPendingFilesChange(pendingFiles.filter(f => f.tempId !== tempId))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-center gap-3 px-4 py-6 border-2 border-dashed border-[var(--tactical-green)] hover:border-[var(--night-vision)] cursor-pointer transition-all duration-300 bg-black/40">
        <span className="text-white font-mono text-sm tracking-wider">+ ADD ATTACHMENTS</span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {pendingFiles.length > 0 && (
        <div className="space-y-2">
          <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">PENDING UPLOAD</span>
          {pendingFiles.map(({ file, tempId }) => (
            <div key={tempId} className="flex items-center justify-between px-3 py-2 border border-[var(--tactical-green)] bg-black/40">
              <span className="font-mono text-xs text-white truncate">{file.name}</span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs text-white/60">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removePending(tempId)}
                  className="text-red-400 font-mono text-xs hover:text-red-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
