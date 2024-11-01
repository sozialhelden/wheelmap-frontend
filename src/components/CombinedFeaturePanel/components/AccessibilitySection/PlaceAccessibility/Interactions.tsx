import { Accessibility, InteractionMode } from '@sozialhelden/a11yjson'
import { FC, Fragment } from 'react'

const Interaction: FC<{ interaction: InteractionMode; }> = ({ interaction }) => (
  <li>
    {JSON.stringify(interaction.name)}
    :
    {' '}
    {JSON.stringify(interaction.action)}
  </li>
)

export const Interactions: FC<{ accessibility: Accessibility | undefined }> = ({ accessibility }) => {
  if (!accessibility?.interactions) {
    return null
  }

  const { interactions } = accessibility
  const keys = Object.keys(interactions) as (keyof typeof interactions)[]
  if (keys.length <= 0) {
    return null
  }
  if (keys.length === 1) {
    const interaction = interactions[keys[0]]
    return interaction !== undefined ? <Interaction interaction={interaction} /> : null
  }

  return (
    <li>
      Here you can:
      <ul>
        <li>
          {keys.map((x) => (interactions[x] !== undefined ? <Interaction key={x} interaction={interactions[x]} /> : <Fragment key={x} />))}
        </li>
      </ul>
    </li>
  )
}
