interface TabBarProps {
    activeTab: string
    onTabChange: (tab: string) => void
    onSync: () => void
    autoSync: boolean
    onAutoSyncChange: (enabled: boolean) => void
}

export default function TabBar({ activeTab, onTabChange, onSync, autoSync, onAutoSyncChange }: TabBarProps) {
    return (
        <div className="flex items-center border-b p-2 bg-gray-100">
            <h1 className="font-bold mr-8">Code2Mermaid</h1>
            <button
                className={`px-4 py-2 mr-2 rounded ${activeTab === 'files' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => onTabChange('files')}
            >
                文件列表
            </button>
            <button
                className={`px-4 py-2 mr-2 rounded ${activeTab === 'code' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => onTabChange('code')}
            >
                Code
            </button>
            <div className="flex items-center ml-auto">
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={autoSync}
                            onChange={(e) => onAutoSyncChange(e.target.checked)}
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${autoSync ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform bg-white transform ${autoSync ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">自动同步</span>
                </label>
                <button
                    className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    onClick={onSync}
                    disabled={autoSync}>同步</button>
            </div>
        </div>
    )
} 