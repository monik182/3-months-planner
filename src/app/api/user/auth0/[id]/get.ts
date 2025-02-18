import { NextRequest, NextResponse } from "next/server";
import { userHandler } from "@/db/prismaHandler";
import { SegmentData } from "@/app/types/types";

export async function GET(_: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params;

  if (!params) {
    return NextResponse.json({ message: "Invalid user data", ok: false }, { status: 400 });
  }

  try {
    const response = await userHandler.findOneByAuth0Id(params.id);

    if (!response) {
      return NextResponse.json({ message: 'User not found', ok: false }, { status: 404 });
    }

    return NextResponse.json({ ...response, ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, ok: false }, { status: 500 });
  }
}
