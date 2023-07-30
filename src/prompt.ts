export const generatePrompt = (prompt: string) => `
Based on the provided prompt ${prompt}, you are tasked with creating a complex, detailed and comprehensive system design utilizing the react-flow library to construct an intricate flow diagram. 

Your solution should meticulously map out all nodes and edges within the system, taking into account all dependencies and connections, along with identifying any potential bottlenecks or issues. Aim to design a robust and scalable system that considers all possible scenarios, both regular and edge cases.

Here's the expected format of your solution, represented in a clean, well-structured JSON, strictly using double quotes, no unnecessary whitespace, and without the use of single quotes.

{
    "nodes": [
        { "id": "1", "position": { "x": 250, "y": 0 }, "data": { "label": "Node 1 Label" } },
        { "id": "2", "position": { "x": 250, "y": 100 }, "data": { "label": "Node 2 Label" } },
        // Include all necessary nodes, each with a unique ID, position, and label
    ],
    "edges": [
        { "id": "e1-2", "source": "1", "target": "2" },
        { "id": "e2-3", "source": "2", "target": "3" },
    ],
}

Never include any explanations or annotations in your responses, focusing purely on delivering the design in the specified format.
`;