export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  
  if (number >= 1e9) {
    return `$${(number / 1e9).toFixed(2)}B`;
  }
  if (number >= 1e6) {
    return `$${(number / 1e6).toFixed(2)}M`;
  }
  if (number >= 1e3) {
    return `$${(number / 1e3).toFixed(2)}K`;
  }
  return `$${number.toFixed(2)}`;
};

export const formatPercentage = (number) => {
  if (number === null || number === undefined) return '0%';
  return `${(number * 100).toFixed(2)}%`;
};

export const formatDate = (timestamp, showTime = false) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  if (showTime) {
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}; 