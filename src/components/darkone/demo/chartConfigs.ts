// Chart Demo Data Configurations
// Centralized chart data for Darkone admin dashboard
// These values match the original Darkone HTML template exactly

// Revenue Chart Series Data
export const revenueChartSeries = [
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

// Revenue Chart X-Axis Categories
export const revenueChartCategories = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Sales Category Donut Chart Data
export const salesCategoryChartSeries = [44.25, 52.68, 45.98];
export const salesCategoryChartLabels = ["Direct", "Affilliate", "Sponsored"];

// Chart Colors (consistent across all charts)
export const chartColors = ["#7e67fe", "#17c553", "#7942ed"];
