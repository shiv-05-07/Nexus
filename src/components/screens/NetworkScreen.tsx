import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NETWORK_EDGES, NETWORK_NODES } from '../../data/mockIntelligence';
import { NetworkNode } from '../../types/nexus';
import { Share2, ZoomIn, ZoomOut, Filter, Info, ShieldAlert } from 'lucide-react';

interface NetworkScreenProps {
  onSelectNode: (node: NetworkNode) => void;
}

export const NetworkScreen: React.FC<NetworkScreenProps> = ({ onSelectNode }) => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(NETWORK_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [communityFilter, setCommunityFilter] = useState<string>('ALL');

  const activeNode = hoveredNode || selectedNode;

  const filteredNodes = NETWORK_NODES.filter((n) => {
    if (communityFilter === 'ALL') return true;
    return n.communityId === communityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232729] pb-4">
        <div>
          <h1 className="font-sans font-extrabold text-xl text-[#E8E3D8] tracking-wide uppercase">
            06. NETWORK TOPOLOGY & STRUCTURAL INFLUENCE
          </h1>
          <p className="font-mono text-xs text-[#737C80] mt-0.5">
            Inter-community relationships, bridge node centrality, and information flow edges
          </p>
        </div>

        {/* Disclaimer Badge */}
        <div className="flex items-center gap-2 font-mono text-[11px] bg-[#171A1C] border border-[#232729] px-3 py-1.5 rounded-xs">
          <Info className="w-3.5 h-3.5 text-[#D6A84F]" />
          <span className="text-[#D6A84F] font-bold">INFLUENCE ≠ CAUSALITY</span>
        </div>
      </div>

      {/* Main Interactive Network Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Network Graph Viewport (~70% / 8 cols) */}
        <div className="lg:col-span-8 bg-[#171A1C] border border-[#232729] rounded-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          {/* Controls Overlay Bar */}
          <div className="flex items-center justify-between font-mono text-[10px] z-20 mb-2">
            <div className="flex items-center gap-2 bg-[#0D1012] p-1 border border-[#232729] rounded-xs">
              <span className="text-[#737C80] px-1">COMMUNITY:</span>
              {(['ALL', 'C04', 'C07', 'C01', 'C02'] as string[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCommunityFilter(c)}
                  className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                    communityFilter === c ? 'bg-[#232729] text-[#E8E3D8] font-bold' : 'text-[#737C80] hover:text-[#BDB5A6]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#0D1012] p-1 border border-[#232729] rounded-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                className="p-1 hover:bg-[#232729] text-[#737C80] hover:text-[#E8E3D8] rounded-xs"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}
                className="p-1 hover:bg-[#232729] text-[#737C80] hover:text-[#E8E3D8] rounded-xs"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Force Graph Canvas */}
          <div className="relative w-full h-[400px] bg-[#0D1012] border border-[#232729] rounded-xs flex items-center justify-center overflow-hidden">
            <motion.svg
              animate={{ scale: zoomLevel }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
              viewBox="0 0 700 520"
            >
              {/* Render Edges */}
              {NETWORK_EDGES.map((edge) => {
                const sourceNode = NETWORK_NODES.find((n) => n.id === edge.source);
                const targetNode = NETWORK_NODES.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnectedToActive =
                  activeNode && (edge.source === activeNode.id || edge.target === activeNode.id);

                return (
                  <line
                    key={edge.id}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isConnectedToActive ? '#C9784A' : '#232729'}
                    strokeWidth={isConnectedToActive ? 2.5 : 1}
                    strokeDasharray={edge.type === 'forward' ? '4 2' : 'none'}
                    opacity={isConnectedToActive ? 1 : 0.4}
                  />
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const isBridge = node.isBridge;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => {
                      setSelectedNode(node);
                      onSelectNode(node);
                    }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  >
                    {/* Pulsing ring for bridge nodes */}
                    {isBridge && (
                      <circle
                        r={node.betweenness * 18 + 6}
                        fill="none"
                        stroke="#C9784A"
                        strokeWidth="1"
                        className="animate-quiet-pulse opacity-40"
                      />
                    )}

                    <circle
                      r={node.betweenness * 14 + 6}
                      fill={isBridge ? '#C9784A' : isSelected ? '#5AA9A0' : '#232729'}
                      stroke={isSelected ? '#E8E3D8' : '#737C80'}
                      strokeWidth={isSelected ? 2 : 1}
                      className="transition-all duration-200"
                    />

                    <text
                      y={node.betweenness * 14 + 18}
                      textAnchor="middle"
                      fill={isSelected || isHovered ? '#E8E3D8' : '#737C80'}
                      fontSize="9"
                      fontFamily="IBM Plex Mono"
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </motion.svg>
          </div>

          <div className="flex justify-between font-mono text-[9px] text-[#737C80] mt-2">
            <span>ZOOM: {Math.round(zoomLevel * 100)}%</span>
            <span>NODES: {filteredNodes.length} · EDGES: {NETWORK_EDGES.length}</span>
          </div>
        </div>

        {/* Node Detail Inspector (~30% / 4 cols) */}
        <div className="lg:col-span-4 bg-[#171A1C] border border-[#232729] rounded-sm p-5 space-y-4">
          <div className="border-b border-[#232729] pb-3">
            <span className="font-mono text-[10px] text-[#C9784A] font-bold uppercase tracking-wider">
              TOPOLOGICAL INSPECTOR
            </span>
            <h3 className="font-sans font-bold text-base text-[#E8E3D8] mt-1">
              {activeNode.label} ({activeNode.id})
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#0D1012] border border-[#232729] rounded-xs space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#737C80]">Betweenness Centrality:</span>
                <span className="text-[#C9784A] font-bold">{activeNode.betweenness}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#737C80]">PageRank Index:</span>
                <span className="text-[#E8E3D8] font-bold">{activeNode.pageRank}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#737C80]">Observed Event Activity:</span>
                <span className="text-[#5AA9A0] font-bold">{activeNode.observedActivity}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#737C80]">Platform Host:</span>
                <span className="text-[#E8E3D8]">{activeNode.platform}</span>
              </div>
            </div>

            <div className="p-3 bg-[#0D1012] border border-[#232729] rounded-xs">
              <div className="text-[10px] text-[#737C80] uppercase mb-1">
                STRUCTURAL CLASSIFICATION
              </div>
              <p className="font-sans text-xs text-[#E8E3D8]/90 leading-relaxed">
                {activeNode.isBridge
                  ? 'High structural influence bridge account connecting Community 04 (X) to Community 07 (Telegram).'
                  : 'Standard cluster member account within local community graph.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
