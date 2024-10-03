'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';

interface DataItem {
  id: number;
  data: string;
  created_at: string;
}

export default function Dashboard() {
  const [InputData, setInputData] = useState<string>('');
  const [receivedData, setReceivedData] = useState<DataItem[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: InputData }),
      });
      if (response.ok) {
        setInputData('');
        fetchData();
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (response.ok) {
        const data: DataItem[] = await response.json();
        setReceivedData(data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to the Dashboard Page</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={InputData}
          onChange={handleInputChange}
          placeholder="Enter data"
        />
        <Button type="submit">Send Data</Button>
      </form>
      <h2>Received Data:</h2>
      <ul>
        {receivedData.map((item) => (
          <li key={item.id}>{item.data}</li>
        ))}
      </ul>
    </div>
  );
}