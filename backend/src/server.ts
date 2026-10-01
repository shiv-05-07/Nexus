import { app } from './app';

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || '3001', 10);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[NEXUS Backend] HTTP Server running on http://0.0.0.0:${PORT}`);
  console.log(`[NEXUS Backend] Health Check: http://localhost:${PORT}/api/health`);
  console.log(`[NEXUS Backend] Overview API: http://localhost:${PORT}/api/overview`);
  console.log(`[NEXUS Backend] Timeline API: http://localhost:${PORT}/api/timeline`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[NEXUS Backend] SIGTERM received, closing HTTP server...');
  server.close(() => {
    console.log('[NEXUS Backend] HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[NEXUS Backend] SIGINT received, closing HTTP server...');
  server.close(() => {
    console.log('[NEXUS Backend] HTTP server closed.');
    process.exit(0);
  });
});
