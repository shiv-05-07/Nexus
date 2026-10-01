import { TimelineEvent } from '../../types/nexus';

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'EVT-1089',
    timestamp: '2026-10-01T08:42:08Z',
    timeFormatted: '12:42:08',
    platform: 'reddit',
    topicId: 'NAR-01',
    topicName: 'Public Transport Strike & Fare Revision',
    authorHandle: 'u/CommuterVoice_HQ',
    authorAlias: 'Civic Mobility Observer',
    content: 'All feeder routes connected to the Central interchange are effectively suspended. Feeder minibuses are demanding 3x spot fares while cab aggregators show surge multiplier > 4.2x.',
    sentiment: 'negative',
    emotion: 'anxiety',
    engagement: {
      likes: 342,
      reposts: 88,
      comments: 119,
      views: 4800
    },
    reachScore: 8.9,
    verified: true
  },
  {
    id: 'EVT-1088',
    timestamp: '2026-10-01T08:41:52Z',
    timeFormatted: '12:41:52',
    platform: 'telegram',
    topicId: 'NAR-01',
    topicName: 'Public Transport Strike & Fare Revision',
    authorHandle: 'MetroOperatorsCouncil',
    authorAlias: 'Union Press Desk',
    content: 'Delegate committee has assembled outside the Transport Directorate for urgent tripartite deliberation. We remain open to structured settlement if fuel allowances are indexed.',
    sentiment: 'neutral',
    emotion: 'supportive',
    engagement: {
      likes: 182,
      reposts: 240,
      comments: 41,
      views: 9200
    },
    reachScore: 9.2,
    verified: true
  },
  {
    id: 'EVT-1087',
    timestamp: '2026-10-01T08:38:15Z',
    timeFormatted: '12:38:15',
    platform: 'x',
    topicId: 'NAR-01',
    topicName: 'Public Transport Strike & Fare Revision',
    authorHandle: '@urban_pulse_in',
    authorAlias: 'Urban Dispatch',
    content: 'Visuals from Terminal 3 show thousands stranded under heavy midday sun. Office workers forming spontaneous ride-share carpool circles via local community channels.',
    sentiment: 'negative',
    emotion: 'anxiety',
    engagement: {
      likes: 890,
      reposts: 412,
      comments: 204,
      views: 18400
    },
    reachScore: 9.6,
    verified: false
  },
  {
    id: 'EVT-1086',
    timestamp: '2026-10-01T08:34:40Z',
    timeFormatted: '12:34:40',
    platform: 'youtube',
    topicId: 'NAR-02',
    topicName: 'Emergency Healthcare Ordinance Debate',
    authorHandle: 'PolicyDeepDiveMedia',
    authorAlias: 'Policy Analysis Stream',
    content: 'Special livestream breakdown: Clause 14 of the new pharmaceutical procurement standard and how regional distributor margins could shift over Q4.',
    sentiment: 'neutral',
    emotion: 'opposition',
    engagement: {
      likes: 450,
      reposts: 76,
      comments: 88,
      views: 6200
    },
    reachScore: 7.4,
    verified: true
  },
  {
    id: 'EVT-1085',
    timestamp: '2026-10-01T08:29:10Z',
    timeFormatted: '12:29:10',
    platform: 'x',
    topicId: 'NAR-03',
    topicName: 'Municipal Cleanliness & Waste Route Overhaul',
    authorHandle: '@CitizenActionWard7',
    authorAlias: 'Ward 7 Civic Group',
    content: 'New segregated disposal trucks arrived at 07:45 sharp. Volunteer marshals helped educate household clusters on organic separation. Smooth progress today.',
    sentiment: 'positive',
    emotion: 'supportive',
    engagement: {
      likes: 215,
      reposts: 42,
      comments: 18,
      views: 3100
    },
    reachScore: 6.1,
    verified: false
  },
  {
    id: 'EVT-1084',
    timestamp: '2026-10-01T08:21:05Z',
    timeFormatted: '12:21:05',
    platform: 'reddit',
    topicId: 'NAR-01',
    topicName: 'Public Transport Strike & Fare Revision',
    authorHandle: 'u/TechWorkerExpress',
    authorAlias: 'IT Corridor Representative',
    content: 'Tech park bus fleets are volunteering shuttle services between East Campus and Main Metro Station to alleviate morning bottlenecks. No ticket charges.',
    sentiment: 'positive',
    emotion: 'supportive',
    engagement: {
      likes: 520,
      reposts: 95,
      comments: 64,
      views: 7900
    },
    reachScore: 7.9,
    verified: false
  },
  {
    id: 'EVT-1083',
    timestamp: '2026-10-01T08:14:22Z',
    timeFormatted: '12:14:22',
    platform: 'telegram',
    topicId: 'NAR-01',
    topicName: 'Public Transport Strike & Fare Revision',
    authorHandle: 'CityAlertChannel',
    authorAlias: 'Emergency Alert Bot',
    content: 'Traffic Advisory: Ring Road Corridor 2 congested due to stationary depot vehicles. Commuters advised to utilize suburban rail lines where capacity remains regular.',
    sentiment: 'neutral',
    emotion: 'anxiety',
    engagement: {
      likes: 310,
      reposts: 180,
      comments: 29,
      views: 11400
    },
    reachScore: 8.5,
    verified: true
  },
  {
    id: 'EVT-1082',
    timestamp: '2026-10-01T08:06:50Z',
    timeFormatted: '12:06:50',
    platform: 'x',
    topicId: 'NAR-02',
    topicName: 'Emergency Healthcare Ordinance Debate',
    authorHandle: '@MedicalFrontVoice',
    authorAlias: 'Physicians Guild',
    content: 'Formal statement submitted to Health Ministry: Any revision to drug buffer stocks must protect pediatric formulary allocations first.',
    sentiment: 'neutral',
    emotion: 'opposition',
    engagement: {
      likes: 670,
      reposts: 215,
      comments: 92,
      views: 14200
    },
    reachScore: 8.8,
    verified: true
  },
  {
    id: 'EVT-1081',
    timestamp: '2026-10-01T07:55:18Z',
    timeFormatted: '11:55:18',
    platform: 'youtube',
    topicId: 'NAR-04',
    topicName: 'Secondary Education Tech Infrastructure Pilot',
    authorHandle: 'DistrictClassroomsToday',
    authorAlias: 'Ed Reform Channel',
    content: 'Classroom vlog: First week of digital tablet test in rural school block 4. Teachers report 98% lesson engagement improvement.',
    sentiment: 'positive',
    emotion: 'excitement',
    engagement: {
      likes: 890,
      reposts: 120,
      comments: 145,
      views: 16500
    },
    reachScore: 7.6,
    verified: false
  },
  {
    id: 'EVT-1080',
    timestamp: '2026-10-01T07:44:02Z',
    timeFormatted: '11:44:02',
    platform: 'x',
    topicId: 'NAR-01',
    topicName: 'Public Transport Strike & Fare Revision',
    authorHandle: '@sarcastic_commuter',
    authorAlias: 'Daily Satirist',
    content: 'Another day, another historic opportunity to burn calories by walking 14 kilometers through unpaved expressways. Thank you transport authority for prioritizing my fitness!',
    sentiment: 'negative',
    emotion: 'sarcasm',
    engagement: {
      likes: 1420,
      reposts: 380,
      comments: 168,
      views: 29000
    },
    reachScore: 9.1,
    verified: false
  }
];
