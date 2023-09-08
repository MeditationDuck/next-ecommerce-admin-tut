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

    const { name, billboardId } = body

    if(!userId) return new NextResponse("Unauthenticated", {status: 401})

    if(!name) return new NextResponse("Missing name", {status: 400})
    if(!billboardId) return new NextResponse("Missing billboardId", {status: 400})

    if(!params.storeId) return new NextResponse("Missing storeId", {status: 400})

   
    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });
  

    if(!store) return new NextResponse("Unouthrized", {status: 403})

    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log('[CATEGORIES_POST]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function GET(
  req: Request,
  {params}: {params: { storeId: string }}
) {
  try{
    if(!params.storeId) return new NextResponse("Missing storeId", {status: 400})

    const categories = await db.category.findMany({
      where: {
        storeId: params.storeId,
      }
    })

    return NextResponse.json(categories)

  } catch (error) {
    console.log('[CATEGORIES_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}