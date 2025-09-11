import { NextRequest, NextResponse } from "next/server";

// PATCH /api/users/{userId} - Update user bio and avatar
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    
    console.log("PATCH /api/users/[userId] - Request:", {
      userId,
      body: { ...body, avatar: body.avatar ? '[File Data]' : body.avatar }
    });

    // Validate request body
    const allowedFields = ['bio', 'avatar', 'fname', 'lname', 'phone', 'address'];
    const updateData: Record<string, unknown> = {};
    
    // Filter and validate allowed fields
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key) && body[key] !== undefined) {
        updateData[key] = body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Get auth token from request headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Forward the request to the backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text().catch(() => "Update failed");
      console.error("Backend API error:", {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        error: errorData
      });

      if (backendResponse.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      if (backendResponse.status === 403) {
        return NextResponse.json(
          { error: "Forbidden - You can only update your own profile" },
          { status: 403 }
        );
      }

      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: errorData || "Failed to update user profile" },
        { status: backendResponse.status }
      );
    }

    // Try to parse response, but handle text responses too
    let responseData;
    try {
      responseData = await backendResponse.json();
    } catch {
      responseData = { message: "Profile updated successfully" };
    }

    console.log("User profile updated successfully:", {
      userId,
      updatedFields: Object.keys(updateData)
    });

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("API Error - PATCH /users/[userId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
