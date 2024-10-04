import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pets = await sql`SELECT * FROM Pets;`;
    return NextResponse.json({ pets: pets.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { petName, ownerName } = await request.json();
    if (!petName || !ownerName) throw new Error('Pet and owner names required');
    
    await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
    const pets = await sql`SELECT * FROM Pets;`;
    return NextResponse.json({ pets: pets.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const petName = searchParams.get('petName');
      const ownerName = searchParams.get('ownerName');
      if (!petName || !ownerName) throw new Error('Pet name and owner name required');
      
      const result = await sql`DELETE FROM Pets WHERE Name = ${petName} AND Owner = ${ownerName};`;
      if (result.rowCount === 0) {
        return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
      }
      const pets = await sql`SELECT * FROM Pets;`;
      return NextResponse.json({ pets: pets.rows }, { status: 200 });
    } catch (error) {
      console.error('DELETE Error:', error);
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}