import { NextResponse } from 'next/server';
import { insertData, getAllData } from './postgres'

export async function GET() {
  try {
    const data = await getAllData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    const result = await insertData(data);
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}