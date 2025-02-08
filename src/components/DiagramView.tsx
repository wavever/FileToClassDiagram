'use client'

import mermaid from 'mermaid'
import { useEffect, useRef } from 'react'

interface DiagramViewProps {
    code: string
}

export default function DiagramView({ code }: DiagramViewProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // 初始化 mermaid 配置
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'monospace'
        })

        const renderDiagram = async () => {
            if (containerRef.current && code) {
                try {
                    // 清空容器
                    containerRef.current.innerHTML = ''

                    // 生成唯一的图表 ID
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

                    // 使用 mermaid API 渲染图表
                    const { svg } = await mermaid.render(id, code)

                    // 插入生成的 SVG
                    containerRef.current.innerHTML = svg

                    // 确保 SVG 能够自适应容器大小
                    const svgElement = containerRef.current.querySelector('svg')
                    if (svgElement) {
                        svgElement.style.width = '100%'
                        svgElement.style.height = '100%'
                        svgElement.style.maxWidth = '100%'
                        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
                    }
                } catch (error: any) {
                    console.error('Error rendering diagram:', error)
                    if (containerRef.current) {
                        containerRef.current.innerHTML = `<div class="text-red-500">Error rendering diagram: ${error.message}</div>`
                    }
                }
            }
        }

        renderDiagram()
    }, [code])

    return (
        <div
            ref={containerRef}
            className="h-full p-4 flex items-center justify-center bg-white"
        >
            {!code && <p className="text-gray-400">等待生成类图...</p>}
        </div>
    )
} 