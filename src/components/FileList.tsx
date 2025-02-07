interface FileListProps {
    files: File[]
    onFileUpload: (files: File[]) => void
    onFileRemove: (index: number) => void
}

interface FileWithPath extends File {
    path?: string;
    webkitRelativePath: string;
}

export default function FileList({ files, onFileUpload, onFileRemove }: FileListProps) {
    const getFilePath = (file: FileWithPath) => {
        // 尝试获取完整路径
        if (file.path) {
            return file.path;
        }

        // 如果有相对路径，使用相对路径
        if (file.webkitRelativePath) {
            return file.webkitRelativePath;
        }

        // 回退到文件名
        return file.name;
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const droppedFiles = Array.from(e.dataTransfer.files)
        const validFiles = droppedFiles.filter(
            file => file.name.endsWith('.java') || file.name.endsWith('.kt')
        ) as FileWithPath[]

        // 对于拖拽的文件，尝试获取文件路径
        validFiles.forEach(file => {
            try {
                // 尝试从拖拽项中获取文件路径
                const item = Array.from(e.dataTransfer.items).find(
                    item => item.kind === 'file' && item.getAsFile()?.name === file.name
                );

                if (item) {
                    const entry = (item as any).webkitGetAsEntry?.();
                    if (entry?.fullPath) {
                        file.path = entry.fullPath;
                    }
                }
            } catch (error) {
                console.warn('Failed to get file path:', error);
            }
        });

        handleNewFiles(validFiles)
    }

    const handleNewFiles = (newFiles: FileWithPath[]) => {
        const updatedFiles = [...files]
        newFiles.forEach(newFile => {
            const existingIndex = files.findIndex(f => f.name === newFile.name)
            if (existingIndex !== -1) {
                updatedFiles[existingIndex] = newFile
            } else {
                updatedFiles.push(newFile)
            }
        })
        onFileUpload(updatedFiles)
    }

    return (
        <div
            className="h-full p-4 overflow-auto"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <div className="mb-4">
                <input
                    type="file"
                    accept=".java,.kt"
                    multiple
                    onChange={(e) => {
                        if (e.target.files) {
                            const validFiles = Array.from(e.target.files).filter(
                                file => file.name.endsWith('.java') || file.name.endsWith('.kt')
                            ) as FileWithPath[]
                            handleNewFiles(validFiles)
                        }
                    }}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>
            {files.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                    <p>拖拽 Java/Kotlin 文件到此处，或点击上方按钮选择文件</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {files.map((file, index) => (
                        <li key={index} className="flex items-center p-2 bg-gray-50 rounded group hover:bg-gray-100">
                            <div className="flex-1 min-w-0">
                                <div className="text-gray-600 truncate">{file.name}</div>
                                <div className="text-xs text-gray-400 truncate" title={getFilePath(file as FileWithPath)}>
                                    {getFilePath(file as FileWithPath)}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <span className="text-xs text-gray-400">
                                    {file.name.endsWith('.java') ? 'Java' : 'Kotlin'}
                                </span>
                                <button
                                    onClick={() => onFileRemove(index)}
                                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="移除文件"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
} 