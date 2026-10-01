import { TrendItem } from '../../types/nexus';

export const MOCK_TREND_ITEMS: TrendItem[] = [
  {
    id: 'NAR-01',
    name: 'Public Transport Strike & Fare Revision',
    volume: 4281,
    accelerationPct: 312,
    sentiment: 'negative',
    dominantEmotion: 'anxiety',
    platforms: ['x', 'telegram', 'reddit'],
    communityName: 'Urban Transit Network',
    sparkline: [12, 19, 34, 48, 85, 142, 290, 480],
    isAccelerating: true,
    x: 82, // High volume
    y: 88, // Very high acceleration
    radius: 28
  },
  {
    id: 'NAR-02',
    name: 'Emergency Healthcare Ordinance Debate',
    volume: 2812,
    accelerationPct: 184,
    sentiment: 'neutral',
    dominantEmotion: 'opposition',
    platforms: ['x', 'reddit', 'youtube'],
    communityName: 'Medical Policy Forum',
    sparkline: [22, 28, 45, 60, 92, 115, 178, 230],
    isAccelerating: true,
    x: 64, // Medium-high volume
    y: 65, // High acceleration
    radius: 22
  },
  {
    id: 'NAR-03',
    name: 'Municipal Cleanliness & Waste Route Overhaul',
    volume: 1420,
    accelerationPct: 96,
    sentiment: 'positive',
    dominantEmotion: 'supportive',
    platforms: ['x', 'telegram'],
    communityName: 'Citizen Action Hub',
    sparkline: [15, 18, 24, 30, 42, 58, 80, 112],
    isAccelerating: false,
    x: 38, // Medium volume
    y: 42, // Moderate acceleration
    radius: 16
  },
  {
    id: 'NAR-04',
    name: 'Secondary Education Tech Infrastructure Pilot',
    volume: 980,
    accelerationPct: 74,
    sentiment: 'neutral',
    dominantEmotion: 'excitement',
    platforms: ['youtube', 'reddit'],
    communityName: 'Academic Reform Guild',
    sparkline: [8, 12, 15, 22, 35, 48, 62, 79],
    isAccelerating: false,
    x: 28, // Lower volume
    y: 35, // Moderate acceleration
    radius: 14
  },
  {
    id: 'NAR-05',
    name: 'Carpool Inter-City Coordination Protocol',
    volume: 640,
    accelerationPct: 245,
    sentiment: 'positive',
    dominantEmotion: 'supportive',
    platforms: ['telegram', 'reddit'],
    communityName: 'Commuter Mutual Aid',
    sparkline: [4, 6, 12, 18, 38, 75, 140, 210],
    isAccelerating: true,
    x: 22, // Early volume
    y: 78, // High breakout acceleration
    radius: 13
  },
  {
    id: 'NAR-06',
    name: 'Surge Pricing Anti-Gouging Petitions',
    volume: 1890,
    accelerationPct: 142,
    sentiment: 'negative',
    dominantEmotion: 'opposition',
    platforms: ['x', 'reddit'],
    communityName: 'Consumer Rights Group',
    sparkline: [18, 24, 32, 54, 88, 120, 160, 195],
    isAccelerating: true,
    x: 48, // Moderate volume
    y: 58, // Solid acceleration
    radius: 18
  }
];
