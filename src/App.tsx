import { useCallback, useState } from 'react';
import ReactFlow, { applyEdgeChanges, applyNodeChanges } from 'reactflow';

import axios from 'axios';

import 'reactflow/dist/style.css';
import { generatePrompt } from './prompt';

const initialNodes = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'Entry' } },
  { id: '2', position: { x: 250, y: 100 }, data: { label: 'General (Introduce Yourself)' } },
  { id: '3', position: { x: 100, y: 200 }, data: { label: 'Open-Source' } },
  { id: '4', position: { x: 400, y: 200 }, data: { label: 'Business and Startups' } },
  { id: '5', position: { x: 250, y: 300 }, data: { label: 'Finished Onboarding' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
];

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const generateNodes = async () => {
    setLoading(true)

    const messages = [{
      role: 'user',
      content: generatePrompt(prompt)
    }]

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages,
          model: 'gpt-4',
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const newEdges = JSON.parse(response.data.choices[0].message.content).edges
      const newNodes = JSON.parse(response.data.choices[0].message.content).nodes
    
      setLoading(false)

      setEdges(newEdges)
      setNodes(newNodes)
      setPrompt('')
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes, nodes]
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges, edges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        fitView 
        fitViewOptions={{
          maxZoom: 0.8,
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '16px',
          }}
        >
        <h4>
          OpenAI Api Key
        </h4>
        <input
          style={{
            position: 'relative',
            width: '300px',
            height: '40px',
            zIndex: 1000
          }}
          placeholder='OpenAI Api Key'
          onChange={(e) => {
            setApiKey(e.target.value)
          }
        }
        />
        <h4 style={{
          position: 'relative',
        }}>Prompt</h4>
        <textarea 
          style={{
            position: 'relative',
            width: '300px',
            height: '250px',
            zIndex: 1000
          }} 
          placeholder='Which are the next steps should I follow?'
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button 
          onClick={generateNodes}
          disabled={loading}
          style={{
            marginTop: '8px',
            position: 'relative',
            width: '300px',
            height: '50px',
            zIndex: 1000
          }}
        >
          {loading ? 'Loading...' : 'Generate'}
        </button>
        </div>
      </ReactFlow>
    </div>
  );
}