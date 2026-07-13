import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * RevenueBarChart — weekly revenue bar chart (Chart.js)
 *
 * Design:
 *   - Highest bar: #0E5C5B (dark teal)
 *   - Other bars:  #CFE6E5 (light teal)
 *   - Value label on top of each bar ("5k", "10k")
 *   - Day labels on X-axis (Mon, Tue, ...)
 *   - No grid lines, no Y-axis labels
 *   - Rounded top corners (6px)
 *
 * Props:
 *   data  Array<{ day: string, revenue: number }>
 */
export default function RevenueBarChart({ data = [] }) {
  const chartRef = useRef(null);

  // Find the max value so we can highlight that bar
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 0);

  // Format "5000" → "5k", "12450" → "12k"
  const formatK = (val) => {
    if (val >= 1000) {
      const k = val / 1000;
      return Number.isInteger(k) ? `${k}k` : `${k.toFixed(1)}k`;
    }
    return String(val);
  };

  // Format tooltip value as "12,450 EGP"
  const formatEGP = (val) => `${val.toLocaleString()} EGP`;

  // Inline plugin — draws the value label above each bar
  const dataLabelsPlugin = {
    id: 'dataLabels',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);

      meta.data.forEach((bar, i) => {
        const value = chart.data.datasets[0].data[i];
        if (value == null) return;

        const label = formatK(value);
        ctx.save();
        ctx.fillStyle = '#15201F';
        ctx.font = "600 12px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        // Position the label 6px above the bar
        ctx.fillText(label, bar.x, bar.y - 6);
        ctx.restore();
      });
    },
  };

  const chartData = {
    labels: data.map((d) => d.day),
    datasets: [
      {
        label: 'Revenue',
        data: data.map((d) => d.revenue),
        // Highlight the max bar in dark teal, others in light teal
        backgroundColor: data.map((d) => (d.revenue === maxRevenue ? '#0E5C5B' : '#CFE6E5')),
        hoverBackgroundColor: data.map((d) => (d.revenue === maxRevenue ? '#0A4746' : '#BFD9D8')),
        borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 24, right: 8, left: 8, bottom: 0 },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#15201F',
        bodyColor: '#15201F',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 12,
        displayColors: false,
        titleFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 12,
          weight: '600',
        },
        bodyFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 13,
          weight: '500',
        },
        callbacks: {
          label: (ctx) => formatEGP(ctx.parsed.y),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#5A6968',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12,
          },
        },
      },
      y: {
        display: false, // hide Y-axis completely (no labels, no grid, no line)
        beginAtZero: true,
      },
    },
    animation: {
      duration: 600,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      <Bar ref={chartRef} data={chartData} options={options} plugins={[dataLabelsPlugin]} />
    </div>
  );
}
