import db from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth()
    const { storeId } = params
    const body = await req.json()

    const { name } = body

    if(!userId) {
      return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!name) {
      return new NextResponse("Missing name", {status: 400})
    }


    if(!storeId) {
      return new NextResponse("Missing storeId", {status: 400})
    }

    const store = await db.store.updateMany({
      where: {
        userId,
        id: storeId
      },
      data: {
        name,
      }
    })

    if(!store) {
      return new NextResponse("Not found", {status: 404})
    }

    return NextResponse.json(store)

  } catch( error ) {
    console.log('[STORE_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth()

    const { storeId } = params


    if(!userId) {
      return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!storeId) {
      return new NextResponse("Missing storeId", {status: 400})
    }

    const store = await db.store.deleteMany({
      where: {
        userId,
        id: storeId
      }
    })

    if(!store) {
      return new NextResponse("Not found", {status: 404})
    }

    return NextResponse.json(store)

  } catch( error ) {
    console.log('[STORE_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}