import { Text, Image, Grid, GridItem } from '@chakra-ui/react'
import { decodeBase64ToImageSrc } from '../../lib/utils'

/**
 * Prop Types
 */
interface InfluencerGridProps {
  influencerAddresses: string[]
}

/**
 * Component
 */
export const InfluencerGrid = ({
  influencerAddresses,
}: InfluencerGridProps) => {
  const hasInfluencers = influencerAddresses.length > 0

  return (
    <>
      {!hasInfluencers && <Text>No influencer registered, yet.</Text>}
      {hasInfluencers && (
        <Grid templateColumns={'repeat(3, 1fr)'} gridGap={'10px'}>
          {influencerAddresses.map((uri: string, idx: number) => {
            return (
              <GridItem colSpan={1} rowSpan={1} key={idx}>
                <Image src={uri && decodeBase64ToImageSrc(uri)} />
              </GridItem>
            )
          })}
        </Grid>
      )}
    </>
  )
}
