import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter,
  Info,
  Shield,
  Layers,
  Activity
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
      <div className="space-y-8 max-w-6xl mx-auto">
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  // Determine active/highlighted relationships
  const activeFocusId = hoveredNodeId || selectedNodeId;

  const connectedNodeIds = new Set<string>();
  if (activeFocusId) {
    connectedNodeIds.add(activeFocusId);
    edges.forEach((edge) => {
      if (edge.source === activeFocusId) connectedNodeIds.add(edge.target);
      if (edge.target === activeFocusId) connectedNodeIds.add(edge.source);
    });
  }

  // Filtered nodes based on community and search
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
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. Top Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs">
        <div>
          <span className="font-sans text-[11px] text-[#575757] block">Active Communities</span>
          <span className="font-mono font-bold text-lg text-[#171717]">
            {communities.length} Clusters
          </span>
        </div>
        <div>
          <span className="font-sans text-[11px] text-[#575757] block">Monitored Nodes</span>
          <span className="font-mono font-bold text-lg text-[#171717]">142 Observed</span>
        </div>
        <div>
          <span className="font-sans text-[11px] text-[#575757] block">Interaction Edges</span>
          <span className="font-mono font-bold text-lg text-[#171717]">488 Links</span>
        </div>
        <div>
          <span className="font-sans text-[11px] text-[#575757] block">Structural Bridge Nodes</span>
          <span className="font-mono font-bold text-lg text-[#B45309]">2 High-Centrality</span>
        </div>
      </div>

      {/* 2. Main Interactive Graph Canvas Frame */}
      <section className="bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs shadow-2xs overflow-hidden flex flex-col">
        {/* Canvas Toolbar Controls */}
        <div className="px-5 py-3 border-b border-[#F0F0EA] flex flex-wrap items-center justify-between gap-3 bg-[#FDFDFB]">
          {/* Community Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCommunityId('all')}
              className={`px-2.5 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
                selectedCommunityId === 'all'
                  ? 'bg-[#171717] text-white font-semibold'
                  : 'bg-[#F7F7F4] border border-[#E6E6DF] text-[#575757] hover:bg-[#F0F0EA]'
              }`}
            >
              All Communities
            </button>
            {communities.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCommunityId(c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
                  selectedCommunityId === c.id
                    ? 'bg-[#171717] text-white font-semibold'
                    : 'bg-[#F7F7F4] border border-[#E6E6DF] text-[#575757] hover:bg-[#F0F0EA]'
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
                placeholder="Find node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs bg-[#FFFFFF] border border-[#D4D4CA] rounded-xs text-[#171717] focus:outline-none focus:border-[#171717] w-36 font-sans"
              />
            </div>

            <div className="flex items-center border border-[#D4D4CA] rounded-xs bg-[#FFFFFF] divide-x divide-[#E6E6DF]">
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

        {/* Interactive SVG Network Graph */}
        <div
          className="w-full h-[480px] bg-[#FAF8F5] relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
            <defs>
              <pattern id="networkGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="0.75" fill="#BDB5A6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#networkGrid)" />
          </svg>

          {/* Transformable Canvas Group */}
          <svg
            viewBox="0 0 900 550"
            className="w-full h-full overflow-visible"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: isDraggingRef.current ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {/* Edges */}
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
                    stroke={isConnectedToFocus ? '#171717' : '#D4D4CA'}
                    strokeWidth={isConnectedToFocus ? 2.2 : Math.max(1, edge.weight * 0.4)}
                    strokeOpacity={isFaded ? 0.15 : isConnectedToFocus ? 0.9 : 0.45}
                    strokeDasharray={edge.interactionType === 'quote' ? '3,3' : undefined}
                    className="transition-all duration-200"
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {displayedNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isConnected = !activeFocusId || connectedNodeIds.has(node.id);
                const opacity = isConnected ? 1 : 0.22;

                const baseRadius = 14 + node.pagerank * 120;

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
                    className="transition-opacity duration-200"
                  >
                    {/* Bridge Node Outer Indicator */}
                    {node.isBridge && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={baseRadius + 8}
                        fill="none"
                        stroke="#B45309"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        className="animate-spin-slow"
                      />
                    )}

                    {/* Node Core Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered || isSelected ? baseRadius + 4 : baseRadius}
                      fill={node.avatarColor}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="transition-all duration-150"
                    />

                    {/* Label */}
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

                    {/* Role / Subtitle if focused */}
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

          {/* Quick Interaction Guide Box */}
          <div className="absolute bottom-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-xs px-3 py-1.5 border border-[#E6E6DF] rounded-xs text-[11px] font-sans text-[#575757] flex items-center gap-3">
            <span>Click any node to inspect centrality & propagation trail</span>
            <span className="text-[#8A8A82]">|</span>
            <span>Drag canvas to pan</span>
          </div>
        </div>
      </section>

      {/* 3. Community Directory Cards */}
      <section className="space-y-3">
        <h3 className="font-sans font-bold text-sm text-[#171717]">
          Identified Community Clusters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {communities.map((comm) => (
            <div
              key={comm.id}
              onClick={() => setSelectedCommunityId(comm.id)}
              className="p-4 bg-[#FFFFFF] border border-[#E6E6DF] hover:border-[#D4D4CA] rounded-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comm.color }} />
                <h4 className="font-sans font-semibold text-xs text-[#171717]">
                  {comm.name}
                </h4>
              </div>
              <p className="font-sans text-[11px] text-[#575757] leading-relaxed line-clamp-2">
                {comm.description}
              </p>
              <div className="pt-2 border-t border-[#F0F0EA] flex items-center justify-between font-mono text-[10px] text-[#8A8A82]">
                <span>{comm.nodeCount} monitored accounts</span>
                <span className="capitalize">{comm.dominantSentiment} tone</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
