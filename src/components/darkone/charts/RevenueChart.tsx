import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { revenueChartSeries, revenueChartCategories, chartColors } from '@/components/darkone/demo';

interface RevenueChartProps {
  series?: typeof revenueChartSeries;
  categories?: string[];
}

const RevenueChart = ({ series = revenueChartSeries, categories = revenueChartCategories }: RevenueChartProps) => {
  const options: ApexOptions = {
    chart: {
      height: 330,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 0, 2],
      width: [0, 2, 2],
      curve: 'smooth'
    },
    fill: {
      opacity: [1, 1, 1],
      type: ['solid', 'gradient', 'gradient'],
      gradient: {
        type: "vertical",
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90]
      },
    },
    markers: {
      size: 0,
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false,
      }
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 10,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: 5,
      markers: {
        size: 6,
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        borderRadius: 3,
      },
    },
    colors: chartColors,
    tooltip: {
      shared: true,
      y: [{
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return y.toFixed(1) + "k";
          }
          return y;
        },
      },
      {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return y.toFixed(1) + "k";
          }
          return y;
        },
      },
      {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return y.toFixed(1) + "k";
          }
          return y;
        },
      }],
    },
  };

  return (
    <ReactApexChart 
      options={options} 
      series={series} 
      type="line" 
      height={330} 
    />
  );
};

export default RevenueChart;
