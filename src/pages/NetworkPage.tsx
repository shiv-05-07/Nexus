import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Share2,
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
  // Architectural state: Network page -> selectedTimeRange state -> getNetwork({ daysBack })
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeFilter>(timeFilter || '24h');
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [communities, setCommunities] = useState<NetworkCommunity[]>([]);
  const [summary, setSummary] = useState({
    activeCommunities: 4,
    monitoredNodes: 10,
    interactionLinks: 12,
    bridgeNodes: 2,
  });
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync if parent timeFilter changes
  useEffect(() => {
    if (timeFilter && timeFilter !== selectedTimeRange) {
      setSelectedTimeRange(timeFilter);
    }
  }, [timeFilter]);

  // Dynamic network dataset fetching based on selected time range
  useEffect(() => {
    let isMounted = true;

    // Convert time range to daysBack horizon
    let daysBack = 1;
    if (selectedTimeRange === '24h') daysBack = 1;
    else if (selectedTimeRange === '7d') daysBack = 7;
    else if (selectedTimeRange === '30d') daysBack = 30;
    else if (selectedTimeRange === '10m') daysBack = 10 / (24 * 60);
    else if (selectedTimeRange === '1h') daysBack = 1 / 24;
    else if (selectedTimeRange === '6h') daysBack = 0.25;

    nexusApi.getNetwork({ daysBack, timeFilter: selectedTimeRange, platform: platformFilter }).then((res) => {
      if (isMounted) {
        setNodes(res.nodes);
        setEdges(res.edges);
        setCommunities(res.communities);
        setSummary(res.summary);
        setInitialLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedTimeRange, platformFilter]);

  if (initialLoading) {
    return (
      <div className="space-y-12 max-w-5xl mx-auto">
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

  // Filtered nodes based on community filter or search
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

  const hasInsufficientData = nodes.length < 2 || edges.length === 0;

  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto">
      {/* 1. TOP METRICS STRIP (Dynamically tied to active time horizon) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-[#E8E8E1]">
        <div>
          <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-wider block">
            Active Communities
          </span>
          <span className="font-mono font-medium text-2xl text-[#171717] tracking-tight tabular-nums">
            {summary.activeCommunities} Clusters
          </span>
          <span className="font-sans text-[11px] text-[#8A8A82] block mt-0.5">cohesive sub-groups</span>
        </div>
        <div>
          <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-wider block">
            Observed Nodes
          </span>
          <span className="font-mono font-medium text-2xl text-[#171717] tracking-tight tabular-nums">
            {summary.monitoredNodes} Accounts
          </span>
          <span className="font-sans text-[11px] text-[#8A8A82] block mt-0.5">
            {platformFilter !== 'all' ? `monitored on ${platformFilter.toUpperCase()}` : `active in ${selectedTimeRange.toUpperCase()}`}
          </span>
        </div>
        <div>
          <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-wider block">
            Interaction Links
          </span>
          <span className="font-mono font-medium text-2xl text-[#171717] tracking-tight tabular-nums">
            {summary.interactionLinks} Edges
          </span>
          <span className="font-sans text-[11px] text-[#8A8A82] block mt-0.5">replies, quotes, reposts</span>
        </div>
        <div>
          <span className="font-mono text-[10px] text-[#B45309] uppercase tracking-wider block font-semibold">
            Bridge Nodes
          </span>
          <span className="font-mono font-medium text-2xl text-[#B45309] tracking-tight tabular-nums">
            {summary.bridgeNodes} Structural
          </span>
          <span className="font-sans text-[11px] text-[#8A8A82] block mt-0.5">cross-sector flow</span>
        </div>
      </div>

      {/* 2. SOCIAL ECOSYSTEM GRAPH (Animated network transition & time horizon filter) */}
      <section className="space-y-4">
        {/* Graph Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E8E8E1]">
          {/* Time Filter Segmented Control with Smooth Animated Active Pill */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-[#8A8A82] tracking-wider hidden sm:inline">
              Horizon:
            </span>
            <div className="flex items-center p-0.5 bg-[#F0F0EA] rounded-xs border border-[#E0E0D6]">
              {(['24h', '7d', '30d'] as TimeFilter[]).map((t) => {
                const isSelected = selectedTimeRange === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTimeRange(t)}
                    className={`relative px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
                      isSelected ? 'text-[#171717] font-semibold' : 'text-[#64748B] hover:text-[#171717]'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="networkTimeRangePill"
                        className="absolute inset-0 bg-[#FFFFFF] rounded-xs shadow-2xs"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 uppercase">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Node & Zoom Controls */}
          <div className="flex items-center gap-3">
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

        {/* Secondary Row: Community Filter Pills & Structural Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
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
              All Clusters ({nodes.length})
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
                <span className="font-mono text-[10px] text-[#8A8A82]">({c.nodeCount})</span>
              </button>
            ))}
          </div>

          {/* Structural Legend Bar */}
          <div className="flex items-center gap-5 px-1 text-xs font-mono text-[11px] text-[#575757]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#171717]" />
              <span>Community member</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rotate-45 bg-[#B45309] inline-block" />
              <span>High-centrality node</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rotate-45 border-2 border-[#B45309] bg-transparent inline-block" />
              <span>Bridge node</span>
            </span>
          </div>
        </div>

        {/* Graph Canvas Viewport */}
        <div
          className="w-full h-[520px] bg-[#FAF8F5] border border-[#E8E8E1] rounded-xs relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
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

          {/* Empty State when insufficient activity in period */}
          {hasInsufficientData ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5]/95 z-20">
              <div className="w-10 h-10 rounded-full bg-[#F0F0EA] border border-[#E0E0D6] flex items-center justify-center text-[#8A8A82] mb-3">
                <Share2 className="w-5 h-5 text-[#8A8A82]" />
              </div>
              <h4 className="font-sans font-bold text-sm text-[#171717]">
                Not enough activity in this period
              </h4>
              <p className="font-sans text-xs text-[#575757] mt-1 max-w-xs">
                Try expanding the time range.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setSelectedTimeRange('24h')}
                  className="px-3 py-1.5 bg-[#171717] hover:bg-[#333333] text-white text-xs font-sans font-medium rounded-xs transition-colors cursor-pointer"
                >
                  Switch to 24H
                </button>
                <button
                  onClick={() => setSelectedTimeRange('7d')}
                  className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F0F0EA] border border-[#D6D6CC] text-[#171717] text-xs font-sans font-medium rounded-xs transition-colors cursor-pointer"
                >
                  Switch to 7D
                </button>
              </div>
            </div>
          ) : null}

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
            {/* Edges with smooth animated transitions on coordinate updates, additions, and removals */}
            <g className="edges">
              <AnimatePresence>
                {edges.map((edge) => {
                  const sourceNode = nodes.find((n) => n.id === edge.source);
                  const targetNode = nodes.find((n) => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const isConnectedToFocus =
                    activeFocusId &&
                    (edge.source === activeFocusId || edge.target === activeFocusId);
                  const isFaded = activeFocusId && !isConnectedToFocus;
                  const baseOpacity = isFaded ? 0.06 : isConnectedToFocus ? 0.95 : 0.45;

                  return (
                    <motion.line
                      key={edge.id}
                      initial={{ opacity: 0 }}
                      animate={{
                        x1: sourceNode.x,
                        y1: sourceNode.y,
                        x2: targetNode.x,
                        y2: targetNode.y,
                        opacity: baseOpacity,
                        stroke: isConnectedToFocus ? '#171717' : '#D6D6CC',
                        strokeWidth: isConnectedToFocus ? 2.2 : Math.max(1, edge.weight * 0.35),
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 24,
                        opacity: { duration: 0.25 },
                      }}
                      strokeDasharray={edge.interactionType === 'quote' ? '3,3' : undefined}
                    />
                  );
                })}
              </AnimatePresence>
            </g>

            {/* Nodes with Shapes Corresponding to Legend: ● / ◆ / ◇ */}
            <g className="nodes">
              <AnimatePresence>
                {displayedNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const isConnected = !activeFocusId || connectedNodeIds.has(node.id);
                  const targetOpacity = isConnected ? 1 : 0.15;

                  const baseRadius = 13 + node.pagerank * 110;
                  const isHighCentrality = node.pagerank > 0.08 && !node.isBridge;

                  return (
                    <motion.g
                      key={node.id}
                      initial={{ opacity: 0, scale: 0.2, x: node.x, y: node.y }}
                      animate={{
                        opacity: targetOpacity,
                        scale: 1,
                        x: node.x,
                        y: node.y,
                      }}
                      exit={{ opacity: 0, scale: 0.2 }}
                      transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 24,
                        mass: 0.8,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNodeClick(node);
                      }}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* A. BRIDGE NODE: ◇ (Hollow / Framed Diamond with Accent Border) */}
                      {node.isBridge ? (
                        <g>
                          {/* Outer framing diamond */}
                          <polygon
                            points={`0,-${baseRadius + 6} ${baseRadius + 6},0 0,${baseRadius + 6} -${baseRadius + 6},0`}
                            fill="none"
                            stroke="#B45309"
                            strokeWidth="1.5"
                            strokeDasharray="2,2"
                          />
                          {/* Inner node shape */}
                          <motion.polygon
                            points={`0,-${baseRadius} ${baseRadius},0 0,${baseRadius} -${baseRadius},0`}
                            animate={{ scale: isHovered || isSelected ? 1.2 : 1 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            fill={node.avatarColor}
                            stroke="#FFFFFF"
                            strokeWidth="2.5"
                          />
                        </g>
                      ) : isHighCentrality ? (
                        /* B. HIGH-CENTRALITY NODE: ◆ (Solid Diamond) */
                        <motion.polygon
                          points={`0,-${baseRadius} ${baseRadius},0 0,${baseRadius} -${baseRadius},0`}
                          animate={{ scale: isHovered || isSelected ? 1.2 : 1 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          fill={node.avatarColor}
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                        />
                      ) : (
                        /* C. COMMUNITY MEMBER: ● (Solid Circle) */
                        <motion.circle
                          cx={0}
                          cy={0}
                          animate={{
                            r: baseRadius,
                            scale: isHovered || isSelected ? 1.2 : 1,
                          }}
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          fill={node.avatarColor}
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                        />
                      )}

                      {/* Node Handle Label */}
                      <text
                        x={0}
                        y={baseRadius + 15}
                        textAnchor="middle"
                        className={`font-mono text-[10px] select-none transition-colors ${
                          isHovered || isSelected ? 'fill-[#171717] font-bold' : 'fill-[#575757]'
                        }`}
                      >
                        {node.label}
                      </text>

                      {/* Role Tag when Focused */}
                      {(isHovered || isSelected) && (
                        <text
                          x={0}
                          y={baseRadius + 28}
                          textAnchor="middle"
                          className="font-sans text-[9px] fill-[#8A8A82] select-none"
                        >
                          {node.role} • {node.platform.toUpperCase()}
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              </AnimatePresence>
            </g>
          </svg>

          {/* Quick Interaction Guide Overlay */}
          <div className="absolute bottom-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-xs px-3 py-1.5 border border-[#E8E8E1] rounded-xs text-[11px] font-sans text-[#575757] flex items-center gap-3">
            <span>Select node to inspect structural centrality</span>
            <span className="text-[#8A8A82]">|</span>
            <span>Drag canvas to navigate</span>
          </div>
        </div>
      </section>

      {/* 3. IDENTIFIED COMMUNITY CLUSTERS (Clean editorial layout) */}
      <section className="space-y-4 pt-4 border-t border-[#E8E8E1]">
        <div>
          <h3 className="font-sans font-bold text-base text-[#171717]">
            Identified Community Clusters
          </h3>
          <p className="font-sans text-xs text-[#575757]">
            Topological partition based on interaction density in {selectedTimeRange.toUpperCase()} {platformFilter !== 'all' ? `(${platformFilter.toUpperCase()})` : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {communities.map((comm) => (
            <div
              key={comm.id}
              onClick={() => setSelectedCommunityId(comm.id)}
              className="py-4 px-3 hover:bg-[#FFFFFF]/70 transition-colors cursor-pointer space-y-1.5 border-b border-[#E8E8E1] last:border-b-0 md:last:border-b group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: comm.color }} />
                <h4 className="font-sans font-semibold text-xs text-[#171717] group-hover:text-[#B45309] transition-colors">
                  {comm.name}
                </h4>
              </div>
              <p className="font-sans text-[11px] text-[#575757] leading-relaxed line-clamp-2">
                {comm.description}
              </p>
              <div className="pt-1 flex items-center justify-between font-mono text-[10px] text-[#8A8A82]">
                <span>{comm.nodeCount} active nodes</span>
                <span className="capitalize font-medium">{comm.dominantSentiment} tone</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
