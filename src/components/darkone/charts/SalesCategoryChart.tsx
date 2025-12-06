import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { salesCategoryChartSeries, salesCategoryChartLabels, chartColors } from '@/components/darkone/demo';

interface SalesCategoryChartProps {
  series?: number[];
  labels?: string[];
}

const SalesCategoryChart = ({ 
  series = salesCategoryChartSeries, 
  labels = salesCategoryChartLabels 
}: SalesCategoryChartProps) => {
  const options: ApexOptions = {
    chart: {
      height: 180,
      type: 'donut',
    },
    legend: {
      show: false
    },
    stroke: {
      width: 0
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: false,
            total: {
              showAlways: true,
              show: true
            }
          }
        }
      }
    },
    labels,
    colors: chartColors,
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        }
      }
    }],
    fill: {
      type: 'gradient'
    }
  };

  return (
    <ReactApexChart 
      options={options} 
      series={series} 
      type="donut" 
      height={180} 
    />
  );
};

export default SalesCategoryChart;
