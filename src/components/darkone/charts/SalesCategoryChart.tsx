import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const SalesCategoryChart = () => {
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
    labels: ["Direct", "Affilliate", "Sponsored"],
    colors: ["#7e67fe", "#17c553", "#7942ed"],
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

  const series = [44.25, 52.68, 45.98];

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
