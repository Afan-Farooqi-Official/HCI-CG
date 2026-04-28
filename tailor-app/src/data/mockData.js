export const mockCustomers = [
  { id: 1, name: 'Ahmed Khan', phone: '0300-1234567', email: 'ahmed@email.com', address: '12 Main Street, Lahore', notes: 'Prefers slim fit', createdAt: '2026-01-15' },
  { id: 2, name: 'Sara Malik', phone: '0321-9876543', email: 'sara@email.com', address: '45 Garden Town, Karachi', notes: 'Allergic to wool', createdAt: '2026-01-20' },
  { id: 3, name: 'Bilal Ahmed', phone: '0333-5551234', email: 'bilal@email.com', address: '7 Shah Faisal Colony, Islamabad', notes: 'Regular customer since 2022', createdAt: '2026-02-01' },
  { id: 4, name: 'Zara Hussain', phone: '0345-7778899', email: 'zara@email.com', address: '23 DHA Phase 5, Lahore', notes: 'Prefers bright colors', createdAt: '2026-02-10' },
  { id: 5, name: 'Omar Sheikh', phone: '0312-4443322', email: 'omar@email.com', address: '8 Blue Area, Islamabad', notes: '', createdAt: '2026-02-15' },
  { id: 6, name: 'Fatima Noor', phone: '0322-6664455', email: 'fatima@email.com', address: '99 Gulshan-e-Iqbal, Karachi', notes: 'VIP customer', createdAt: '2026-03-01' },
];

export const mockMeasurements = [
  { id: 1, customerId: 1, chest: 40, waist: 34, hips: 38, shoulder: 17, sleeve: 25, neck: 15, thigh: 22, inseam: 32, height: 175, weight: 75, unit: 'in', date: '2026-03-10' },
  { id: 2, customerId: 2, chest: 36, waist: 28, hips: 38, shoulder: 14, sleeve: 23, neck: 13, thigh: 20, inseam: 28, height: 162, weight: 58, unit: 'in', date: '2026-03-12' },
  { id: 3, customerId: 3, chest: 42, waist: 36, hips: 40, shoulder: 18, sleeve: 26, neck: 16, thigh: 24, inseam: 33, height: 180, weight: 82, unit: 'in', date: '2026-03-15' },
  { id: 4, customerId: 4, chest: 34, waist: 26, hips: 36, shoulder: 13, sleeve: 22, neck: 12, thigh: 19, inseam: 27, height: 158, weight: 52, unit: 'in', date: '2026-03-18' },
  { id: 5, customerId: 5, chest: 44, waist: 38, hips: 42, shoulder: 18.5, sleeve: 26, neck: 16.5, thigh: 25, inseam: 34, height: 183, weight: 88, unit: 'in', date: '2026-04-01' },
  { id: 6, customerId: 6, chest: 38, waist: 30, hips: 40, shoulder: 15, sleeve: 24, neck: 13.5, thigh: 21, inseam: 29, height: 165, weight: 62, unit: 'in', date: '2026-04-05' },
];

export const mockFabrics = [
  { id: 1, name: 'Premium Cotton', type: 'Cotton', color: 'White', pricePerMeter: 450, quantity: 15, unit: 'meters' },
  { id: 2, name: 'Silk Blend', type: 'Silk', color: 'Ivory', pricePerMeter: 1200, quantity: 8, unit: 'meters' },
  { id: 3, name: 'Wool Tweed', type: 'Wool', color: 'Charcoal', pricePerMeter: 850, quantity: 1.5, unit: 'meters' },
  { id: 4, name: 'Linen Classic', type: 'Linen', color: 'Beige', pricePerMeter: 380, quantity: 20, unit: 'meters' },
  { id: 5, name: 'Chiffon Light', type: 'Chiffon', color: 'Pastel Pink', pricePerMeter: 650, quantity: 0.8, unit: 'meters' },
  { id: 6, name: 'Denim Heavy', type: 'Denim', color: 'Indigo', pricePerMeter: 520, quantity: 10, unit: 'meters' },
  { id: 7, name: 'Velvet Royal', type: 'Velvet', color: 'Deep Red', pricePerMeter: 950, quantity: 5, unit: 'meters' },
];

