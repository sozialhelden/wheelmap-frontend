import {
  Button, ControlGroup, NonIdealState, Spinner,
} from '@blueprintjs/core'
import { useSession, signIn, signOut } from 'next-auth/react'
import { t } from 'ttag'

export default function ProfilePanel() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <Spinner size={20} />
  }

  if (status === 'authenticated') {
    const username = session?.user.name
    return (
      <ControlGroup vertical style={{ margin: '2rem', alignItems: 'center' }}>
        <img
          src={session?.user.image}
          style={{
            maxWidth: '5rem', maxHeight: '5rem', borderRadius: '2.5rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          }}
        />
        <p>{t`You’re signed in as ${username}.`}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
        <pre>
          {JSON.stringify(session, null, 2)}
        </pre>
      </ControlGroup>
    )
  }

  return (
    <NonIdealState icon="user">
      <h1>{t`You are not signed in.`}</h1>
      <p>{t`Sign in to use your OpenStreetMap profile and enable advanced Wheelmap features.`}</p>
      <Button intent="primary" large onClick={() => signIn('osm')}>{t`Sign in`}</Button>
    </NonIdealState>
  )
}
