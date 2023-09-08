import db from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, value } = body

    if(!userId) return new NextResponse("Unauthenticated", {status: 401})

    if(!name) return new NextResponse("Missing name", {status: 400})
    if(!value) return new NextResponse("Missing value", {status: 400})

    if(!params.sizeId) return new NextResponse("Missing sizeId", {status: 400})

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!store) return new NextResponse("Unouthrized", {status: 403})

    const sizes = await db.size.updateMany({
      where: {
        id: params.sizeId,
        storeId: params.storeId
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(sizes)

  } catch( error ) {
    console.log('[SIZE_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  try {
    const { userId } = auth()

    if(!userId) {
      return new NextResponse("Unauthenticated", {status: 401})
    }
    
    if(!params.sizeId) return new NextResponse("Missing sizeId", {status: 400})
    if(!params.storeId) return new NextResponse("Missing storeId", {status: 400})

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!store) return new NextResponse("Unouthrized", {status: 403})

    const size = await db.size.deleteMany({
      where: {
        id: params.sizeId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(size)

  } catch( error ) {
    console.log('[SIZE_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  try {   
    if(!params.sizeId) return new NextResponse("Missing sizeId", {status: 400})

    const size = await db.size.findUnique({
      where: {
        id: params.sizeId,
      }
    })

    return NextResponse.json(size)

  } catch( error ) {
    console.log('[SIZE_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}