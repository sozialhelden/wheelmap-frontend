import React, { ReactNode } from 'react'
import StyledComponentsRegistry from '../lib/context/Registry'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
