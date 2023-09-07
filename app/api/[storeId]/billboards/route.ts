import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import db from "@/lib/prismadb"

export async function POST(
  req: Request,
  {params}: {params: { storeId: string }}
) {
  try{
    const { userId } = auth()
    const body = await req.json()

    const { label, imageUrl } = body

    if(!userId) return new NextResponse("Unauthenticated", {status: 401})

    if(!label) return new NextResponse("Missing label", {status: 400})
    if(!imageUrl) return new NextResponse("Missing image", {status: 400})

    if(!params.storeId) return new NextResponse("Missing storeId", {status: 400})

   
    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });
  

    if(!store) return new NextResponse("Unouthrized", {status: 403})

    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log('[BILLBOARD_POST]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function GET(
  req: Request,
  {params}: {params: { storeId: string }}
) {
  try{
    if(!params.storeId) return new NextResponse("Missing storeId", {status: 400})

    const billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      }
    })

    return NextResponse.json(billboards)

  } catch (error) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}