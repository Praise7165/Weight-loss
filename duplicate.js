'use-strict';

let weightChart;

if (weightChart) {
    weightChart.destroy();
}

const ctx = document.getElementById('myChart').getContext('2d');

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      borderWidth: 2,
      fill: false,
      segment: {
        borderColor: ctx => '#00000000', // Transparent initially
      }
    }]
};

const strokeAnimation = {
    id: 'strokeAnimation',
    beforeDraw: (chart, args, options) => {
      const { ctx } = chart;
      const dataset = chart.data.datasets[0];
      const points = chart.getDatasetMeta(0).data;
      
      // Save the current canvas state
      ctx.save();
      
      // Clear the canvas
      ctx.clearRect(0, 0, chart.width, chart.height);
      
      // Get the animation progress
      const progress = chart.getAnimationMeta().progress || 0;
      
      // Draw the line with clipping
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineWidth = dataset.borderWidth;
      ctx.strokeStyle = dataset.borderColor;
      
      // Calculate total path length
      let pathLength = 0;
      for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        pathLength += Math.sqrt(dx * dx + dy * dy);
      }
      
      // Draw partial path based on animation progress
      let currentLength = 0;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);
        
        currentLength += segmentLength;
        
        if ((currentLength / pathLength) <= progress) {
          ctx.lineTo(points[i].x, points[i].y);
        } else {
          const remainingLength = pathLength * progress - (currentLength - segmentLength);
          const ratio = remainingLength / segmentLength;
          
          const endX = points[i-1].x + dx * ratio;
          const endY = points[i-1].y + dy * ratio;
          
          ctx.lineTo(endX, endY);
          break;
        }
      }
      
      ctx.stroke();
      ctx.restore();
    }
  };
  
  // Update the config to use the plugin
  const config = {
    type: 'line',
    data: data,
    options: {
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      },
      plugins: {
        strokeAnimation: {
          // Add any plugin-specific options here
        }
      }
    },
    plugins: [strokeAnimation]
  };
  
  const myChart = new Chart(ctx, config);




