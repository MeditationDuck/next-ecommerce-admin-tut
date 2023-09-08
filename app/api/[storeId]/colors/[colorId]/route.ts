import db from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, colorId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, value } = body

    if(!userId) return new NextResponse("Unauthenticated", {status: 401})

    if(!name) return new NextResponse("Missing name", {status: 400})
    if(!value) return new NextResponse("Missing value", {status: 400})

    if(!params.colorId) return new NextResponse("Missing colorId", {status: 400})

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!store) return new NextResponse("Unouthrized", {status: 403})

    const colors = await db.color.updateMany({
      where: {
        id: params.colorId,
        storeId: params.storeId
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(colors)

  } catch( error ) {
    console.log('[SIZE_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, colorId: string } }
) {
  try {
    const { userId } = auth()

    if(!userId) {
      return new NextResponse("Unauthenticated", {status: 401})
    }
    
    if(!params.colorId) return new NextResponse("Missing colorId", {status: 400})
    if(!params.storeId) return new NextResponse("Missing storeId", {status: 400})

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!store) return new NextResponse("Unouthrized", {status: 403})

    const colors = await db.color.deleteMany({
      where: {
        id: params.colorId,
        storeId: params.storeId
      }
    })
    return NextResponse.json(colors)
  } catch( error ) {
    console.log('[COLOR_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string, colorId: string } }
) {
  try {   
    if(!params.colorId) return new NextResponse("Missing colorId", {status: 400})

    const color = await db.color.findUnique({
      where: {
        id: params.colorId,
      }
    })

    return NextResponse.json(color)

  } catch( error ) {
    console.log('[COLOR_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}