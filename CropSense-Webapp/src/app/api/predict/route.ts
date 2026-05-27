import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Ensure the user has uploaded a file
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ detail: "No file provided" }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL || "https://kaliboii-cropsense.hf.space/predict";
    const hfToken = process.env.HF_TOKEN;

    const headers: HeadersInit = {};
    if (hfToken) {
      headers["Authorization"] = `Bearer ${hfToken}`;
    }

    // Forward the request to the Hugging Face Space backend
    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      // Forward the error from the backend if possible
      return NextResponse.json(
        { detail: `Backend Error ${backendResponse.status}: ${errorText}` },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { detail: `Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
