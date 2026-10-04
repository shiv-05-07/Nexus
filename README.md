# NEXUS

> **Cross-Platform Social Intelligence & Narrative Analytics Workspace**

NEXUS is an analytical workspace engineered to convert fragmented, multi-platform public discourse into structured, auditable social intelligence. The platform unifies discourse across **X (Twitter)**, **Telegram**, **Reddit**, and **YouTube**, providing analysts with temporal signal tracking, sentiment and emotion aggregation, narrative acceleration metrics, structural graph intelligence, and role-enforced signal verification.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791.svg)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748.svg)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Prototype_Status-Audited_%26_Verified-success.svg)]()

---

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Problem Statement & Analytical Value](#2-problem-statement--analytical-value)
- [3. Current Prototype Architecture & Data Grounding](#3-current-prototype-architecture--data-grounding)
- [4. System Architecture](#4-system-architecture)
- [5. User Flow & Analytical Journey](#5-user-flow--analytical-journey)
- [6. Core Analytical Capabilities](#6-core-analytical-capabilities)
  - [6.1 Overview Workspace](#61-overview-workspace)
  - [6.2 Chronological Timeline Investigation](#62-chronological-timeline-investigation)
  - [6.3 Sentiment & Emotion Intelligence](#63-sentiment--emotion-intelligence)
  - [6.4 Emerging Narratives & Acceleration Analytics](#64-emerging-narratives--acceleration-analytics)
  - [6.5 Network Intelligence & Graph Algorithms](#65-network-intelligence--graph-algorithms)
  - [6.6 Temporal Anchoring & Platform Filtering](#66-temporal-anchoring--platform-filtering)
  - [6.7 Role-Based Access Control (RBAC) & Signal Verification](#67-role-based-access-control-rbac--signal-verification)
- [7. Analytics Engine & Mathematical Formulations](#7-analytics-engine--mathematical-formulations)
  - [7.1 Narrative Growth & Acceleration Formulas](#71-narrative-growth--acceleration-formulas)
  - [7.2 PageRank Power Method Algorithm](#72-pagerank-power-method-algorithm)
  - [7.3 Brandes' Betweenness Centrality Algorithm](#73-brandes-betweenness-centrality-algorithm)
  - [7.4 Structural Bridge Node Classification](#74-structural-bridge-node-classification)
- [8. Relational Database Schema](#8-relational-database-schema)
- [9. Seed Dataset & Deterministic Reproduction](#9-seed-dataset--deterministic-reproduction)
- [10. REST API Specification](#10-rest-api-specification)
- [11. Technology Stack](#11-technology-stack)
- [12. Environment Variables](#12-environment-variables)
- [13. Local Setup & Quickstart Guide](#13-local-setup--quickstart-guide)
- [14. Repository Structure](#14-repository-structure)
- [15. Verification, Auditing & Testing Suite](#15-verification-auditing--testing-suite)
- [16. Security, Privacy & Synthetic Provenance](#16-security-privacy--synthetic-provenance)
- [17. Current Limitations & Prototype Boundaries](#17-current-limitations--prototype-boundaries)
- [18. Future Vision & Engineering Roadmap](#18-future-vision--engineering-roadmap)
- [19. Contributing & Development Standards](#19-contributing--development-standards)
- [20. License](#20-license)

---

## 1. Executive Summary

NEXUS provides decision-makers and intelligence analysts with a single pane of glass to monitor civic and public events as they unfold across heterogeneous platforms. Instead of manually cross-referencing disparate social networks, analysts use NEXUS to:

1. **Observe macro trends:** Monitor post volume spikes, sentiment composition, and emotional resonance across platforms.
2. **Track narrative velocity:** Identify emerging discussions, measure acceleration rates, and detect when local chatter crosses into mainstream channels.
3. **Analyze interaction topology:** Discover key community hubs, structural bridge nodes, and cross-platform information flows using network centrality algorithms.
4. **Investigate micro evidence:** Drill down from macro charts directly into individual dispatches, author profiles, and engagement telemetry.
5. **Enforce chain-of-custody:** Formally verify ground-truth records and confirm emerging operational signals under role-based authorization constraints.

---

## 2. Problem Statement & Analytical Value

Modern information environments present critical challenges for analysts and civic response teams:

| Challenge | Impact on Traditional Analysis | How NEXUS Solves It |
|---|---|---|
| **Platform Fragmentation** | Critical signals are siloed across microblogs (X), broadcast channels (Telegram), forums (Reddit), and video commentary (YouTube). | Normalizes cross-platform metadata into a unified relational schema. |
| **Volume vs. Velocity** | High-volume topics drown out rapidly accelerating low-volume early warnings. | Calculates both gross volume and 2nd-order acceleration curves ($A = V_{\text{recent}} / V_{\text{early}}$). |
| **Superficial Sentiment** | Binary positive/negative scoring obscures specific public distress signals. | Tracks 3-way sentiment polarity alongside 5 granular emotional dimensions (Anxiety, Supportive, Opposition, Excitement, Sarcasm). |
| **Opaque Influence** | Vanity metrics (follower counts) fail to reveal structural information conduits. | Executes **PageRank** and **Brandes Betweenness Centrality** to identify structural bridge nodes connecting distinct communities. |
| **Lack of Verification Workflow** | Unvetted data enters reports without analyst audit trails. | Implements server-enforced record verification and signal confirmation workflows with role clearance tiers. |

---

## 3. Current Prototype Architecture & Data Grounding

> **Engineering Grounding Note:**  
> The current version of NEXUS is a fully functional, self-contained prototype powered by a **reproducible, deterministic synthetic dataset** seeded in **PostgreSQL / Supabase via Prisma ORM**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      NEXUS DATA & EXECUTION PIPELINE                    │
└────────────────────────────────────────────────────────────────────────┘

  [ Deterministic Seed Generator (Mulberry32 PRNG Seed: 987654321) ]
                                 │
                                 ▼
         [ Supabase / PostgreSQL Database (Prisma ORM) ]
          ├── 100 User Nodes (4 Platforms, 4 Communities)
          ├── 1,000 Verified Post Dispatches
          ├── 8 Tracked Topics & Narratives
          ├── 2,500 Interaction Engagements
          └── 200 Directed Network Edges
                                 │
                                 ▼
          [ Backend Analytics Services (Node.js 22 / Express) ]
          ├── OverviewService     (Aggregation, KPI metrics, Sparklines)
          ├── TimelineService     (Filtering, Search, Pagination)
          ├── SentimentService    (Time series, Emotion delta, Platform matrix)
          ├── TrendService        (Volume ranking, Acceleration formula, 2D Scatter)
          └── NetworkService      (PageRank, Brandes Betweenness, Bridge Detection)
                                 │
                                 ▼
                     [ Express REST API (/api/*) ]
          ├── GET  /api/health
          ├── GET  /api/overview
          ├── GET  /api/timeline
          ├── GET  /api/sentiment
          ├── GET  /api/trends
          ├── GET  /api/network
          ├── GET  /api/profile & POST /api/profile/role
          └── POST /api/signals/confirm & POST /api/records/verify (RBAC Protected)
                                 │
                                 ▼
                   [ Frontend Client (React 19 / Vite) ]
          ├── Navigation Rail & Header Horizon/Platform Controls
          ├── Overview Workspace & KPI Cards
          ├── Chronological Dispatch Stream & Search Bar
          ├── Sentiment Donut, Trends Area Chart & Emotion Radar
          ├── 2D Scatter Velocity Landscape
          ├── Network Graph (800x520 Deterministic Layout with Zoom/Pan)
          └── Unified Slide-Over Detail Drawer (Signal Confirmation & Record Audit)
```

- **No Unimplemented Scraping Claims:** The prototype does not perform unauthenticated live scraping of external social platforms. All analysis executes against verified, auditable database records.
- **Stored Sentiment/Emotion Attributes:** Sentiment and emotion values are stored on seeded `Post` entities and aggregated dynamically across time windows by backend SQL/Prisma pipelines.
- **Deterministic Math:** Graph positions and analytical sparklines are generated through deterministic mathematical formulas, ensuring consistent demonstration and auditing.

---

## 4. System Architecture

NEXUS is organized as a full-stack TypeScript application with a clear separation between frontend presentation, backend domain services, and database persistence.

```mermaid
graph TD
    subgraph Client ["Frontend Client (React 19 + TypeScript + Vite)"]
        UI["AppShell & Navigation Rail"]
        P1["Overview Page"]
        P2["Timeline Page"]
        P3["Sentiment Page"]
        P4["Trends Page"]
        P5["Network Page"]
        Drawer["Detail Drawer (Inspector & Actions)"]
        APIClient["nexusApi Client Abstraction"]
    end

    subgraph Server ["Backend Application (Node.js 22 + Express)"]
        Router["Express Router (/api/*)"]
        AuthMid["RBAC & Role Verification Middleware"]
        OS["OverviewService"]
        TS["TimelineService"]
        SS["SentimentService"]
        TRS["TrendService"]
        NS["NetworkService"]
        PS["ProfileService & Action Handler"]
    end

    subgraph Persistence ["Persistence Layer (PostgreSQL / Supabase)"]
        PrismaClient["Prisma ORM Client"]
        DB[(PostgreSQL Database)]
    end

    UI --> P1 & P2 & P3 & P4 & P5
    P1 & P2 & P3 & P4 & P5 --> Drawer
    P1 & P2 & P3 & P4 & P5 & Drawer --> APIClient
    APIClient -- "HTTP / JSON (x-user-role header)" --> Router

    Router --> AuthMid
    AuthMid --> OS & TS & SS & TRS & NS & PS

    OS & TS & SS & TRS & NS & PS --> PrismaClient
    PrismaClient --> DB
```

---

## 5. User Flow & Analytical Journey

The platform supports a continuous drill-down workflow from macro intelligence to atomic verification:

```mermaid
flowchart TD
    Start(["Launch NEXUS Workspace"]) --> Step1["Set Global Filters (Platform & Time Horizon)"]
    Step1 --> OverviewTab["Inspect Overview Dashboard"]
    
    OverviewTab -->|Examine Macro KPIs| SentimentBreakdown["Review Sentiment Polarity & Emotion Balance"]
    OverviewTab -->|Detect Emerging Spikes| TrendLandscape["Explore Narrative Velocity in Trends Tab"]
    OverviewTab -->|Analyze Cross-Community Chatter| NetworkGraph["Investigate Interaction Graph in Network Tab"]
    
    TrendLandscape --> SelectNarrative["Select Narrative from Scatter / List"]
    SelectNarrative --> DrawerNarrative["Open Detail Drawer: Review Growth % & Top Quotes"]
    DrawerNarrative --> ConfirmSignal{"Analyst / Lead Analyst Clearance?"}
    ConfirmSignal -- "Yes (Analyst / Lead)" --> ConfirmSuccess["Confirm Signal (Status: Confirmed)"]
    ConfirmSignal -- "No (Viewer)" --> ForbiddenSignal["HTTP 403 Forbidden (Blocked)"]

    NetworkGraph --> SelectNode["Click Influential Node or Bridge Node"]
    SelectNode --> DrawerNode["Inspect PageRank, Betweenness & Recent Topics"]

    OverviewTab --> TimelineTab["Navigate to Timeline Feed"]
    TimelineTab --> SearchTimeline["Filter by Keyword, Sentiment, Topic, Platform"]
    SearchTimeline --> SelectPost["Select Dispatch Record"]
    SelectPost --> DrawerPost["Inspect Author, Metrics & Verification Status"]
    DrawerPost --> VerifyRecord{"Analyst / Lead Analyst Clearance?"}
    VerifyRecord -- "Yes (Analyst / Lead)" --> VerifySuccess["Formally Verify Record in Database"]
    VerifyRecord -- "No (Viewer)" --> ForbiddenRecord["HTTP 403 Forbidden (Blocked)"]
```

---

## 6. Core Analytical Capabilities

### 6.1 Overview Workspace
- **Executive Summary KPIs:** Total post volume, active topic count, peak emerging growth percentage, and negative sentiment balance.
- **Emerging Narratives Table:** Top active topics ranked by engagement, complete with 8-bucket sparklines, platform badges, dominant sentiment, and growth metrics.
- **Sentiment & Emotion Donut:** Real-time breakdown of positive, neutral, and negative post proportions.
- **Linguistic & Regional Syntax:** Breakdown derived directly from database post syntax and community node cluster distribution (with zero demographic fabrication).

### 6.2 Chronological Timeline Investigation
- **Live Dispatch Stream:** Chronological feed of post dispatches with platform indicators (X, Telegram, Reddit, YouTube), author handles, and timestamps.
- **Multi-Parameter Filtering:** Simultaneous filtering by platform, sentiment, topic, and keyword search.
- **Full-Text Case-Insensitive Search:** Queries post body, author handle, author display name, and topic title.
- **Engagement & Reach Telemetry:** Displays likes, reposts, comments, views, and calculated `reachScore`.
- **Record Verification Badges:** Visual indicators denoting whether a post record has been vetted.

### 6.3 Sentiment & Emotion Intelligence
- **Sentiment Composition:** Percentage distribution of Positive, Neutral, and Negative posts.
- **Bucketed Time-Series Trends:** Visualizes sentiment shifts over time using adaptive temporal buckets (10m, 1h, 6h, 24h, 7d, 30d).
- **5-Dimensional Emotion Distribution:**
  1. **Anxiety & Commuter Distress:** Service disruption alerts and safety concerns.
  2. **Supportive & Community Coordination:** Mutual aid, carpool coordination, route guidance.
  3. **Opposition & Policy Pushback:** Administrative critique, fare revision pushback, union statements.
  4. **Excitement & Reform Optimism:** Modernization reception and positive feedback.
  5. **Sarcasm & Public Irony:** Parody commentary and satire.
- **Cross-Platform Comparative Matrix:** Side-by-side sentiment comparison across X, Telegram, Reddit, and YouTube.

### 6.4 Emerging Narratives & Acceleration Analytics
- **2D Velocity Scatter Landscape:** Plots topics across **Volume (X-axis)** versus **Acceleration Rate (Y-axis)**, with bubble radius mapped to total volume.
- **Ranked Narrative Cards:** Summary descriptions, primary community affiliations, platform footprints, and temporal sparklines.
- **Acceleration Alert Indicators:** Visual badge highlighting topics where recent volume exceeds earlier volume by $>20\%$.

### 6.5 Network Intelligence & Graph Algorithms
- **Directed Multi-Platform Graph:** Visualizes 100 user nodes and 200 interaction edges on an interactive canvas with zoom, pan, and search controls.
- **PageRank Centrality:** Quantifies structural prestige and information propagation capacity.
- **Brandes Betweenness Centrality:** Quantifies how often a node falls on the shortest path between other nodes.
- **Structural Bridge Node Detection:** Identifies nodes facilitating communication across distinct community clusters.
- **Community Clustering:** 4 pre-configured communities with distinct spatial anchors:
  - Transit & Commuter Groups (North-West)
  - Municipal & Operator Councils (North-East)
  - Civic & Policy Watchdogs (South-West)
  - Media & Dispatch Outlets (South-East)

### 6.6 Temporal Anchoring & Platform Filtering
- **Supported Time Horizons:** `10m`, `1h`, `6h`, `24h`, `7d`, `30d`.
- **Database Reference Anchoring:** Filters are anchored to the timestamp of the latest record in the database ($T_{\text{ref}}$) rather than client system clock, ensuring consistent reproduction of historical datasets.
- **Supported Platforms:** `All`, `X`, `Telegram`, `Reddit`, `YouTube`.

### 6.7 Role-Based Access Control (RBAC) & Signal Verification
NEXUS enforces three operational roles:

| Role | Callsign | Clearance | View Intelligence | Confirm Signals | Verify Records | Export Data |
|---|---|---|:---:|:---:|:---:|:---:|
| **Lead Analyst** | `AN-9042` | `SEC-04` | Yes | **Yes** | **Yes** | Yes |
| **Analyst** | `AN-5120` | `SEC-02` | Yes | **Yes** | **Yes** | Yes |
| **Viewer (Read-Only)** | `RO-0104` | `READ-ONLY` | Yes | **No (403)** | **No (403)** | No |

- **Server-Side Enforcement:** Attempting to confirm a signal or verify a record under the `viewer` role triggers an immediate HTTP `403 Forbidden` (`ROLE_UNAUTHORIZED`).

---

## 7. Analytics Engine & Mathematical Formulations

### 7.1 Narrative Growth & Acceleration Formulas

To identify rapidly developing events, the time window $W = [T_{\text{start}}, T_{\text{ref}}]$ is partitioned into $N = 8$ contiguous buckets.

$$\text{Early Volume } (V_{\text{early}}) = \sum_{i=0}^{3} \text{Bucket}_i, \quad \text{Recent Volume } (V_{\text{recent}}) = \sum_{i=4}^{7} \text{Bucket}_i$$

$$\text{Growth Percentage } (\Delta_{\text{growth}}) = \begin{cases} \left(\frac{V_{\text{recent}} - V_{\text{early}}}{V_{\text{early}}}\right) \times 100 & \text{if } V_{\text{early}} > 0 \\ 100\% & \text{if } V_{\text{early}} = 0 \text{ and } V_{\text{recent}} > 0 \\ 0\% & \text{otherwise} \end{cases}$$

$$\text{Acceleration Score } (S_{\text{accel}}) = \begin{cases} \frac{V_{\text{recent}}}{V_{\text{early}}} & \text{if } V_{\text{early}} > 0 \\ 1.0 & \text{if } V_{\text{early}} = 0 \text{ and } V_{\text{recent}} > 0 \\ 0.0 & \text{otherwise} \end{cases}$$

A topic is flagged with `isAccelerating = true` if $\Delta_{\text{growth}} > 20\%$ and $V_{\text{recent}} \ge V_{\text{early}}$.

---

### 7.2 PageRank Power Method Algorithm

Calculates prestige over directed, weighted interaction edges using the iterative power method:

$$PR^{(t+1)}(u) = \frac{1 - d}{|V|} + d \left( \sum_{v \in \text{In}(u)} \frac{PR^{(t)}(v) \cdot w(v, u)}{\sum_{k \in \text{Out}(v)} w(v, k)} + \frac{\sum_{m \in \text{Dangling}} PR^{(t)}(m)}{|V|} \right)$$

- **Damping Factor ($d$):** $0.85$
- **Termination Criteria:** Maximum $40$ iterations or maximum delta $\Delta_{\max} < 10^{-5}$.

---

### 7.3 Brandes' Betweenness Centrality Algorithm

Calculates shortest-path vertex betweenness centrality in $\mathcal{O}(|V| \cdot |E|)$ time:

$$C_B(v) = \sum_{s \neq v \neq t \in V} \frac{\sigma_{st}(v)}{\sigma_{st}}$$

Normalized for directed graphs by:

$$C'_B(v) = \frac{C_B(v)}{(|V| - 1)(|V| - 2)}$$

---

### 7.4 Structural Bridge Node Classification

A node $u$ is classified as a structural bridge (`isBridge = true`) if and only if:
1. **Cross-Community Span:** Node $u$ possesses directed interaction links to at least one user assigned to a different community cluster ($\text{Community}(u) \neq \text{Community}(v)$).
2. **Centrality Threshold:** $C'_B(u) \ge \max(0.04, P_{70}(C'_B))$, where $P_{70}$ is the 70th percentile betweenness score of all active nodes in the temporal window.

> **Important Analytical Distinction:**  
> Bridge nodes are structural graph entities that connect disparate interaction clusters. They do not automatically imply malicious coordination or administrative intent.

---

## 8. Relational Database Schema

The database is defined using Prisma ORM on PostgreSQL with strict relational integrity and foreign-key constraints.

```mermaid
erDiagram
    COMMUNITY ||--o{ USER : "groups"
    USER ||--o{ POST : "authors"
    TOPIC ||--o{ POST : "categorizes"
    POST ||--o{ POST : "parent/replies"
    USER ||--o{ ENGAGEMENT : "acts"
    USER ||--o{ ENGAGEMENT : "targets"
    POST ||--o{ ENGAGEMENT : "receives"
    USER ||--o{ NETWORK_EDGE : "sources"
    USER ||--o{ NETWORK_EDGE : "targets"

    COMMUNITY {
        string id PK
        string slug UK
        string name
        string description
        string color
        boolean isSynthetic
    }

    TOPIC {
        string id PK
        string slug UK
        string name
        string description
        datetime firstObservedAt
        datetime lastObservedAt
        boolean isSynthetic
    }

    USER {
        string id PK
        enum platform "X | TELEGRAM | REDDIT | YOUTUBE"
        string platformUserId
        string handle
        string displayName
        string alias
        string avatarColor
        boolean verified
        string role
        string communityId FK
        boolean isSynthetic
    }

    POST {
        string id PK
        enum platform "X | TELEGRAM | REDDIT | YOUTUBE"
        string platformPostId
        string authorId FK
        string content
        string topicId FK
        datetime createdAt
        datetime collectedAt
        int likesCount
        int repostsCount
        int commentsCount
        int viewsCount
        float reachScore
        enum sentiment "POSITIVE | NEUTRAL | NEGATIVE"
        float sentimentScore
        enum emotion "ANXIETY | EXCITEMENT | SUPPORTIVE | OPPOSITION | SARCASM"
        float emotionScore
        string language
        boolean isSynthetic
    }

    ENGAGEMENT {
        string id PK
        string postId FK
        string actorUserId FK
        string targetUserId FK
        enum interactionType "LIKE | REPOST | REPLY | MENTION | QUOTE | SHARE"
        enum platform
        datetime createdAt
    }

    NETWORK_EDGE {
        string id PK
        string sourceUserId FK
        string targetUserId FK
        enum platform
        enum interactionType
        float weight
        datetime occurredAt
    }
```

---

## 9. Seed Dataset & Deterministic Reproduction

The prototype dataset is created via `prisma/seed.ts` using a custom **Mulberry32 pseudorandom number generator (PRNG)** initialized with seed `987654321`. This ensures identical, auditable database state across fresh installations.

| Entity | Quantity | Description / Distribution |
|---|---|---|
| **Users** | `100` | Distributed across 4 platforms (Telegram: 31, Reddit: 25, X: 24, YouTube: 20) and 4 communities. |
| **Posts** | `1,000` | Seeded with realistic timestamps over a 30-day window anchored at `2026-10-01T09:00:00Z`. |
| **Topics** | `8` | 8 distinct civic topics (Transit Strike, Emergency Health Ordinance, Cleanliness Overhaul, etc.). |
| **Communities** | `4` | Transit & Commuter Groups, Municipal Councils, Civic Watchdogs, Media Outlets. |
| **Engagements** | `2,500` | Likes, reposts, replies, quotes, mentions across users and posts. |
| **Network Edges** | `200` | Directed, weighted edges connecting user nodes across platforms. |

---

## 10. REST API Specification

All backend endpoints are prefixed with `/api`.

### 10.1 System & Health

#### `GET /api/health`
Probes database connectivity and returns service status.
- **Auth:** None
- **Response:**
  ```json
  {
    "status": "ok",
    "service": "NEXUS Intelligence API",
    "database": "connected",
    "metrics": { "monitoredUsers": 100 },
    "timestamp": "2026-10-04T10:00:00.000Z"
  }
  ```

---

### 10.2 Analytics & Exploration

#### `GET /api/overview`
Retrieves executive summary metrics, emerging narratives, sentiment breakdown, and community summaries.
- **Query Parameters:**
  - `timeRange` or `timeFilter`: `10m` | `1h` | `6h` | `24h` | `7d` | `30d` (default: `24h`)
  - `platform`: `all` | `x` | `telegram` | `reddit` | `youtube` (default: `all`)
- **Response:** Object containing `metrics`, `narratives`, `sentimentBreakdown`, `audience`, and `networkSummary`.

#### `GET /api/timeline`
Retrieves chronological post dispatches with filtering and pagination.
- **Query Parameters:**
  - `platform`: `all` | `x` | `telegram` | `reddit` | `youtube`
  - `sentiment`: `all` | `positive` | `neutral` | `negative`
  - `topicId`: Topic slug or ID
  - `searchQuery` / `search` / `q`: Keyword query
  - `timeRange` / `timeFilter`: `10m` | `1h` | `6h` | `24h` | `7d` | `30d`
  - `limit`: Integer (default: `50`, max: `200`)
  - `offset`: Integer (default: `0`)
- **Response:**
  ```json
  {
    "items": [
      {
        "id": "post_00001",
        "timestamp": "2026-09-29T18:45:00.000Z",
        "timeFormatted": "18:45:00",
        "platform": "reddit",
        "topicId": "nar-02",
        "topicName": "Emergency Healthcare Ordinance Debate",
        "authorHandle": "u/CivicHealthObserver",
        "content": "New pharmaceutical procurement guidelines require immediate scrutiny...",
        "sentiment": "negative",
        "emotion": "opposition",
        "engagement": { "likes": 42, "reposts": 12, "comments": 8, "views": 1420 },
        "reachScore": 84.5,
        "verified": true
      }
    ],
    "total": 331,
    "limit": 50,
    "offset": 0
  }
  ```

#### `GET /api/sentiment`
Retrieves complete sentiment intelligence payload, or sub-resources via `type` parameter (`composition`, `trends`, `emotions`, `platforms`).
- **Query Parameters:** `timeRange`, `platform`, `type`
- **Response:** Object containing `composition`, `trends` (time series), `emotions` (with half-window delta), and `platformComparison`.

#### `GET /api/trends`
Retrieves all active topics with volume, acceleration percentage, 2D scatter coordinates, and 8-point sparklines.
- **Query Parameters:** `timeRange`, `platform`
- **Response:** Array of `TrendItemResult` objects sorted by volume descending.

#### `GET /api/network`
Retrieves the complete interaction graph dataset.
- **Query Parameters:** `timeRange`, `platform`
- **Response:**
  ```json
  {
    "nodes": [ ... ],
    "edges": [ ... ],
    "communities": [ ... ],
    "summary": {
      "activeCommunities": 4,
      "monitoredNodes": 100,
      "interactionLinks": 200,
      "bridgeNodes": 12
    }
  }
  ```

---

### 10.3 Profile & Action Verification (RBAC Protected)

#### `GET /api/profile`
Returns active user profile, assigned role, callsign, clearance, and permission flags.
- **Headers:** `x-user-role: lead_analyst | analyst | viewer`

#### `POST /api/profile/role`
Switches active operational role for the current session.
- **Body:** `{ "role": "lead_analyst" | "analyst" | "viewer" }`

#### `POST /api/signals/confirm`
Formally confirms an emerging topic/signal.
- **Headers:** `x-user-role: lead_analyst | analyst | viewer`
- **Body:** `{ "signalId": "nar-01" }`
- **RBAC Rule:** Returns **HTTP 403 Forbidden** if caller is `viewer`.

#### `POST /api/records/verify`
Formally verifies a chronological dispatch record in the database.
- **Headers:** `x-user-role: lead_analyst | analyst | viewer`
- **Body:** `{ "recordId": "post_00001" }`
- **RBAC Rule:** Returns **HTTP 403 Forbidden** if caller is `viewer`.

---

## 11. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React | `19.0.1` | Declarative UI rendering & state management |
| **Language** | TypeScript | `7.0.2` | End-to-end static type safety |
| **Bundler & Dev Server** | Vite | `8.3.0` | Fast client compilation & middleware integration |
| **Styling** | Tailwind CSS | `4.3.3` | Modern utility-first styling architecture |
| **Animations** | Motion (`motion/react`) | `12.23.24` | Fluid UI layout transitions and tab fades |
| **Icons** | Lucide React | `0.546.0` | Crisp, semantic SVG iconography |
| **Backend Runtime** | Node.js | `22.x` | High-performance asynchronous runtime |
| **Backend Server** | Express | `4.21.2` | REST API routing and middleware management |
| **TypeScript Execution** | `tsx` | `4.21.0` | Zero-config TypeScript execution for server/scripts |
| **Database ORM** | Prisma | `6.19.3` | Type-safe PostgreSQL client, schema, & migrations |
| **Database Engine** | PostgreSQL (Supabase) | `15+` | Relational persistence & connection pooling |

---

## 12. Environment Variables

Define the following environment variables in a `.env` file at the root of the project:

| Variable | Scope | Required | Purpose | Example / Format |
|---|---|:---:|---|---|
| `DATABASE_URL` | Server | **Yes** | Transaction-mode PostgreSQL connection pooler (port 6543) | `postgresql://postgres.[REF]:[PWD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | Server | **Yes** | Direct session connection for Prisma migrations (port 5432) | `postgresql://postgres.[REF]:[PWD]@aws-0-[REGION].pooler.supabase.com:5432/postgres` |
| `PORT` | Server | No | Port on which the unified Express server listens (default: `3000`) | `3000` |
| `NODE_ENV` | Server | No | Environment mode (`development` or `production`) | `development` |
| `APP_URL` | Server | No | Host URL for CORS allowlisting | `http://localhost:3000` |
| `CORS_ORIGIN` | Server | No | Additional explicit CORS origin | `http://localhost:5173` |
| `VITE_API_BASE_URL` | Client | No | Optional base URL if API is hosted on a separate origin | `https://api.nexus.domain` |

> **Security Reminder:** Never commit real database credentials or production secrets to version control.

---

## 13. Local Setup & Quickstart Guide

### Prerequisites
- **Node.js:** `v20.x` or `v22.x` (LTS recommended)
- **Package Manager:** `npm` (v10+)
- **PostgreSQL Database:** Supabase instance or local PostgreSQL instance.

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd NEXUS
npm install
```

### 2. Configure Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Edit `.env` and provide your valid `DATABASE_URL` and `DIRECT_URL`.

### 3. Initialize & Seed the Database
Push the Prisma schema to create all tables and run the deterministic seed generator:
```bash
# Push schema to PostgreSQL
npm run prisma:db-push

# Seed reproducible 1,000-post dataset
npm run prisma:seed
```

### 4. Run Development Server
Start the unified full-stack server (Express API + Vite SPA middleware on port 3000):
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 14. Repository Structure

```text
NEXUS/
├── .env.example                  # Environment variable reference template
├── .gitignore                    # Git ignore patterns
├── index.html                    # Single-page application HTML entrypoint
├── metadata.json                 # Applet metadata and environment permissions
├── package.json                  # Dependencies, scripts, and package config
├── tsconfig.json                 # Root TypeScript configuration
├── vite.config.ts                # Vite frontend bundler configuration
├── server.ts                     # Full-stack entry point (Express + Vite middlewares)
│
├── prisma/
│   ├── schema.prisma             # PostgreSQL data models and enum definitions
│   ├── seed.ts                   # Deterministic Mulberry32 seed generator
│   └── verify.ts                 # Database relational integrity verification script
│
├── backend/
│   ├── audit-network.ts          # Standalone network algorithm verification
│   ├── test-api.ts               # REST API endpoint test suite
│   ├── test-phase3f-access.ts    # RBAC and role permission verification tests
│   ├── test-phase4-e2e-audit.ts  # End-to-end truth matrix & service audit
│   └── src/
│       ├── app.ts                # Express application factory & route registration
│       ├── server.ts             # Standalone backend server entry point
│       ├── db/
│       │   └── prisma.ts         # Singleton Prisma client instance
│       ├── middleware/
│       │   ├── errorHandler.ts   # Centralized error handler middleware
│       │   └── notFound.ts       # 404 Not Found route handler
│       ├── routes/
│       │   ├── health.ts         # GET /api/health
│       │   ├── network.ts        # GET /api/network
│       │   ├── overview.ts       # GET /api/overview
│       │   ├── profile.ts        # /api/profile and RBAC action handlers
│       │   ├── sentiment.ts      # GET /api/sentiment (composition, trends, etc.)
│       │   ├── timeline.ts       # GET /api/timeline
│       │   └── trends.ts         # GET /api/trends
│       └── services/
│           ├── networkService.ts # PageRank, Betweenness & Bridge Node algorithms
│           ├── overviewService.ts# Macro KPI aggregation & narrative summaries
│           ├── sentimentService.ts# Sentiment time-series & emotion delta service
│           ├── timelineService.ts# Multi-criteria post query & pagination service
│           └── trendService.ts   # Velocity scoring & 2D scatter coordinates
│
└── src/                          # Frontend React Client
    ├── main.tsx                  # React DOM mount point
    ├── App.tsx                   # Top-level application component
    ├── index.css                 # Global CSS & Tailwind imports
    ├── types/
    │   └── nexus.ts              # Shared TypeScript interface definitions
    ├── services/
    │   └── api/
    │       └── nexusApi.ts       # Centralized frontend API client abstraction
    ├── pages/
    │   ├── OverviewPage.tsx      # Overview executive summary workspace
    │   ├── TimelinePage.tsx      # Chronological dispatch stream & filter page
    │   ├── SentimentPage.tsx     # Sentiment composition & emotion distribution
    │   ├── TrendsPage.tsx        # 2D velocity landscape & narrative rankings
    │   └── NetworkPage.tsx       # Interactive graph canvas with zoom/pan
    └── components/
        ├── common/
        │   ├── AnimatedNumber.tsx# Smooth numerical transition counter
        │   ├── EmptyState.tsx    # Fallback view for empty filter queries
        │   ├── PlatformBadge.tsx # Platform icon & color badge
        │   ├── SentimentBadge.tsx# Positive/Neutral/Negative visual indicator
        │   ├── SentimentDonut.tsx# SVG-rendered radial sentiment donut
        │   ├── SkeletonLoader.tsx# Loading state skeleton placeholders
        │   └── Sparkline.tsx     # 8-point SVG mini trendline component
        ├── drawers/
        │   └── DetailDrawer.tsx  # Deep inspector for narratives, nodes, and posts
        └── layout/
            ├── AppShell.tsx      # Core application shell & view coordinator
            ├── Header.tsx        # Horizon selector & platform filter controls
            └── Sidebar.tsx       # Navigation rail, profile switcher & provenance
```

---

## 15. Verification, Auditing & Testing Suite

NEXUS includes automated audit scripts to guarantee dataset consistency and RBAC security:

### 1. Database Ground Truth Verification
Validates table row counts and relational integrity:
```bash
npx tsx prisma/verify.ts
```

### 2. End-to-End Analytics Audit Matrix
Validates that every analytics service produces exact matching results against PostgreSQL:
```bash
npx tsx backend/test-phase4-e2e-audit.ts
```
*Validates 25/25 metrics across 10m, 1h, 6h, 24h, 7d, and 30d windows with 0 delta.*

### 3. Server-Side RBAC & Clearance Enforcement Tests
Validates that `viewer` requests receive `403 Forbidden` and `analyst`/`lead_analyst` succeed:
```bash
npx tsx backend/test-phase3f-access.ts
```

---

## 16. Security, Privacy & Synthetic Provenance

- **Zero PII Fabrication:** The prototype uses synthetic civic avatars and public handles (`@metro_watch`, `u/CivicHealthObserver`). No real-world private citizen data is collected or displayed.
- **Auditable Provenance:** Every record carries an `isSynthetic: true` flag in the schema, clearly distinguishing synthetic test records from potential future live data.
- **Server-Side Action Guardrails:** Mutation endpoints (`/api/signals/confirm`, `/api/records/verify`) validate the caller's operational role server-side, preventing unauthorized state modification.

---

## 17. Current Limitations & Prototype Boundaries

To ensure complete technical transparency during evaluation:

1. **Synthetic Seed Data:** The current repository operates over a reproducible 1,000-post synthetic dataset. It does not connect to live streaming social APIs.
2. **Stored Emotion & Sentiment:** Emotion and sentiment attributes are stored on post records and aggregated by SQL queries; real-time ML inference pipelines are not yet attached.
3. **Client-Assisted Role Switching:** Role clearance switching in the prototype interface is intended for demonstration and evaluation testing rather than multi-tenant OAuth/SAML authentication.
4. **Graph Coordinates:** Node positions are computed via cluster algorithms on an 800x520 canvas for visual graph clarity and do not represent geographic GPS coordinates.

---

## 18. Future Vision & Engineering Roadmap

```mermaid
timeline
    title NEXUS Platform Evolution
    Current Prototype : Deterministic Synthetic Multi-Platform Dataset
                      : PageRank & Betweenness Centrality Engine
                      : RBAC Signal & Record Verification Workflows
                      : Pure PostgreSQL/Prisma Analytical Services
    Phase 2 (Ingestion) : Apache Kafka / Redpanda Streaming Ingestion
                        : Live Webhook & API Connectors (X, Telegram, Reddit, YouTube)
                        : Deduplication & Cross-Platform Entity Resolution
    Phase 3 (AI / NLP) : Fine-Tuned Local LLM Emotion & Sarcasm Classification
                       : Dynamic Zero-Shot Topic Discovery & Clustering
                       : Automated Multimodal Media Analysis
    Phase 4 (Enterprise): Enterprise SAML / OIDC Single Sign-On
                        : Distributed Graph Analytics (Neo4j / GraphX)
                        : Geospatial Civic GIS Layer Integration
```

---

## 19. Contributing & Development Standards

### Development Workflow
1. Fork the repository and create a feature branch (`git checkout -b feature/analytics-enhancement`).
2. Adhere to strict TypeScript typing — no implicit `any`.
3. Verify that database queries maintain index coverage as defined in `prisma/schema.prisma`.
4. Ensure zero breaking changes across REST API contracts (`/api/*`).
5. Run the verification audit suite before submitting a Pull Request:
   ```bash
   npm run lint
   npx tsx backend/test-phase4-e2e-audit.ts
   ```

---

## 20. License

This project is developed as part of the **NEXUS Social Intelligence Initiative**. All rights reserved. Check repository distribution terms for institutional evaluation and usage guidelines.
