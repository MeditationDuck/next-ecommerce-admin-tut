import db from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { 
      name, 
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body

    if(!userId) return new NextResponse("Unauthenticated", {status: 401})

    if(!name) return new NextResponse("Missing name", {status: 400})

    if(!images || !images.length) return new NextResponse("Missing images", {status: 400})

    if(!price) return new NextResponse("Missing price", {status: 400})
    if(!categoryId) return new NextResponse("Missing categoryId", {status: 400})
    if(!colorId) return new NextResponse("Missing colorId", {status: 400})
    if(!sizeId) return new NextResponse("Missing sizeId", {status: 400})

    if(!params.productId) return new NextResponse("Missing productId", {status: 400})

    if(!params.storeId) return new NextResponse("Missing storeId", {status: 400})

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!store) return new NextResponse("Unouthrized", {status: 403})


    await db.product.update({
      where: {
        id: params.productId,
        storeId: params.storeId
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      }
    })

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
              data: [
              ...images.map((image: { url: string}) => image),
            ]
          }
        }
      }
    })

    return NextResponse.json(product)

  } catch( error ) {
    console.log('[PRODUCT_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {
    const { userId } = auth()

    if(!userId) {
      return new NextResponse("Unauthenticated", {status: 401})
    }
    
    if(!params.productId) return new NextResponse("Missing productId", {status: 400})
    if(!params.storeId) return new NextResponse("Missing storeId", {status: 400})

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!store) return new NextResponse("Unouthrized", {status: 403})

    const product = await db.product.deleteMany({
      where: {
        id: params.productId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(product)

  } catch( error ) {
    console.log('[PRODUCT_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {   
    if(!params.productId) return new NextResponse("Missing productId", {status: 400})

    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      }
    })
    return NextResponse.json(product)
  } catch( error ) {
    console.log('[PRODUCT_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  } 
}