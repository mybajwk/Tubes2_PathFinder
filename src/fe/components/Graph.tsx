import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Define your node and link structures
interface Node {
  id: string;
  group?: number;
}

interface Link {
  source: string;
  target: string;
  value?: number;
}

// Props expected by the ForceGraph component
interface ForceGraphProps {
  nodes: Node[];
  links: Link[];
}

const ForceGraph: React.FC<ForceGraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 640;
    const height = 400;
    svg.attr('width', width).attr('height', height)
       .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const g = svg.append('g');

    // Enable zoom and pan
    svg.call(d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    }));

    // Define arrow markers
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
        .attr("id", d => d)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
      .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr('fill', '#999');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => typeof d === 'object' ? d.id : d).distance(100))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter());

    // Draw links with arrow marker
    const link = g.append('g')
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("marker-end", "url(#end)");

    // Draw nodes
    const node = g.append('g')
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr('r', 10)
      .attr('fill', (d, i) => i === 0 ? 'green' : i === nodes.length - 1 ? 'red' : 'blue')
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
      .attr("fill", "black");

    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

      node.attr('cx', d => d.x)
          .attr('cy', d => d.y);

      labels.attr('x', d => d.x + 15)
            .attr('y', d => d.y + 5);
    });

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

  }, [nodes, links]);

  return <svg ref={svgRef}></svg>;
};

export default ForceGraph;