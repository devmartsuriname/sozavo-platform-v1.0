import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
}

const SparklineChart = ({ 
  data, 
  color = "#7e67fe", 
  height = 50 
}: SparklineChartProps) => {
  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: height,
      sparkline: {
        enabled: true
      }
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    markers: {
      size: 0
    },
    colors: [color],
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => ''
        }
      },
      marker: {
        show: false
      }
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        type: "vertical",
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100]
      },
    },
  };

  const series = [{
    data: data
  }];

  return (
    <ReactApexChart 
      options={options} 
      series={series} 
      type="area" 
      height={height} 
    />
  );
};

export default SparklineChart;
