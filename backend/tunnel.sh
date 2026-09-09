#!/bin/bash

CONFIG_FILE="../src/api/config.ts"

echo "🚀 Starting auto-restart tunnel..."

while true; do
  echo "🔗 Starting localtunnel..."
  
  # Start localtunnel and capture the URL
  URL=$(npx localtunnel --port 5001 2>&1 | grep -o 'https://[a-z0-9-]*\.loca\.lt' | head -1)
  
  if [ -n "$URL" ]; then
    echo "✅ Tunnel URL: $URL"
    
    # Update config.ts
    echo "export const API_BASE_URL = '$URL/api';" > "$CONFIG_FILE"
    echo "📝 Updated config.ts with: $URL/api"
    
    # Wait for the tunnel to die
    npx localtunnel --port 5001 2>&1 | while IFS= read -r line; do
      echo "$line"
    done
    
    echo "⚠️  Tunnel died, restarting in 2 seconds..."
    sleep 2
  else
    echo "❌ Failed to get URL, retrying in 3 seconds..."
    sleep 3
  fi
done
