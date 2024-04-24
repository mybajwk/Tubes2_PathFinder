import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTheme } from 'next-themes';
import { Simulation, SimulationNodeDatum, SimulationLinkDatum, D3DragEvent, drag } from 'd3';

// Define your node and link structures
interface Node extends SimulationNodeDatum {
  id: string;
  group?: number;
  value: string;
  degree: number;
}
interface Link extends SimulationLinkDatum<Node> {
  value?: number;
}

// Props expected by the ForceGraph component
interface ForceGraphProps {
  nodes: Node[];
  links: Link[];
}

const ForceGraph: React.FC<ForceGraphProps> = ({ nodes, links }) => {
  const { theme } = useTheme()
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgElement = svgRef.current as SVGSVGElement;
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 500;
    svg.attr('width', width).attr('height', height)
       .attr('viewBox', [-width / 2, -height / 2, width, height]);
    const g = svg.append('g');

    // Enable zoom and pan
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoomBehavior);

    // Define arrow markers for both directions
    svg.append("defs").selectAll("marker")
      .data(["end", "start"]) // Define markers for both directions
      .enter().append("marker")
        .attr("id", d => d)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", d => d === "start" ? "auto-start-reverse" : "auto")
      .append("path")
        .attr("d", d => d === "start" ? "M10,-5L0,0L10,5" : "M0,-5L10,0L0,5") // Adjust path for different directions
        .attr('fill', '#999');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter());

    // Draw links with arrow markers based on degree direction
    const link = g.append('g')
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("marker-end", d => {
        // TypeScript might still think d.source or d.target could be string or number.
        // We assert they are definitely of type Node.
        const source = d.source as Node;
        const target = d.target as Node;
        return target.degree > source.degree ? "url(#end)" : "url(#start)";
    });
    
    const maxDegree = d3.max(nodes, d => d.degree) || 1;

    // Draw nodes
    const node = g.append('g')
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll<SVGCircleElement, Node>("circle")
      .data(nodes)
      .join("circle")
      .attr('r', 10)
      .attr('fill', d => {
        if (d.degree === 0) {
          return 'green';
        } else if (d.degree === maxDegree) {
          return 'red';
        } else {
          const colors = ['blue', 'orange', 'yellow', 'gray', 'purple', 'pink', 'darkgreen'];
          return colors[d.degree % colors.length];
        }
    })
      .call(drag(simulation));

    // Add node labels
    const labels = g.append('g')
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("x", 15)
      .attr("y", 5)
      .style("font-size", "12px")
      .attr("fill", theme === "light" ? "black" : "white");

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x ?? 0)
        .attr('y1', d => (d.source as Node).y ?? 0)
        .attr('x2', d => (d.target as Node).x ?? 0)
        .attr('y2', d => (d.target as Node).y ?? 0);
    
      node
        .attr('cx', d => d.x ?? 0)
        .attr('cy', d => d.y ?? 0);
    
      labels
        .attr('x', d => (d.x ?? 0) + 15)
        .attr('y', d => (d.y ?? 0) + 5);
    });

    function drag(simulation: Simulation<Node, undefined>) {
      return d3.drag<SVGCircleElement, Node>()
        .on('start', (event: D3DragEvent<SVGCircleElement, Node, Node>) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event: D3DragEvent<SVGCircleElement, Node, Node>) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event: D3DragEvent<SVGCircleElement, Node, Node>) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        });
    }

  }, [nodes, links]);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <svg ref={svgRef}></svg>
      <Legend nodes={nodes} />
    </div>
  );
};

const Legend: React.FC<{ nodes: Node[] }> = ({ nodes }) => {
  if (!nodes || nodes.length === 0) {
    // Handle the case where nodes are not available
    return null;
  }

  // Get the maximum degree among all nodes
  const maxDegree = d3.max(nodes, d => d.degree) || 1;

  // Generate color scale based on the maximum degree
  const colorScale = d3.scaleSequential((d) => {
    if (d === 0) {
      return 'green';
    } else if (d === maxDegree) {
      return 'red';
    } else {
      // Define specific colors for other degrees
      const colors = ['blue', 'orange', 'yellow', 'gray', 'purple', 'pink', 'darkgreen'];
      return colors[d % colors.length];
    }
  });

  // Create legend items dynamically based on the color scale
  const legendItems = [];
  for (let i = 0; i <= maxDegree; i++) {
    legendItems.push({
      degree: i,
      color: colorScale(i),
      label: i === 0 ? "Start" : i === maxDegree ? "End" : `${i} Degree Away`
    });
  }

  return (
    <div className="absolute top-0 left-0 p-4">
      {legendItems.map(item => (
        <div key={item.degree} className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
          <span className="text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ForceGraph;