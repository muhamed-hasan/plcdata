# Running PLC Data Reader on Raspberry Pi

This guide provides specific instructions for deploying the PLC Data Reader application on a Raspberry Pi.

## Prerequisites

- Raspberry Pi (Model 3 or newer recommended)
- Raspberry Pi OS (Bullseye or newer)
- Node.js 18.x installed
- npm 9.x or newer

## Installation

1. Ensure you have Node.js 18 installed:
   ```bash
   node -v
   # Should show v18.x.x
   ```

2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd plc-data-reader
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Building for Raspberry Pi

The application has been configured with special build settings for Raspberry Pi's limited resources and ARM architecture compatibility.

1. Install Babel dependencies (required for ARM compatibility):
   ```bash
   npm install
   ```

2. Use the Raspberry Pi-specific build command:
   ```bash
   npm run build:pi
   ```

   This command:
   - Limits Node.js memory usage to prevent out-of-memory errors
   - Disables font optimization which causes compatibility issues on ARM architecture
   - Uses Babel instead of SWC compiler which is not compatible with Raspberry Pi's ARM architecture

3. Start the application:
   ```bash
   npm run start:pi
   ```

4. Access the application by opening a browser on the same network and navigating to:
   ```
   http://<raspberry-pi-ip-address>:3001
   ```

## Troubleshooting

### SWC Compiler Issues

If you encounter SWC-related errors like "Failed to load SWC binary for linux/arm":

1. Make sure you have the `.babelrc` file in your project root with the following content:
   ```json
   {
     "presets": [
       [
         "next/babel",
         {
           "preset-env": {
             "targets": {
               "node": "current"
             }
           }
         }
       ]
     ],
     "plugins": []
   }
   ```

2. Ensure you have the `.npmrc` file in your project root:
   ```
   legacy-peer-deps=true
   # Skip downloading platform-specific SWC binaries
   sharp_binary_host=https://npmmirror.com/mirrors/sharp
   sharp_libvips_binary_host=https://npmmirror.com/mirrors/sharp-libvips
   swc_binary_host=https://npmmirror.com/mirrors/node-swc
   next_swc_binary_host=https://npmmirror.com/mirrors/next-swc-binary
   ```

3. Try with the environment variables to explicitly disable SWC:
   ```bash
   DISABLE_SWC=true NODE_OPTIONS=--max_old_space_size=512 next build --no-lint
   ```

4. If you're still having issues, see the alternative approaches in the `FALLBACK.md` file.

### Memory Issues

If you encounter memory issues during build:

1. Increase the swap file size:
   ```bash
   sudo dphys-swapfile swapoff
   sudo nano /etc/dphys-swapfile
   # Change CONF_SWAPSIZE to 1024
   sudo dphys-swapfile setup
   sudo dphys-swapfile swapon
   ```

2. Try building in production mode with reduced workers:
   ```bash
   NODE_ENV=production NODE_OPTIONS="--max_old_space_size=512" next build --no-lint
   ```

### Network Connectivity

If the PLC connection fails:

1. Make sure your Raspberry Pi and the PLC are on the same network
2. Verify you can ping the PLC IP address from the Raspberry Pi:
   ```bash
   ping 192.168.0.1
   ```

3. Check if port 102 is accessible:
   ```bash
   nc -zv 192.168.0.1 102
   ```

## Running as a Service

To run the application as a system service that starts automatically on port 3001:

1. Create a service file:
   ```bash
   sudo nano /etc/systemd/system/plc-reader.service
   ```

2. Add the following content (adjust paths as needed):
   ```
   [Unit]
   Description=PLC Data Reader
   After=network.target

   [Service]
   Type=simple
   User=pi
   WorkingDirectory=/home/pi/plc-data-reader
   ExecStart=/usr/bin/npm run start:pi
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start the service:
   ```bash
   sudo systemctl enable plc-reader
   sudo systemctl start plc-reader
   ```

4. Check the status:
   ```bash
   sudo systemctl status plc-reader
   ``` 