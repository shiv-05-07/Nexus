import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  ArrowUpRight
} from 'lucide-react';
import {
  NetworkCommunity,
  NetworkEdge,
  NetworkNode,
  Platform,
  TimeFilter
} from '../types/nexus';
import { nexusApi } from '../services/api/nexusApi';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

interface NetworkPageProps {
  timeFilter: TimeFilter;
  platformFilter: Platform;
  onSelectNode: (node: NetworkNode) => void;
}

export const NetworkPage: React.FC<NetworkPageProps> = ({
  timeFilter,
  platformFilter,
  onSelectNode,
}) => {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [communities, setCommunities] = useState<NetworkCommunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    nexusApi.getNetwork().then((res) => {
      if (isMounted) {
        setNodes(res.nodes);
        setEdges(res.edges);
        setCommunities(res.communities);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [timeFilter, platformFilter]);

  if (loading) {
    return (
      <div className="space-y-10 max-w-5xl mx-auto">
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  // Active focus node
  const activeFocusId = hoveredNodeId || selectedNodeId;

  // Determine connected neighbors
  const connectedNodeIds = new Set<string>();
  if (activeFocusId) {
    connectedNodeIds.add(activeFocusId);
    edges.forEach((edge) => {
      if (edge.source === activeFocusId) connectedNodeIds.add(edge.target);
      if (edge.target === activeFocusId) connectedNodeIds.add(edge.source);
    });
  }

  // Filtered nodes
  const displayedNodes = nodes.filter((n) => {
    if (selectedCommunityId !== 'all' && n.communityId !== selectedCommunityId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.label.toLowerCase().includes(q) ||
        n.alias.toLowerCase().includes(q) ||
        n.communityName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNodeId(node.id);
    onSelectNode(node);
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* 1. TOP METRICS STRIP (Minimal, uncarded horizontal baseline) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-4 border-b border-[#E8E8E1]">
        <div>
          <span className="font-mono text-[11px] text-[#8A8A82] uppercase tracking-wider block">
            Active Communities
          </span>
          <span className="font-mono font-medium text-xl md:text-2xl text-[#171717] tracking-tight">
            {communities.length} Clusters
          </span>
          <span className="font-sans text-[11px] text-[#8A8A82] block mt-0.5">cohesive sub-groups</span>
        </div>
        <div>
          <span className="font-mono text-[11px] text-[#8A8A82] uppercase tracking-wider block">
            Observed Nodes
          </span>
          <span className="font-mono font-medium text-xl md:text-2xl text-[#171717] tracking-tight">
            142 Accounts
          </span>
          <span className="font-sans text-[11px] text-[#8A8A82] block mt-0.5">monitored handles</span>
        </div>
        <div>
          <span className="font-mono text-[11px] text-[#8A8A82] uppercase tracking-wider block">
            Interaction Links
          </span>
          <span className="font-mono font-medium text-xl md:text-2xl text-[#171717] tracking-tight">
            488 Edges
          </span>
          <span className="font-sans text-[11px] text-[#8A8A82] block mt-0.5">replies, quotes, reposts</span>
        </div>
        <div>
          <span className="font-mono text-[11px] text-[#B45309] uppercase tracking-wider block font-semibold">
            Bridge Nodes
          </span>
          <span className="font-mono font-medium text-xl md:text-2xl text-[#B45309] tracking-tight">
            2 Key Mediators
          </span>
          <span className="font-sans text-[11px] text-[#8A8A82] block mt-0.5">high betweenness</span>
        </div>
      </div>

      {/* 2. SOCIAL ECOSYSTEM GRAPH (Spacious, calm, smooth transitions) */}
      <section className="space-y-4">
        {/* Graph Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E8E1]">
          {/* Community Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCommunityId('all')}
              className={`px-2.5 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
                selectedCommunityId === 'all'
                  ? 'bg-[#171717] text-white font-medium'
                  : 'text-[#575757] hover:text-[#171717] hover:bg-[#F0F0EA]'
              }`}
            >
              All Clusters
            </button>
            {communities.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCommunityId(c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
                  selectedCommunityId === c.id
                    ? 'bg-[#171717] text-white font-medium'
                    : 'text-[#575757] hover:text-[#171717] hover:bg-[#F0F0EA]'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Search Node & Zoom Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A8A82]" />
              <input
                type="text"
                placeholder="Search node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs bg-[#FFFFFF] border border-[#D6D6CC] rounded-xs text-[#171717] focus:outline-none focus:border-[#171717] w-36 font-sans"
              />
            </div>

            <div className="flex items-center border border-[#D6D6CC] rounded-xs bg-[#FFFFFF] divide-x divide-[#E8E8E1]">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.2))}
                className="p-1.5 text-[#575757] hover:text-[#171717] cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}
                className="p-1.5 text-[#575757] hover:text-[#171717] cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-[#575757] hover:text-[#171717] cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Graph Canvas Viewport */}
        <div
          className="w-full h-[490px] bg-[#FAF8F5] border border-[#E8E8E1] rounded-xs relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle Grid dots */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
            <defs>
              <pattern id="networkGridDots" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="14" cy="14" r="0.75" fill="#8A8A82" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#networkGridDots)" />
          </svg>

          {/* Interactive Transformable Canvas */}
          <svg
            viewBox="0 0 900 550"
            className="w-full h-full overflow-visible"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: isDraggingRef.current ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {/* Edges with smooth highlight & dimming transitions */}
            <g className="edges">
              {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnectedToFocus =
                  activeFocusId &&
                  (edge.source === activeFocusId || edge.target === activeFocusId);
                const isFaded = activeFocusId && !isConnectedToFocus;

                return (
                  <line
                    key={edge.id}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isConnectedToFocus ? '#171717' : '#D6D6CC'}
                    strokeWidth={isConnectedToFocus ? 2.2 : Math.max(1, edge.weight * 0.35)}
                    strokeOpacity={isFaded ? 0.08 : isConnectedToFocus ? 0.95 : 0.45}
                    strokeDasharray={edge.interactionType === 'quote' ? '3,3' : undefined}
                    className="transition-all duration-250"
                  />
                );
              })}
            </g>

            {/* Nodes with spring scales and opacity control */}
            <g className="nodes">
              {displayedNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isConnected = !activeFocusId || connectedNodeIds.has(node.id);
                const opacity = isConnected ? 1 : 0.18;

                const baseRadius = 14 + node.pagerank * 110;

                return (
                  <g
                    key={node.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeClick(node);
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    style={{ opacity, cursor: 'pointer' }}
                    className="transition-opacity duration-250"
                  >
                    {/* Bridge Node Subtle Concentric Ring */}
                    {node.isBridge && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={baseRadius + 6}
                        fill="none"
                        stroke="#B45309"
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                      />
                    )}

                    {/* Node Core Circle */}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={baseRadius}
                      animate={{
                        scale: isHovered || isSelected ? 1.2 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      fill={node.avatarColor}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />

                    {/* Node Handle Label */}
                    <text
                      x={node.x}
                      y={node.y + baseRadius + 14}
                      textAnchor="middle"
                      className={`font-mono text-[10px] select-none transition-all ${
                        isHovered || isSelected ? 'fill-[#171717] font-bold' : 'fill-[#575757]'
                      }`}
                    >
                      {node.label}
                    </text>

                    {/* Role Tag when Focused */}
                    {(isHovered || isSelected) && (
                      <text
                        x={node.x}
                        y={node.y + baseRadius + 26}
                        textAnchor="middle"
                        className="font-sans text-[9px] fill-[#8A8A82] select-none"
                      >
                        {node.role}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Quick Interaction Guide */}
          <div className="absolute bottom-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-xs px-3 py-1.5 border border-[#E8E8E1] rounded-xs text-[11px] font-sans text-[#575757] flex items-center gap-3">
            <span>Select node to inspect structural centrality</span>
            <span className="text-[#8A8A82]">|</span>
            <span>Drag canvas to navigate</span>
          </div>
        </div>
      </section>

      {/* 3. IDENTIFIED COMMUNITY CLUSTERS (Clean editorial rows/columns) */}
      <section className="space-y-4 pt-4 border-t border-[#E8E8E1]">
        <div>
          <h3 className="font-sans font-bold text-base text-[#171717]">
            Identified Community Clusters
          </h3>
          <p className="font-sans text-xs text-[#575757]">
            Topological partition based on cross-platform interaction density
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {communities.map((comm) => (
            <div
              key={comm.id}
              onClick={() => setSelectedCommunityId(comm.id)}
              className="p-4 bg-[#FFFFFF] border border-[#E8E8E1] hover:border-[#D6D6CC] rounded-xs transition-all cursor-pointer space-y-2 group shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comm.color }} />
                <h4 className="font-sans font-semibold text-xs text-[#171717] group-hover:text-[#B45309] transition-colors">
                  {comm.name}
                </h4>
              </div>
              <p className="font-sans text-[11px] text-[#575757] leading-relaxed line-clamp-2">
                {comm.description}
              </p>
              <div className="pt-2 border-t border-[#F0F0EA] flex items-center justify-between font-mono text-[10px] text-[#8A8A82]">
                <span>{comm.nodeCount} accounts</span>
                <span className="capitalize font-medium">{comm.dominantSentiment} tone</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