export const mockOrders = [
  { id: 1, customerId: 1, clothingType: "Men's Shirt", fabricId: 1, size: 'L', isCustomSize: false, price: 2500, advancePaid: 1000, dueDate: '2026-05-05', deliveryDate: null, status: 'In Progress', notes: 'Double pocket, French cuff', createdAt: '2026-04-20' },
  { id: 2, customerId: 2, clothingType: "Women's Dress", fabricId: 2, size: 'M', isCustomSize: true, price: 6500, advancePaid: 3000, dueDate: '2026-05-10', deliveryDate: null, status: 'Pending', notes: 'V-neck, knee length', createdAt: '2026-04-21' },
  { id: 3, customerId: 3, clothingType: "Suit", fabricId: 3, size: 'XL', isCustomSize: false, price: 18000, advancePaid: 9000, dueDate: '2026-05-15', deliveryDate: null, status: 'In Progress', notes: '3-piece suit, peak lapel', createdAt: '2026-04-22' },
  { id: 4, customerId: 4, clothingType: "Women's Blouse", fabricId: 5, size: 'S', isCustomSize: false, price: 3000, advancePaid: 3000, dueDate: '2026-04-28', deliveryDate: '2026-04-27', status: 'Delivered', notes: 'Butterfly sleeves', createdAt: '2026-04-15' },
  { id: 5, customerId: 5, clothingType: "Men's Trousers", fabricId: 6, size: 'XXL', isCustomSize: false, price: 3500, advancePaid: 1500, dueDate: '2026-05-08', deliveryDate: null, status: 'Ready', notes: 'Pleated front, cuffed hem', createdAt: '2026-04-23' },
  { id: 6, customerId: 6, clothingType: "Kurta", fabricId: 7, size: 'M', isCustomSize: false, price: 4200, advancePaid: 2000, dueDate: '2026-05-20', deliveryDate: null, status: 'Pending', notes: 'Embroidered collar', createdAt: '2026-04-25' },
];

export const mockInvoices = [
  { id: 1, orderId: 1, customerId: 1, items: [{ description: "Men's Shirt - Cotton", qty: 1, rate: 2500, amount: 2500 }], subtotal: 2500, discount: 0, tax: 0, total: 2500, paid: 1000, status: 'Unpaid', issuedDate: '2026-04-20', dueDate: '2026-05-05' },
  { id: 2, orderId: 2, customerId: 2, items: [{ description: "Women's Dress - Silk (Custom Size)", qty: 1, rate: 6500, amount: 6500 }], subtotal: 6500, discount: 500, tax: 0, total: 6000, paid: 3000, status: 'Unpaid', issuedDate: '2026-04-21', dueDate: '2026-05-10' },
  { id: 3, orderId: 4, customerId: 4, items: [{ description: "Women's Blouse - Chiffon", qty: 1, rate: 3000, amount: 3000 }], subtotal: 3000, discount: 0, tax: 0, total: 3000, paid: 3000, status: 'Paid', issuedDate: '2026-04-15', dueDate: '2026-04-28' },
  { id: 4, orderId: 3, customerId: 3, items: [{ description: 'Full Suit - Wool Tweed', qty: 1, rate: 18000, amount: 18000 }], subtotal: 18000, discount: 1000, tax: 0, total: 17000, paid: 9000, status: 'Unpaid', issuedDate: '2026-04-22', dueDate: '2026-05-15' },
  { id: 5, orderId: 5, customerId: 5, items: [{ description: "Men's Trousers - Denim", qty: 1, rate: 3500, amount: 3500 }], subtotal: 3500, discount: 0, tax: 0, total: 3500, paid: 1500, status: 'Overdue', issuedDate: '2026-04-10', dueDate: '2026-04-25' },
];

