export function generateLastThreeMonthsChartData() {
  const chartData = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 3);

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const isoDate = d.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    chartData.push({ date: isoDate, entry_count: 0 });
  }

  return chartData;
}
