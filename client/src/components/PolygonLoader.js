import React from 'react';

function PolygonLoader(props) {
  const size = props.size || 100;
  const color = props.color || '#ffffff'; // Orange
  const bgColor = props.bgColor || '#02aeee'; // Blue

  return React.createElement(
    'div',
    { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
    React.createElement(
      'svg',
      { width: size, height: size, viewBox: '0 0 80 80' },
      React.createElement('polygon', {
        points: '40,10 70,30 60,70 20,70 10,30',
        fill: 'none',
        stroke: color,
        strokeWidth: '6',
        strokeLinejoin: 'round',
        style: {
          strokeDasharray: 180,
          strokeDashoffset: 0,
          animation: 'polygon-spin 1.2s linear infinite'
        }
      }),
      React.createElement('circle', {
        cx: '40',
        cy: '40',
        r: '8',
        fill: bgColor,
        style: {
          animation: 'circle-pulse 1.2s ease-in-out infinite'
        }
      })
    ),
    React.createElement('style', {
      children: `
        @keyframes polygon-spin {
          0% { stroke-dashoffset: 180; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes circle-pulse {
          0%, 100% { r: 8; }
          50% { r: 16; }
        }
      `
    }),
    React.createElement('p', { style: { color: color, fontWeight: 700, marginTop: 16, fontSize: 18 } }, 'Loading...')
  );
}

export default PolygonLoader; 