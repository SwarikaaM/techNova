import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CircadianChartProps {
  medicationTimes: string[];
}

export const CircadianChart: React.FC<CircadianChartProps> = ({ medicationTimes }) => {
  const hours = Array.from({ length: 25 }, (_, i) => i);

  // Simulated curves
  const cortisolCurve = hours.map(h => {
    // Peak around 8 AM
    return 50 + 40 * Math.sin((h - 2) * (Math.PI / 12));
  });

  const melatoninCurve = hours.map(h => {
    // Peak around 2 AM
    return 50 + 45 * Math.sin((h - 14) * (Math.PI / 12));
  });

  const effectivenessWindow = hours.map(h => {
    // Highlight areas around medication times
    let value = 0;
    medicationTimes.forEach(time => {
      const medHour = parseInt(time.split(':')[0]);
      const diff = Math.abs(h - medHour);
      if (diff < 3) {
        value = Math.max(value, 30 * (1 - diff / 3));
      }
    });
    return value;
  });

  const data = {
    labels: hours.map(h => `${h}:00`),
    datasets: [
      {
        label: 'Cortisol',
        data: cortisolCurve,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Melatonin',
        data: melatoninCurve,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Medication Effectiveness',
        data: effectivenessWindow,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Circadian Rhythm & Medication Window',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          display: false
        },
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  return (
    <div className="h-[400px] w-full bg-white p-4 rounded-xl border border-blue-50 shadow-sm">
      <Line data={data} options={options} />
    </div>
  );
};
