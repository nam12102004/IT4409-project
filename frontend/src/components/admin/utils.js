export const formatPriceAdmin = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// Màu sắc hiển thị badge trạng thái đơn hàng trong trang admin
export const getStatusColor = (status) => {
  switch (status) {
    case 'waiting_for_payment':
      return 'bg-orange-100 text-orange-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'shipping':
      return 'bg-blue-100 text-blue-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'refunded':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Chuyển status trong DB thành nhãn thân thiện (dùng cho bảng / thẻ)
export const formatStatusLabel = (status) => {
  switch (status) {
    case 'waiting_for_payment':
      return 'WAITING PAYMENT';
    case 'pending':
      return 'PENDING';
    case 'shipping':
      return 'SHIPPING';
    case 'confirmed':
      return 'CONFIRMED';
    case 'delivered':
      return 'DELIVERED';
    case 'refunded':
      return 'REFUNDED';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return (status || '').toUpperCase();
  }
};
