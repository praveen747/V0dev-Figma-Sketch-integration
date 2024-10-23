"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, FileCode, Eye } from 'lucide-react'

// Mock function to simulate Figma API integration
const mockFigmaImport = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        components: [
          { id: '1', name: 'Header', type: 'FRAME' },
          { id: '2', name: 'Card', type: 'COMPONENT' },
          { id: '3', name: 'Button', type: 'COMPONENT' },
        ]
      })
    }, 1500)
  })
}

// Mock function to simulate generative AI component creation
const mockGenerateComponent = (prompt: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`
// Generated component based on prompt: "${prompt}"
export function GeneratedComponent() {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Generated Component</h2>
      <p>This is a placeholder for the generated component based on your prompt.</p>
    </div>
  )
}
      `)
    }, 2000)
  })
}

export default function DesignSystemPlayground() {
  const [figmaComponents, setFigmaComponents] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [generatedCode, setGeneratedCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [previewMode, setPreviewMode] = useState('code')

  const handleFigmaImport = async () => {
    setIsLoading(true)
    try {
      const result = await mockFigmaImport()
      setFigmaComponents(result.components)
    } catch (error) {
      console.error('Error importing from Figma:', error)
    }
    setIsLoading(false)
  }

  const handleComponentSelect = (component) => {
    setSelectedComponent(component)
    setGeneratedCode(`// React component for ${component.name}\nexport function ${component.name}() {\n  return (\n    <div>${component.name} Component</div>\n  )\n}`)
  }

  const handleGenerateComponent = async () => {
    setIsLoading(true)
    try {
      const result = await mockGenerateComponent(prompt)
      setGeneratedCode(result)
    } catch (error) {
      console.error('Error generating component:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // Simulating real-time preview update
    const previewElement = document.getElementById('live-preview')
    if (previewElement && previewMode === 'preview') {
      previewElement.innerHTML = generatedCode
    }
  }, [generatedCode, previewMode])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Design System Playground</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Figma Integration</CardTitle>
            <CardDescription>Import components from Figma</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFigmaImport} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCode className="mr-2 h-4 w-4" />}
              Import from Figma
            </Button>
            {figmaComponents.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Imported Components</h3>
                <ul>
                  {figmaComponents.map((component) => (
                    <li key={component.id} className="mb-2">
                      <Button variant="outline" onClick={() => handleComponentSelect(component)}>
                        {component.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generative Custom Components</CardTitle>
            <CardDescription>Generate components using natural language</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe the component you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleGenerateComponent} disabled={isLoading || !prompt}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Component'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Live Preview and Editing</CardTitle>
          <CardDescription>Edit code and see real-time updates</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="code" className="w-full">
            <TabsList>
              <TabsTrigger value="code" onClick={() => setPreviewMode('code')}>Code</TabsTrigger>
              <TabsTrigger value="preview" onClick={() => setPreviewMode('preview')}>Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="code">
              <Textarea
                value={generatedCode}
                onChange={(e) => setGeneratedCode(e.target.value)}
                className="w-full h-64 font-mono"
              />
            </TabsContent>
            <TabsContent value="preview">
              <div id="live-preview" className="w-full h-64 border p-4 overflow-auto">
                {previewMode === 'preview' && <div dangerouslySetInnerHTML={{ __html: generatedCode }} />}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <Eye className="mr-2 h-4 w-4" />
            Click-to-Code Demo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Click-to-Code Feature</DialogTitle>
            <DialogDescription>
              This is a demonstration of how the Click-to-Code feature would work. In a full implementation, clicking on elements in the preview would highlight the corresponding code.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p>Preview:</p>
            <div className="border p-4 mt-2">
              <h2 className="text-xl font-bold">Sample Header</h2>
              <p>This is a sample paragraph.</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Click me</button>
            </div>
          </div>
          <div className="mt-4">
            <p>Code:</p>
            <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">
              {`<div>
  <h2 className="text-xl font-bold">Sample Header</h2>
  <p>This is a sample paragraph.</p>
  <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
    Click me
  </button>
</div>`}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
