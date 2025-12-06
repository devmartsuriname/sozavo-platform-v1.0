import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const RevenueChart = () => {
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
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
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
        width: 9,
        height: 9,
        radius: 6,
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
    colors: ["#7e67fe", "#17c553", "#7942ed"],
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

  const series = [
    {
      name: "Page Views",
      type: "bar",
      data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
    },
    {
      name: "Clicks",
      type: "area",
      data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
    },
    {
      name: "Revenue",
      type: "area",
      data: [12, 16, 11, 22, 28, 25, 15, 29, 35, 45, 42, 48],
    }
  ];

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
