'use client'

import { useState } from 'react'
import TabBar from '@/components/TabBar'
import FileList from '@/components/FileList'
import CodeEditor from '@/components/CodeEditor'
import DiagramView from '@/components/DiagramView'

interface ParseResult {
    classDef: string;
    relationships: string[];
}

export default function Home() {
    const [activeTab, setActiveTab] = useState('files')
    const [files, setFiles] = useState<File[]>([])
    const [mermaidCode, setMermaidCode] = useState('')
    const [autoSync, setAutoSync] = useState(false)

    const handleFileUpload = (newFiles: File[]) => {
        setFiles(newFiles)
        if (autoSync && newFiles.length > 0) {
            handleSync()
        }
    }

    const handleFileRemove = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        if (autoSync && newFiles.length > 0) {
            handleSync()
        }
    }

    const handleAutoSyncChange = (enabled: boolean) => {
        setAutoSync(enabled)
        if (enabled && files.length > 0) {
            handleSync()
        }
    }

    const parseJavaFile = async (file: File): Promise<ParseResult> => {
        const content = await file.text()
        const lines = content.split('\n')
        let className = ''
        let isClass = false
        let isInterface = false
        let fields: string[] = []
        let methods: string[] = []
        let extends_class = ''
        let implements_interfaces: string[] = []

        for (const line of lines) {
            const trimmedLine = line.trim()

            // 检查类定义
            if (trimmedLine.includes('class ')) {
                isClass = true
                const classMatch = trimmedLine.match(/class\s+(\w+)/)
                if (classMatch) className = classMatch[1]

                // 检查继承
                const extendsMatch = trimmedLine.match(/extends\s+(\w+)/)
                if (extendsMatch) extends_class = extendsMatch[1]

                // 检查实现接口
                const implementsMatch = trimmedLine.match(/implements\s+([\w,\s]+)/)
                if (implementsMatch) {
                    implements_interfaces = implementsMatch[1].split(',').map(i => i.trim())
                }
            }

            // 检查接口定义
            if (trimmedLine.includes('interface ')) {
                isInterface = true
                const interfaceMatch = trimmedLine.match(/interface\s+(\w+)/)
                if (interfaceMatch) className = interfaceMatch[1]
            }

            // 检查字段
            if (trimmedLine.match(/private|public|protected/) && !trimmedLine.includes('(')) {
                const fieldMatch = trimmedLine.match(/(private|public|protected)\s+(\w+)\s+(\w+)/)
                if (fieldMatch) {
                    const visibility = fieldMatch[1] === 'private' ? '-' : '+'
                    const type = fieldMatch[2]
                    const name = fieldMatch[3]
                    fields.push(`${visibility}${name}: ${type}`)
                }
            }

            // 检查方法
            if (trimmedLine.match(/private|public|protected/) && trimmedLine.includes('(')) {
                const methodMatch = trimmedLine.match(/(private|public|protected)\s+(\w+)\s+(\w+)\s*\(([^)]*)\)/)
                if (methodMatch) {
                    const visibility = methodMatch[1] === 'private' ? '-' : '+'
                    const returnType = methodMatch[2]
                    const name = methodMatch[3]
                    const params = methodMatch[4] || ''
                    methods.push(`${visibility}${name}(${params}) ${returnType}`)
                }
            }
        }

        let classDef = `class ${className}`
        if (fields.length > 0 || methods.length > 0) {
            classDef += ' {\n'
            fields.forEach(field => {
                classDef += `    ${field}\n`
            })
            methods.forEach(method => {
                classDef += `    ${method}\n`
            })
            classDef += '}'
        }

        const relationships: string[] = []
        if (extends_class) {
            relationships.push(`${className} --|> ${extends_class}`)
        }
        implements_interfaces.forEach(interface_name => {
            relationships.push(`${className} ..|> ${interface_name}`)
        })

        return { classDef, relationships }
    }

    const handleSync = async () => {
        try {
            let classDefs: string[] = []
            let relationships: string[] = []

            // 解析所有文件
            for (const file of files) {
                if (file.name.endsWith('.java') || file.name.endsWith('.kt')) {
                    const result = await parseJavaFile(file)
                    classDefs.push(result.classDef)
                    relationships.push(...result.relationships)
                }
            }

            // 生成完整的 Mermaid 代码
            const mermaidCode = `classDiagram\n${classDefs.join('\n')}\n${relationships.join('\n')}`
            setMermaidCode(mermaidCode)
            setActiveTab('code')
        } catch (error) {
            console.error('Error parsing files:', error)
        }
    }

    return (
        <main className="flex h-screen">
            <div className="w-1/2 border-r">
                <TabBar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onSync={handleSync}
                    autoSync={autoSync}
                    onAutoSyncChange={handleAutoSyncChange}
                />
                {activeTab === 'files' ? (
                    <FileList
                        files={files}
                        onFileUpload={handleFileUpload}
                        onFileRemove={handleFileRemove}
                    />
                ) : (
                    <CodeEditor code={mermaidCode} />
                )}
            </div>
            <div className="w-1/2">
                <DiagramView code={mermaidCode} />
            </div>
        </main>
    )
} 