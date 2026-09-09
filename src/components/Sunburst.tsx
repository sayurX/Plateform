import React from 'react';
import Svg, { Polygon, G } from 'react-native-svg';
import { ViewStyle, View } from 'react-native';

interface SunburstProps {
  color: string;
  radius: number;
  rayCount: number;
  style?: ViewStyle;
}

export const Sunburst = ({ 
  color, 
  radius, 
  rayCount, 
  style 
}: SunburstProps) => {
  const rays = [];
  const angleStep = 90 / rayCount;

  for (let i = 0; i < rayCount; i++) {
    // Center the ray in the step
    const angle = i * angleStep + (angleStep / 2);
    const rad = (angle * Math.PI) / 180;
    
    // Wedge width
    const halfWidthAngle = (angleStep * 0.3 * Math.PI) / 180; 
    
    const innerRadius = radius * 0.15; // Start slightly away from center
    const outerRadius = radius;

    const p1x = innerRadius * Math.cos(rad - halfWidthAngle);
    const p1y = innerRadius * Math.sin(rad - halfWidthAngle);
    
    const p2x = outerRadius * Math.cos(rad - halfWidthAngle);
    const p2y = outerRadius * Math.sin(rad - halfWidthAngle);
    
    const p3x = outerRadius * Math.cos(rad + halfWidthAngle);
    const p3y = outerRadius * Math.sin(rad + halfWidthAngle);
    
    const p4x = innerRadius * Math.cos(rad + halfWidthAngle);
    const p4y = innerRadius * Math.sin(rad + halfWidthAngle);
    
    rays.push(
      <Polygon
        key={i}
        points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y} ${p4x},${p4y}`}
        fill={color}
      />
    );
  }

  return (
    <View style={[{ width: radius, height: radius }, style]}>
      <Svg width={radius} height={radius} viewBox={`0 0 ${radius} ${radius}`}>
        <G transform={`translate(0, 0)`}>
           {rays}
        </G>
      </Svg>
    </View>
  );
};
