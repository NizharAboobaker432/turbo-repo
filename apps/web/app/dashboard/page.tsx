"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import { Trash2 } from 'lucide-react';

interface Pet {
  name: string;
  owner: string;
}

export default function Dashboard() {
  const [petName, setPetName] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPetName(e.target.value);
  };

  const handleOwnerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/add-pet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ petName, ownerName }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setPets(result.pets);
      setPetName('');
      setOwnerName('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/add-pet');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setPets(result.pets);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (petName: string, ownerName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/add-pet?petName=${encodeURIComponent(petName)}&ownerName=${encodeURIComponent(ownerName)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setPets(result.pets);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="ui-p-4 max-w-md mx-auto">
      <h1 className="ui-text-2xl font-bold mb-4">Pet Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <Input
          type="text"
          value={petName}
          onChange={handlePetNameChange}
          placeholder="Enter pet name"
          disabled={isLoading}
          className="ui-mb-2"
        />
        <Input
          type="text"
          value={ownerName}
          onChange={handleOwnerNameChange}
          placeholder="Enter owner name"
          disabled={isLoading}
          className="ui-mb-2"
        />
        <Button type="submit" disabled={isLoading} className="ui-w-full">
          {isLoading ? 'Adding...' : 'Add Pet'}
        </Button>
      </form>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <h2 className="ui-text-xl font-semibold mb-2">Pet List:</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : pets.length > 0 ? (
          <ul className="ui-space-y-2">
            {pets.map((pet, index) => (
              <li key={index} className="ui-bg-gray-100 p-2 rounded flex items-center">
                <span className="ui-flex-grow">{pet.name} (Owner: {pet.owner})</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(pet.name, pet.owner)}
                  disabled={isLoading}
                  className="ui-ml-2"
                >
                  <Trash2 className="ui-h-4 ui-w-4 ui-text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ui-text-gray-500">No pets available</p>
        )}
      </div>
    </div>
  );
}