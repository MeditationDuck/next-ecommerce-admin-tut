"use client"

import { StoreModal } from "@/components/modals/store-modal"
import { useEffect, useState } from "react"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  //server can not run useEffect
  useEffect(() => {
    setIsMounted(true)
  },[])

  if(!isMounted) return null // this happen in the server

  // we make sured that this run in the client
  return (
    <>
      <StoreModal />
    </>
  )
}