export const mockSizes = {
  "Men's Shirt": [
    { size: 'XS', chest: '32-34', waist: '26-28', hips: '33-35', shoulder: '14-14.5' },
    { size: 'S',  chest: '34-36', waist: '28-30', hips: '35-37', shoulder: '14.5-15' },
    { size: 'M',  chest: '38-40', waist: '32-34', hips: '38-40', shoulder: '15.5-16' },
    { size: 'L',  chest: '41-43', waist: '35-37', hips: '41-43', shoulder: '16.5-17' },
    { size: 'XL', chest: '44-46', waist: '38-40', hips: '44-46', shoulder: '17.5-18' },
    { size: '2XL', chest: '47-49', waist: '41-43', hips: '47-49', shoulder: '18.5-19' },
    { size: '3XL', chest: '50-52', waist: '44-46', hips: '50-52', shoulder: '19.5-20' },
  ],
  "Men's Trousers": [
    { size: 'XS', chest: '28',  waist: '26-27', hips: '34', shoulder: '—' },
    { size: 'S',  chest: '30',  waist: '28-29', hips: '36', shoulder: '—' },
    { size: 'M',  chest: '32',  waist: '30-31', hips: '38', shoulder: '—' },
    { size: 'L',  chest: '34',  waist: '32-33', hips: '40', shoulder: '—' },
    { size: 'XL', chest: '36',  waist: '34-35', hips: '42', shoulder: '—' },
    { size: '2XL', chest: '38', waist: '36-38', hips: '44', shoulder: '—' },
    { size: '3XL', chest: '40', waist: '39-41', hips: '46', shoulder: '—' },
  ],
  "Women's Dress": [
    { size: 'XS', chest: '30-32', waist: '22-24', hips: '32-34', shoulder: '13-13.5' },
    { size: 'S',  chest: '33-35', waist: '25-27', hips: '35-37', shoulder: '13.5-14' },
    { size: 'M',  chest: '36-38', waist: '28-30', hips: '38-40', shoulder: '14-14.5' },
    { size: 'L',  chest: '39-41', waist: '31-33', hips: '41-43', shoulder: '14.5-15' },
    { size: 'XL', chest: '42-44', waist: '34-36', hips: '44-46', shoulder: '15-15.5' },
    { size: '2XL', chest: '45-47', waist: '37-39', hips: '47-49', shoulder: '15.5-16' },
    { size: '3XL', chest: '48-50', waist: '40-42', hips: '50-52', shoulder: '16-16.5' },
  ],
  "Women's Blouse": [
    { size: 'XS', chest: '30-32', waist: '23-25', hips: '32-34', shoulder: '13-13.5' },
    { size: 'S',  chest: '33-35', waist: '26-28', hips: '35-37', shoulder: '13.5-14' },
    { size: 'M',  chest: '36-38', waist: '29-31', hips: '38-40', shoulder: '14-14.5' },
    { size: 'L',  chest: '39-41', waist: '32-34', hips: '41-43', shoulder: '14.5-15' },
    { size: 'XL', chest: '42-44', waist: '35-37', hips: '44-46', shoulder: '15-15.5' },
  ],
  "Kurta": [
    { size: 'XS', chest: '34-36', waist: '28-30', hips: '36-38', shoulder: '14-14.5' },
    { size: 'S',  chest: '37-39', waist: '31-33', hips: '39-41', shoulder: '14.5-15' },
    { size: 'M',  chest: '40-42', waist: '34-36', hips: '42-44', shoulder: '15.5-16' },
    { size: 'L',  chest: '43-45', waist: '37-39', hips: '45-47', shoulder: '16.5-17' },
    { size: 'XL', chest: '46-48', waist: '40-42', hips: '48-50', shoulder: '17.5-18' },
  ],
};

export const mockSettings = {
  shopName: 'Royal Stitch Tailors',
  address: '12 Fashion Street, Lahore',
  phone: '0300-1234567',
  email: 'royalstitch@email.com',
  currency: 'PKR',
  taxRate: 0,
  unit: 'in',
};
