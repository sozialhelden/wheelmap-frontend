import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { t } from 'ttag'
import { UserIcon } from '../icons/ui-elements'
import { Spinner } from '@radix-ui/themes'

export default function SessionLink({ label, className }: { label: string, className?: string }) {
  const { data: session, status } = useSession()
  const username = session?.user.name

  if (status === 'loading') {
    return <Spinner />
  }

  if (status === 'authenticated') {
    return (
      <Link href="/me" className={className}>
        {session?.user.image && (
          <img
            src={session?.user.image}
            style={{
              maxWidth: '32px', maxHeight: '32px', borderRadius: '16px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}
        {!session?.user.image && <UserIcon />}
      </Link>
    )
  }

  return (
    <Link href="/me" className={className}>
      {t`Sign in`}
    </Link>
  )
}
