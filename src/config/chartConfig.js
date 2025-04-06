/**
 * Chart configuration for the dashboard
 * This file contains default configurations for charts used throughout the application
 */

// Common chart options
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#94a3b8',
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          size: 12
        },
        boxWidth: 12,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#ffffff',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 4,
      titleFont: {
        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        size: 12
      },
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
      boxPadding: 4,
      usePointStyle: true
    }
  }
};

// Line chart configuration
export const lineChartConfig = {
  ...commonChartOptions,
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          size: 12
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          size: 12
        }
      },
      beginAtZero: true
    }
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2
    },
    point: {
      radius: 3,
      hoverRadius: 5,
      borderWidth: 2
    }
  }
};

// Bar chart configuration
export const barChartConfig = {
  ...commonChartOptions,
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          size: 12
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          size: 12
        }
      },
      beginAtZero: true
    }
  },
  elements: {
    bar: {
      borderWidth: 1,
      borderRadius: 4
    }
  }
};

// Pie chart configuration
export const pieChartConfig = {
  ...commonChartOptions,
  cutout: '0%',
  elements: {
    arc: {
      borderWidth: 1
    }
  }
};

// Doughnut chart configuration
export const doughnutChartConfig = {
  ...commonChartOptions,
  cutout: '70%',
  elements: {
    arc: {
      borderWidth: 1
    }
  }
};

// Radar chart configuration
export const radarChartConfig = {
  ...commonChartOptions,
  scales: {
    r: {
      angleLines: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      pointLabels: {
        color: '#94a3b8',
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          size: 12
        }
      },
      ticks: {
        color: '#94a3b8',
        backdropColor: 'transparent',
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          size: 12
        }
      }
    }
  },
  elements: {
    line: {
      borderWidth: 2
    },
    point: {
      radius: 3,
      hoverRadius: 5,
      borderWidth: 2
    }
  }
};

// Color palettes
export const colorPalettes = {
  primary: [
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#06b6d4', // Cyan
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#84cc16'  // Lime
  ],
  pastel: [
    'rgba(245, 158, 11, 0.7)', // Amber
    'rgba(16, 185, 129, 0.7)', // Emerald
    'rgba(59, 130, 246, 0.7)', // Blue
    'rgba(139, 92, 246, 0.7)', // Violet
    'rgba(236, 72, 153, 0.7)', // Pink
    'rgba(244, 63, 94, 0.7)',  // Rose
    'rgba(6, 182, 212, 0.7)',  // Cyan
    'rgba(20, 184, 166, 0.7)', // Teal
    'rgba(249, 115, 22, 0.7)', // Orange
    'rgba(132, 204, 22, 0.7)'  // Lime
  ],
  monochrome: [
    '#f59e0b', // Main color
    '#d97706',
    '#b45309',
    '#92400e',
    '#78350f',
    '#fbbf24',
    '#f59e0b',
    '#d97706',
    '#b45309',
    '#92400e'
  ]
};

// Helper function to get chart data with the right colors
export const getChartColors = (count, palette = 'primary') => {
  const colors = colorPalettes[palette] || colorPalettes.primary;
  return colors.slice(0, count);
};
