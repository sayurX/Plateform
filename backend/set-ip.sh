#!/bin/bash
# Run this once before starting Expo to auto-set the correct local IP
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -z "$IP" ]; then
  echo "❌ Could not detect local IP. Are you connected to WiFi?"
  exit 1
fi

CONFIG_FILE="$(dirname "$0")/../src/api/config.ts"
echo "export const API_BASE_URL = 'http://$IP:5001/api';" > "$CONFIG_FILE"
echo "✅ Updated config.ts → http://$IP:5001/api"
echo "📱 Make sure your phone is on the SAME WiFi as this Mac!"
