interface CodeEditorProps {
    code: string
}

export default function CodeEditor({ code }: CodeEditorProps) {
    return (
        <div className="h-full">
            <textarea
                value={code}
                readOnly
                className="w-full h-full p-4 font-mono text-sm bg-gray-50"
            />
        </div>
    )
} 