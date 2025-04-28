# S7-1200 PLC Data Reader

This is a Next.js 14 application with TypeScript that reads data from a Siemens S7-1200 PLC using the S7comm protocol. The application provides a user-friendly interface to view real-time data from the PLC.

## Features

- Connect to Siemens S7-1200 PLC using the S7comm protocol
- Read various data types (INT, REAL, BOOL, BYTE) from different memory areas (DB, M, I, Q)
- Real-time data updates with auto-refresh capability
- Modern responsive user interface using Tailwind CSS

## PLC Connection Details

The application is configured to connect to a PLC with the following parameters:
- IP Address: 192.168.0.1
- Port: 102
- Rack: 0
- Slot: 1

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- A Siemens S7-1200 PLC configured with the IP address, port, rack, and slot mentioned above

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd plc-data-reader
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Customizing PLC Variables

To customize which variables are read from the PLC, modify the `variables` object in the file `src/app/api/plc/route.ts`. 

Here are some examples of how to address different data types:

```typescript
const variables = {
  // Read from Data Blocks (DB)
  DB1_INT: 'DB1,INT0',      // Read INT at offset 0 from DB1
  DB1_REAL: 'DB1,REAL4',    // Read REAL at offset 4 from DB1
  DB1_BOOL: 'DB1,X8.0',     // Read bit 0 of byte 8 from DB1
  
  // Read from memory areas
  M_BYTE: 'M0',             // Read byte M0
  I_BYTE: 'I0',             // Read byte I0 (Input)
  Q_BYTE: 'Q0',             // Read byte Q0 (Output)
  
  // More examples
  DB5_STRING: 'DB5,S10.20', // Read string at offset 10 with max length 20 from DB5
  DB2_DWORD: 'DB2,DWORD8',  // Read DWORD at offset 8 from DB2
  DB3_DINT: 'DB3,DINT12',   // Read DINT at offset 12 from DB3
};
```

## Troubleshooting

- **Connection Issues**: Make sure the PLC is powered on and accessible over the network. Verify that the IP address, rack, and slot are correctly configured.
- **Reading Error**: Ensure that the variable addresses specified in the application exist in your PLC program.
- **Access Rights**: Some PLCs require proper authentication or have access restrictions. Make sure your PLC is configured to allow data reading.

## Production Deployment

To build and run the application in production:

```bash
npm run build
npm start
```

## Technical Details

This project uses:
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- nodes7 for S7 communication

## Security Considerations

This application is intended for use in a secure, isolated network environment. It does not implement authentication or encryption, which would be necessary for production use in an exposed environment.

## License

This project is open source and available under the MIT License.
