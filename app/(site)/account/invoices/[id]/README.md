# Invoice Detail Page

This page displays comprehensive invoice information with PDF download and print functionality, providing a professional invoice viewing experience for customers.

## URL Structure

```
/account/invoices/[id]
```

Examples:
- `/account/invoices/INV20241001001`
- `/account/invoices/INV20241002002`

## Features

### Invoice Header

Professional invoice header with:
- **Company Logo & Info**: English Pro branding with complete company details
- **Invoice Details**: Invoice number, creation date, payment date
- **Status Badge**: Clear payment status indicator

### Customer Information

Complete customer details:
- **Customer Name**: Full name of the customer
- **Email Address**: Contact email
- **Phone Number**: Contact phone
- **Billing Address**: Customer's billing address
- **Customer ID**: Unique customer identifier

### Item List

Detailed itemized list:
- **Course Name**: Full title of the purchased course
- **Course Description**: Brief description and details
- **Course Code**: Unique course identifier
- **Quantity**: Number of items (typically 1)
- **Unit Price**: Individual item price
- **Total Price**: Line item total

### Invoice Summary

Complete financial summary:
- **Subtotal**: Sum of all items before adjustments
- **Discount**: Applied discounts (if any)
- **Tax**: Tax amounts (if applicable)
- **Total**: Final amount paid

### Payment Information

Payment transaction details:
- **Payment Method**: Gateway used (MoMo, VNPay, Stripe)
- **Transaction ID**: Gateway transaction reference
- **Payment Amount**: Amount actually paid
- **Payment Status**: Success status
- **Payment Date & Time**: Exact payment timestamp

### Actions

#### Download PDF
- Downloads invoice as PDF document
- Professional formatting for records
- Includes all invoice details
- Suitable for printing or archiving

#### Print Invoice
- Opens browser print dialog
- Optimized print layout
- Removes unnecessary UI elements
- Professional printed output

## Print Optimization

### Print-Specific Features
- **Clean Layout**: Removes navigation and actions
- **Professional Styling**: Optimized colors and fonts
- **Proper Margins**: Print-friendly spacing
- **Contact Information**: Always visible in footer

### Print Media Queries
```css
@media print {
  .print\\:shadow-none    - Remove screen shadows
  .print\\:border         - Add subtle borders
  .print\\:hidden        - Hide UI elements
}
```

## Navigation

### Navigation Points
- **Orders List**: "Quay lại đơn hàng" button
- **Order Detail**: Via orders list or direct linking
- **Invoice Access**: Receipt icons on paid orders

### URL Examples
- **Direct Access**: `/account/invoices/INV20241001001`
- **From Orders**: Click receipt icon on paid orders
- **Deep Linking**: Shareable invoice URLs

## Mock Data Scenarios

### Standard Invoice Example
```javascript
{
  invoiceId: "INV20241001001",
  invoiceNumber: "INV-2024-1001",
  status: "PAID",
  total: 2000000,
  currency: "VND",
  customer: {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567"
  },
  payment: {
    method: "MoMo",
    transactionId: "TXN_M4B7C9D2E",
    status: "SUCCESS"
  }
}
```

### Invoice with Discount Example
```javascript
{
  invoiceId: "INV20241002002",
  invoiceNumber: "INV-2024-1002",
  status: "PAID",
  subtotal: 1500000,
  discount: 150000,
  total: 1350000,
  currency: "VND"
}
```

## User Interactions

### PDF Download
- Shows loading state during generation
- Downloads automatically when ready
- Filename includes invoice number
- Shows success feedback

### Print Functionality
- Opens system print dialog
- Optimized layout for printing
- Removes interactive elements
- Maintains professional appearance

### Error Handling
- User-friendly error messages
- Recovery options for failed operations
- Loading states for better UX

## Technical Implementation

### Responsive Design
- **Mobile Optimized**: Card-based layout for small screens
- **Desktop Layout**: Full-width table for larger screens
- **Print Friendly**: Special print styles for paper output

### Loading States
- **Download Indicator**: Animated icon during PDF generation
- **Print Indicator**: Visual feedback during print preparation
- **Button States**: Disabled during operations

### Data Structure
- **Company Information**: Complete business details
- **Customer Data**: Comprehensive customer records
- **Item Details**: Line item information
- **Payment Records**: Transaction history and status

## API Integration (TODO)

### Invoice Data
```javascript
// GET /api/invoices/[id]
const response = await fetch(`/api/invoices/${invoiceId}`)
const invoice = await response.json()
```

### PDF Generation
```javascript
// POST /api/invoices/[id]/pdf
const pdfResponse = await fetch(`/api/invoices/${invoiceId}/pdf`, {
  method: 'POST'
})
const pdfBlob = await pdfResponse.blob()
```

### Print Data
```javascript
// GET /api/invoices/[id]/print
const printData = await fetch(`/api/invoices/${invoiceId}/print`)
```

## Security Considerations

- **Access Control**: Users can only view their own invoices
- **Secure Downloads**: PDF generation requires authentication
- **Data Validation**: Server-side validation of invoice data
- **Audit Trail**: Log all invoice access and downloads

## Design Features

- **Professional Layout**: Clean, business-appropriate design
- **Clear Hierarchy**: Logical information organization
- **Accessibility**: Semantic HTML and ARIA labels
- **Branding Consistency**: Matches overall application design
- **Color Coding**: Status indicators and visual feedback
- **Typography**: Readable fonts with proper sizing
- **White Space**: Adequate spacing for readability