'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PLCData {
  T1?: number;
  T2?: number;
  T3?: number;
  T4?: number;
  T5?: number;
  T6?: number;
  T7?: number;
  T8?: number;
  T9?: number;
  T10?: number;
  H1?: number;
  H2?: number;
  Air_Speed?: number;
  [key: string]: any;
}

export default function Home() {
  const [plcData, setPlcData] = useState<PLCData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Function to fetch PLC data
  const fetchPLCData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/plc');
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
        setPlcData(null);
      } else {
        setPlcData(result.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      setError('Failed to connect to the server');
      setPlcData(null);
    } finally {
      setLoading(false);
    }
  };

  // Effect for auto-refresh
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(fetchPLCData, 10000); // Refresh every 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  return (
    <div className="min-h-screen p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">S7-1200 PLC Data Reader</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Read data from Siemens S7-1200 PLC at IP: 192.168.0.1, Port: 102, Rack: 0, Slot: 1
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex gap-4">
              <button
                onClick={fetchPLCData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:bg-blue-400"
              >
                {loading ? 'Reading...' : 'Read PLC Data'}
              </button>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="autoRefresh">Auto refresh (10s)</label>
              </div>
            </div>
            
            {lastUpdated && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {lastUpdated}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {plcData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Temperature Sensors Group */}
              <div className="col-span-full mb-2">
                <h2 className="text-xl font-bold">Temperature Sensors</h2>
              </div>
              {Array.from({ length: 10 }).map((_, i) => {
                const key = `T${i + 1}`;
                return (
                  <div 
                    key={key}
                    className="border rounded-lg p-4 dark:border-gray-700"
                  >
                    <h3 className="font-bold text-lg mb-2">{key}</h3>
                    <div className="text-2xl">
                      {plcData[key] !== undefined ? plcData[key] : '-'} °C
                    </div>
                  </div>
                );
              })}
              
              {/* Humidity Sensors Group */}
              <div className="col-span-full mt-4 mb-2">
                <h2 className="text-xl font-bold">Humidity Sensors</h2>
              </div>
              {Array.from({ length: 2 }).map((_, i) => {
                const key = `H${i + 1}`;
                return (
                  <div 
                    key={key}
                    className="border rounded-lg p-4 dark:border-gray-700"
                  >
                    <h3 className="font-bold text-lg mb-2">{key}</h3>
                    <div className="text-2xl">
                      {plcData[key] !== undefined ? plcData[key] : '-'} %
                    </div>
                  </div>
                );
              })}
              
              {/* Air Speed Group */}
              <div className="col-span-full mt-4 mb-2">
                <h2 className="text-xl font-bold">Air Speed</h2>
              </div>
              <div 
                className="border rounded-lg p-4 dark:border-gray-700"
              >
                <h3 className="font-bold text-lg mb-2">Air_Speed</h3>
                <div className="text-2xl">
                  {plcData['Air_Speed'] !== undefined ? plcData['Air_Speed'].toFixed(2) : '-'} m/s
                </div>
              </div>
            </div>
          ) : !loading && !error ? (
            <div className="text-center text-gray-600 dark:text-gray-400 py-8">
              Click "Read PLC Data" to fetch data from the PLC
            </div>
          ) : null}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">About This Application</h2>
          <p className="mb-4">
            This application reads data from a Siemens S7-1200 PLC using the S7comm protocol.
            It connects to the PLC at IP: 192.168.0.1, Port: 102, Rack: 0, Slot: 1.
          </p>
          <p className="mb-4">
            The application reads 12 Integer variables (T1-T10, H1-H2) and 1 Real variable (Air_Speed) from DB1.
            Data is automatically refreshed every 10 seconds when auto-refresh is enabled.
          </p>
          <p>
            To customize the variables read from the PLC, modify the variables object in the API route
            at <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">src/app/api/plc/route.ts</code>.
          </p>
        </div>
      </main>
    </div>
  );
}
