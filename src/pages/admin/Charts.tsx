import PageTitle from "@/components/darkone/layout/PageTitle";
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const Charts = () => {
  // Line Chart Options
  const lineChartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: { show: false }
    },
    colors: ['#7e67fe', '#17c553'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    legend: { position: 'top' }
  };

  const lineChartSeries = [
    { name: 'Series 1', data: [31, 40, 28, 51, 42, 109, 100] },
    { name: 'Series 2', data: [11, 32, 45, 32, 34, 52, 41] }
  ];

  // Bar Chart Options
  const barChartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: { show: false }
    },
    colors: ['#7e67fe', '#17c553', '#7942ed'],
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    legend: { position: 'top' }
  };

  const barChartSeries = [
    { name: 'Net Profit', data: [44, 55, 57, 56, 61, 58, 63] },
    { name: 'Revenue', data: [76, 85, 101, 98, 87, 105, 91] },
    { name: 'Free Cash Flow', data: [35, 41, 36, 26, 45, 48, 52] }
  ];

  // Pie Chart Options
  const pieChartOptions: ApexOptions = {
    chart: { height: 350, type: 'pie' },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    colors: ['#7e67fe', '#17c553', '#7942ed', '#f9b931', '#ff6c6c'],
    legend: { position: 'bottom' },
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 200 }, legend: { position: 'bottom' } }
    }]
  };

  const pieChartSeries = [44, 55, 13, 43, 22];

  // Area Chart Options
  const areaChartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: { show: false }
    },
    colors: ['#7e67fe', '#17c553'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    legend: { position: 'top' }
  };

  const areaChartSeries = [
    { name: 'Series 1', data: [31, 40, 28, 51, 42, 109, 100] },
    { name: 'Series 2', data: [11, 32, 45, 32, 34, 52, 41] }
  ];

  return (
    <>
      <PageTitle title="Apex Charts" subTitle="Charts" />

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Line Chart</h4>
            </div>
            <div className="card-body">
              <ReactApexChart 
                options={lineChartOptions} 
                series={lineChartSeries} 
                type="line" 
                height={350} 
              />
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Bar Chart</h4>
            </div>
            <div className="card-body">
              <ReactApexChart 
                options={barChartOptions} 
                series={barChartSeries} 
                type="bar" 
                height={350} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Pie Chart</h4>
            </div>
            <div className="card-body">
              <ReactApexChart 
                options={pieChartOptions} 
                series={pieChartSeries} 
                type="pie" 
                height={350} 
              />
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Area Chart</h4>
            </div>
            <div className="card-body">
              <ReactApexChart 
                options={areaChartOptions} 
                series={areaChartSeries} 
                type="area" 
                height={350} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Charts;
