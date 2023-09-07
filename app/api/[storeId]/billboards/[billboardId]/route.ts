import db from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { label, imageUrl } = body

    if(!userId) return new NextResponse("Unauthenticated", {status: 401})

    if(!label) return new NextResponse("Missing label", {status: 400})
    if(!imageUrl) return new NextResponse("Missing image", {status: 400})

    if(!params.billboardId) return new NextResponse("Missing billboardId", {status: 400})

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!store) return new NextResponse("Unouthrized", {status: 403})


    const billboard = await db.billboard.updateMany({
      where: {
        id: params.billboardId,
        storeId: params.storeId
      },
      data: {
        label,
        imageUrl
      }
    })

    return NextResponse.json(billboard)

  } catch( error ) {
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
) {
  try {
    const { userId } = auth()

    if(!userId) {
      return new NextResponse("Unauthenticated", {status: 401})
    }
    
    if(!params.billboardId) return new NextResponse("Missing billboardId", {status: 400})
    if(!params.storeId) return new NextResponse("Missing storeId", {status: 400})

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!store) return new NextResponse("Unouthrized", {status: 403})

    const billboard = await db.billboard.deleteMany({
      where: {
        id: params.billboardId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(billboard)

  } catch( error ) {
    console.log('[BILLBOARD_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
) {
  try {   
    if(!params.billboardId) return new NextResponse("Missing billboardId", {status: 400})

    const billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      }
    })

    return NextResponse.json(billboard)

  } catch( error ) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}