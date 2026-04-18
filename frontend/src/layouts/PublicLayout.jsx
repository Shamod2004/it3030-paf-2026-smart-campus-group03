import React from 'react'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Outlet />
    </>
  )
}
