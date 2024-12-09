import { Avatar, Box, Button, Heading, Spinner, Text } from '@radix-ui/themes'
import { useSession, signIn, signOut } from 'next-auth/react'
import { t } from 'ttag'

export default function ProfilePanel() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <Spinner />
  }

  if (status === 'authenticated' && session?.user) {
    const { name, image } = session.user;
    return (
      <Box>
        <Avatar src={image || undefined} fallback="" />
        <Text as="p">{t`You’re signed in as ${name}.`}</Text>
        <Button onClick={() => signOut()}>Sign out</Button>
      </Box>
    )
  }

  return (
    <Box>
      <Heading>{t`You are not signed in.`}</Heading>
      <Text as='p'>{t`Sign in to use your OpenStreetMap profile and enable advanced Wheelmap features.`}</Text>
      <Button onClick={() => signIn('osm')}>{t`Sign in`}</Button>
    </Box>
  )
}
